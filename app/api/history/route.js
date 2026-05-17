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

  // 2026-05-16
  const ymd = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (ymd) {
    return new Date(`${ymd[1]}-${ymd[2]}-${ymd[3]}T00:00:00`).getTime()
  }

  // 16/05/2026
  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (dmy) {
    return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}T00:00:00`).getTime()
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
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
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
  if (!item.openTime) return null
  if (numbers.length < 7) return null

  return {
    expect: String(item.expect || ''),
    openTime: item.openTime || '',
    openCode: numbers.slice(0, 7).join(','),
    numbers: numbers.slice(0, 7),
    wave: '',
    zodiac: '',
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

function getNumbersFromText(text) {
  const matches = String(text || '').match(/\b([1-9]|[1-4]\d)\b/g) || []
  const numbers = []

  for (const item of matches) {
    const num = Number(item)

    if (num >= 1 && num <= 49) {
      numbers.push(num)
    }

    if (numbers.length >= 7) break
  }

  return numbers.slice(0, 7)
}

function convertHongKongDate(dateText) {
  const text = String(dateText || '').trim()

  // 2026-05-16
  const ymd = text.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`

  // 16/05/2026
  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`

  return text
}

function normalizeHongKongExpect(expectText) {
  const text = String(expectText || '').trim()

  // 52期 -> 26/052
  const pure = text.match(/^(\d{1,3})期?$/)
  if (pure) {
    const issue = String(Number(pure[1])).padStart(3, '0')
    return `26/${issue}`
  }

  // 26/052
  const hk = text.match(/^(\d{2})\/(\d{3})$/)
  if (hk) return `${hk[1]}/${hk[2]}`

  return text
}

function parse6hchRowsFromHtmlTable(html) {
  const rows = []

  const trRegex = /<tr[\s\S]*?<\/tr>/gi
  const trList = String(html || '').match(trRegex) || []

  for (const tr of trList) {
    const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi
    const cells = []
    let cellMatch

    while ((cellMatch = cellRegex.exec(tr)) !== null) {
      cells.push(stripHtml(cellMatch[1]))
    }

    if (cells.length < 3) continue

    const firstCell = cells[0] || ''

    // 目标格式：2026-05-16 52期
    const dateMatch = firstCell.match(/(\d{4}-\d{2}-\d{2})/)
    const issueMatch = firstCell.match(/(\d{1,3})\s*期/)

    if (!dateMatch || !issueMatch) continue

    const openTime = convertHongKongDate(dateMatch[1])
    const expect = normalizeHongKongExpect(issueMatch[1])

    const normalNumbers = getNumbersFromText(cells[1] || '')
    const specialNumbers = getNumbersFromText(cells[2] || '')

    if (normalNumbers.length < 6 || specialNumbers.length < 1) continue

    rows.push({
      expect,
      openTime,
      numbers: [...normalNumbers.slice(0, 6), specialNumbers[0]],
    })
  }

  return rows
}

function parse6hchRowsFromPlainText(html) {
  const text = stripHtml(html)
  const rows = []

  // 目标格式：
  // 2026-05-16 52期 25 马 43 鼠 41 虎 28 兔 11 猴 36 羊 22 鸡
  const rowRegex =
    /(\d{4}-\d{2}-\d{2})\s+(\d{1,3})\s*期([\s\S]*?)(?=\d{4}-\d{2}-\d{2}\s+\d{1,3}\s*期|$)/g

  let match

  while ((match = rowRegex.exec(text)) !== null) {
    const openTime = convertHongKongDate(match[1])
    const expect = normalizeHongKongExpect(match[2])
    const block = match[3] || ''
    const numbers = getNumbersFromText(block)

    if (numbers.length >= 7) {
      rows.push({
        expect,
        openTime,
        numbers: numbers.slice(0, 7),
      })
    }
  }

  return rows
}

function parse6hchRowsFromJsonLikeText(html) {
  const rows = []
  const text = String(html || '')

  // 兼容页面脚本里出现的 JSON 数据：
  // "date":"2026-05-16","expect":"52","code":"25,43,41,28,11,36,22"
  const jsonRegex =
    /(?:date|openTime|opentime)["']?\s*[:=]\s*["'](\d{4}-\d{2}-\d{2})["'][\s\S]{0,300}?(?:expect|issue|qihao|period)["']?\s*[:=]\s*["']?(\d{1,3}|26\/\d{3})["']?[\s\S]{0,500}?(?:openCode|code|numbers|num)["']?\s*[:=]\s*["']?([0-9,\s]+)["']?/gi

  let match

  while ((match = jsonRegex.exec(text)) !== null) {
    const openTime = convertHongKongDate(match[1])
    const expect = normalizeHongKongExpect(match[2])
    const numbers = getNumbersFromText(match[3])

    if (numbers.length >= 7) {
      rows.push({
        expect,
        openTime,
        numbers: numbers.slice(0, 7),
      })
    }
  }

  return rows
}

function parse6hchHistory(html) {
  const allRows = [
    ...parse6hchRowsFromHtmlTable(html),
    ...parse6hchRowsFromPlainText(html),
    ...parse6hchRowsFromJsonLikeText(html),
  ]

  const uniqueMap = new Map()

  allRows.forEach((item) => {
    const normalized = normalizeHongKongItem(item)

    if (!normalized) return

    uniqueMap.set(normalized.expect, normalized)
  })

  return sortHistory(Array.from(uniqueMap.values()))
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
  const url = 'https://6hch.com/html/kaihistory.html'
  const html = await fetchText(url)

  const history = parse6hchHistory(html)

  if (!history.length) {
    throw new Error(
      '没有从 6hch 获取到香港历史开奖数据。可能是页面数据由接口动态加载，或者 Vercel 当前访问该站被拦截。'
    )
  }

  const latest = history[0]
  const currentAnalysis = buildAnalysis(history, 100)
  const nextExpect = buildHongKongNextExpect(history)

  return {
    ok: true,
    play: 'hongkong',
    source: '6hch.com',
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
