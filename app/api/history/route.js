import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function parseOpenCode(openCode) {
  if (!openCode) return []

  if (Array.isArray(openCode)) {
    return openCode
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
  }

  return String(openCode)
    .split(',')
    .map((n) => Number(String(n).trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
}

function parseExpectOrder(expect) {
  const text = String(expect || '')
  const onlyNumber = Number(text.replace(/\D/g, ''))
  return Number.isFinite(onlyNumber) ? onlyNumber : 0
}

function parseDateTime(value) {
  if (!value) return 0

  const text = String(value).trim()

  // 16/05/2026
  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (dmy) {
    return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}T00:00:00`).getTime()
  }

  // 2026-05-16
  const ymd = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (ymd) {
    return new Date(`${ymd[1]}-${ymd[2]}-${ymd[3]}T00:00:00`).getTime()
  }

  const normal = new Date(text).getTime()
  return Number.isFinite(normal) ? normal : 0
}

function sortHistory(list) {
  return [...list].sort((a, b) => {
    const tb = parseDateTime(b.openTime)
    const ta = parseDateTime(a.openTime)

    if (tb !== ta) return tb - ta

    const eb = parseExpectOrder(b.expect)
    const ea = parseExpectOrder(a.expect)

    return eb - ea
  })
}

async function fetchText(url) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    },
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`接口请求失败：${url}`)
  }

  return text
}

async function fetchJson(url) {
  const text = await fetchText(url)

  if (text.trim().startsWith('<')) {
    throw new Error(`接口返回网页，不是开奖JSON：${url}`)
  }

  return JSON.parse(text)
}

function normalizeMacauItem(item) {
  const numbers = parseOpenCode(item.openCode)

  if (numbers.length < 7) return null

  return {
    expect: String(item.expect || ''),
    openTime: item.openTime || '',
    openCode: numbers.slice(0, 7).join(','),
    numbers: numbers.slice(0, 7),
    wave: item.wave || '',
    zodiac: item.zodiac || '',
  }
}

function normalizeHongKongItem(item) {
  const numbers = parseOpenCode(item.numbers || item.openCode)

  if (!item.expect) return null
  if (numbers.length < 7) return null

  return {
    expect: String(item.expect || ''),
    openTime: item.openTime || '',
    openCode: numbers.slice(0, 7).join(','),
    numbers: numbers.slice(0, 7),
    wave: '',
    zodiac: '',
    source: item.source || '',
  }
}

function buildAnalysis(historySource, recentCount = 100) {
  const recentHistory = historySource.slice(0, recentCount)

  const counts = {}

  for (let i = 1; i <= 49; i++) {
    counts[i] = 0
  }

  recentHistory.forEach((item) => {
    item.numbers.forEach((num) => {
      counts[num] = (counts[num] || 0) + 1
    })
  })

  const ranking = Object.entries(counts).map(([num, count]) => ({
    num: Number(num),
    count,
  }))

  const hotNumbers = [...ranking]
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.num - b.num
    })
    .slice(0, 24)

  const coldNumbers = [...ranking]
    .sort((a, b) => {
      if (a.count !== b.count) return a.count - b.count
      return a.num - b.num
    })
    .slice(0, 12)

  const recommendMap = new Map()

  hotNumbers.forEach((item) => {
    recommendMap.set(item.num, {
      ...item,
      type: 'hot',
    })
  })

  coldNumbers.forEach((item) => {
    recommendMap.set(item.num, {
      ...item,
      type: recommendMap.has(item.num) ? 'hot' : 'cold',
    })
  })

  const recommendNumbers = Array.from(recommendMap.values()).sort(
    (a, b) => a.num - b.num
  )

  return {
    recentCount: recentHistory.length,
    hotNumbers,
    coldNumbers,
    recommendNumbers,
    ranking: ranking.sort((a, b) => a.num - b.num),
  }
}

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<\/div>/gi, ' ')
    .replace(/<\/li>/gi, ' ')
    .replace(/<\/td>/gi, ' ')
    .replace(/<\/tr>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/')
    .replace(/&#47;/g, '/')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function collectNumbersFromBlock(block) {
  const numbers = []
  const numberMatches = String(block || '').match(/\b([1-9]|[1-4]\d)\b/g) || []

  for (const n of numberMatches) {
    const num = Number(n)

    if (num >= 1 && num <= 49) {
      numbers.push(num)
    }

    if (numbers.length >= 7) break
  }

  return numbers.slice(0, 7)
}

function parseRowsByExpectAndDate(html, sourceName) {
  const text = stripHtml(html)
  const rows = []

  // 26/052 16/05/2026 11 25 28 36 41 43 22
  const markerRegex = /(\d{2}\/\d{3})\s+(\d{2}\/\d{2}\/\d{4})/g
  const markers = []
  let match

  while ((match = markerRegex.exec(text)) !== null) {
    markers.push({
      index: match.index,
      expect: match[1],
      openTime: match[2],
      endIndex: markerRegex.lastIndex,
    })
  }

  for (let i = 0; i < markers.length; i++) {
    const current = markers[i]
    const next = markers[i + 1]
    const block = text.slice(
      current.endIndex,
      next ? next.index : current.endIndex + 700
    )

    const numbers = collectNumbersFromBlock(block)

    if (numbers.length >= 7) {
      rows.push({
        expect: current.expect,
        openTime: current.openTime,
        numbers,
        source: sourceName,
      })
    }
  }

  return rows
}

function parseRowsByDateAndExpect(html, sourceName) {
  const text = stripHtml(html)
  const rows = []

  // Mark Six 16/05/2026 ... No 26/052 ... 11 25 28 36 41 43 22
  const regex =
    /(\d{2}\/\d{2}\/\d{4})[\s\S]{0,160}?(?:No|Draw|Draw Number)?\s*(\d{2}\/\d{3})([\s\S]{0,700}?)(?=\d{2}\/\d{2}\/\d{4}[\s\S]{0,160}?(?:No|Draw|Draw Number)?\s*\d{2}\/\d{3}|$)/g

  let match

  while ((match = regex.exec(text)) !== null) {
    const openTime = match[1]
    const expect = match[2]
    const block = match[3] || ''

    const numbers = collectNumbersFromBlock(block)

    if (numbers.length >= 7) {
      rows.push({
        expect,
        openTime,
        numbers,
        source: sourceName,
      })
    }
  }

  return rows
}

function parseLotteryHkHtml(html) {
  return parseRowsByExpectAndDate(html, 'lottery.hk')
}

function parseLotteryExtremeHtml(html) {
  const rows = []

  rows.push(...parseRowsByDateAndExpect(html, 'lotteryextreme.com'))
  rows.push(...parseRowsByExpectAndDate(html, 'lotteryextreme.com'))

  return rows
}

function parseLottolyzerHtml(html) {
  const text = stripHtml(html)
  const rows = []

  // 页面常见格式：
  // Draw Date 26/052 Saturday 16th May 2026 Winning No. Extra 11 25 28 36 41 43 + 22
  const regex =
    /(\d{2}\/\d{3})\s+([A-Za-z]+)?\s*(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})([\s\S]{0,900}?)(?=\d{2}\/\d{3}\s+[A-Za-z]+?\s*\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}|$)/g

  const monthMap = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  }

  let match

  while ((match = regex.exec(text)) !== null) {
    const expect = match[1]
    const day = String(match[3]).padStart(2, '0')
    const month = monthMap[String(match[4]).toLowerCase()]
    const year = match[5]
    const block = match[6] || ''

    if (!month) continue

    const openTime = `${day}/${month}/${year}`
    const numbers = collectNumbersFromBlock(block)

    if (numbers.length >= 7) {
      rows.push({
        expect,
        openTime,
        numbers,
        source: 'lottolyzer.com',
      })
    }
  }

  rows.push(...parseRowsByExpectAndDate(html, 'lottolyzer.com'))

  return rows
}

function parseMagayoHtml(html) {
  const text = stripHtml(html)
  const rows = []

  // 这个源通常没有期号，只作为最后兜底。
  // 格式类似：14 May 2026 Thursday 23 27 30 34 45 47 Extra 28
  const regex =
    /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})[\s\S]{0,120}?((?:\b[0-4]?\d\b[\s\S]{0,30}?){7})/g

  const monthMap = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  }

  let match
  let fakeIndex = 1

  while ((match = regex.exec(text)) !== null) {
    const day = String(match[1]).padStart(2, '0')
    const month = monthMap[String(match[2]).toLowerCase()]
    const year = match[3]
    const block = match[4] || ''

    if (!month) continue

    const openTime = `${day}/${month}/${year}`
    const numbers = collectNumbersFromBlock(block)

    if (numbers.length >= 7) {
      rows.push({
        expect: `MAGAYO-${year}${month}${day}-${fakeIndex}`,
        openTime,
        numbers,
        source: 'magayo.com',
      })

      fakeIndex += 1
    }
  }

  return rows
}

async function fetchHongKongFromSources() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const previousYear = currentYear - 1

  const sources = [
    {
      name: 'lottery.hk current year',
      url: `https://lottery.hk/en/mark-six/results/${currentYear}`,
      parser: parseLotteryHkHtml,
    },
    {
      name: 'lottery.hk previous year',
      url: `https://lottery.hk/en/mark-six/results/${previousYear}`,
      parser: parseLotteryHkHtml,
    },
    {
      name: 'lottery.hk latest',
      url: 'https://lottery.hk/en/mark-six/results/',
      parser: parseLotteryHkHtml,
    },
    {
      name: 'lotteryextreme archive',
      url: 'https://www.lotteryextreme.com/marksix/results',
      parser: parseLotteryExtremeHtml,
    },
    {
      name: 'lotteryextreme latest',
      url: 'https://www.lotteryextreme.com/marksix/',
      parser: parseLotteryExtremeHtml,
    },
    {
      name: 'lottolyzer history',
      url: 'https://en.lottolyzer.com/history/hong-kong/mark-six/page/1/per-page/50/detail-view',
      parser: parseLottolyzerHtml,
    },
    {
      name: 'lottolyzer latest',
      url: 'https://en.lottolyzer.com/result/hong-kong/mark-six',
      parser: parseLottolyzerHtml,
    },
    {
      name: 'magayo recent',
      url: 'https://www.magayo.com/lotto/hong-kong/mark-six-results/',
      parser: parseMagayoHtml,
    },
  ]

  let allRows = []
  const sourceStatus = []

  for (const source of sources) {
    try {
      const html = await fetchText(source.url)
      const rows = source.parser(html)

      sourceStatus.push({
        name: source.name,
        url: source.url,
        count: rows.length,
        ok: rows.length > 0,
      })

      allRows = allRows.concat(rows)
    } catch (error) {
      sourceStatus.push({
        name: source.name,
        url: source.url,
        count: 0,
        ok: false,
        error: error.message,
      })

      console.log(`香港数据源失败：${source.name}`, error.message)
    }
  }

  return {
    rows: allRows,
    sourceStatus,
  }
}

function buildHongKongNextExpect(history) {
  const latest = history?.[0]

  if (!latest?.expect) return '等待下期开奖'

  const expectText = String(latest.expect)

  // 26/052 -> 26/053
  const hkMatch = expectText.match(/^(\d{2})\/(\d{3})$/)

  if (hkMatch) {
    const yearPart = hkMatch[1]
    const issuePart = String(Number(hkMatch[2]) + 1).padStart(3, '0')
    return `${yearPart}/${issuePart}`
  }

  return '等待下期开奖'
}

async function getMacauData() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const previousYear = currentYear - 1

  const historyUrls = [
    `https://history.macaumarksix.com/history/macaujc2/y/${currentYear}`,
    `https://history.macaumarksix.com/history/macaujc2/y/${previousYear}`,
  ]

  let allHistory = []

  for (const url of historyUrls) {
    try {
      const json = await fetchJson(url)

      if (Array.isArray(json?.data)) {
        allHistory = allHistory.concat(json.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const uniqueMap = new Map()

  allHistory.forEach((item) => {
    const normalized = normalizeMacauItem(item)

    if (!normalized?.expect) return

    uniqueMap.set(normalized.expect, normalized)
  })

  let latest = null

  try {
    const latestJson = await fetchJson('https://macaumarksix.com/api/macaujc2.com')

    if (Array.isArray(latestJson) && latestJson[0]?.openCode) {
      const normalizedLatest = normalizeMacauItem(latestJson[0])

      if (normalizedLatest?.expect) {
        latest = normalizedLatest
        uniqueMap.set(normalizedLatest.expect, normalizedLatest)
      }
    }
  } catch (error) {
    console.log(error.message)
  }

  const history = sortHistory(Array.from(uniqueMap.values()))

  if (!history.length) {
    throw new Error('没有获取到澳门历史开奖数据，请稍后刷新重试')
  }

  latest = latest || history[0]

  const currentAnalysis = buildAnalysis(history, 100)

  const latestNumber = Number(latest.expect)
  const nextExpect = Number.isFinite(latestNumber)
    ? String(latestNumber + 1)
    : ''

  return {
    ok: true,
    play: 'macau',
    source: 'macaujc.com',
    latest,
    nextExpect,
    history: history.slice(0, 400),
    recentHistory: history.slice(0, 30),
    updatedAt: new Date().toISOString(),
    ...currentAnalysis,
  }
}

async function getHongKongData() {
  const uniqueMap = new Map()

  const { rows, sourceStatus } = await fetchHongKongFromSources()

  rows.forEach((item) => {
    const normalized = normalizeHongKongItem(item)

    if (!normalized?.expect) return

    // 如果是 magayo 这种没有真实期号的兜底源，用日期做 key。
    const key = String(normalized.expect).startsWith('MAGAYO-')
      ? `${normalized.openTime}-${normalized.openCode}`
      : normalized.expect

    uniqueMap.set(key, normalized)
  })

  const history = sortHistory(Array.from(uniqueMap.values()))

  if (!history.length) {
    throw new Error(
      '没有获取到香港历史开奖数据，请稍后刷新重试。可能是备用网址被 Vercel 暂时拦截，或页面结构改变。'
    )
  }

  const latest = history[0]
  const currentAnalysis = buildAnalysis(history, 100)
  const nextExpect = buildHongKongNextExpect(history)

  return {
    ok: true,
    play: 'hongkong',
    source: 'lottery.hk / lotteryextreme / lottolyzer / magayo',
    sourceStatus,
    latest,
    nextExpect,
    history: history.slice(0, 400),
    recentHistory: history.slice(0, 30),
    updatedAt: new Date().toISOString(),
    ...currentAnalysis,
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const play = searchParams.get('play') || 'macau'

    if (play === 'hongkong') {
      const data = await getHongKongData()
      return NextResponse.json(data)
    }

    const data = await getMacauData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || '获取开奖数据失败，请稍后重试',
      },
      {
        status: 500,
      }
    )
  }
}
