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

  // 例如：16/05/2026
  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (dmy) {
    return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}T00:00:00`).getTime()
  }

  // 例如：2026-05-16
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
      accept: 'text/html,application/json',
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
    openCode: numbers.join(','),
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
    openCode: numbers.join(','),
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
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseHongKongStaticHtml(html) {
  const text = stripHtml(html)
  const rows = []

  // 目标格式类似：
  // 26/052 16/05/2026 11 25 28 36 41 43 + 22
  const regex =
    /(\d{2}\/\d{3})\s+(\d{2}\/\d{2}\/\d{4})([\s\S]*?)(?=\d{2}\/\d{3}\s+\d{2}\/\d{2}\/\d{4}|$)/g

  let match

  while ((match = regex.exec(text)) !== null) {
    const expect = match[1]
    const openTime = match[2]
    const block = match[3] || ''

    const numbers = []
    const numberMatches = block.match(/\b([1-9]|[1-4]\d)\b/g) || []

    for (const n of numberMatches) {
      const num = Number(n)

      if (num >= 1 && num <= 49) {
        numbers.push(num)
      }

      if (numbers.length >= 7) break
    }

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

async function fetchHongKongFromStaticSource() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const previousYear = currentYear - 1

  const urls = [
    'https://lottery.hk/en/mark-six/results/',
    `https://lottery.hk/en/mark-six/results/${currentYear}`,
    `https://lottery.hk/en/mark-six/results/${previousYear}`,
  ]

  let allRows = []

  for (const url of urls) {
    try {
      const html = await fetchText(url)
      const rows = parseHongKongStaticHtml(html)
      allRows = allRows.concat(rows)
    } catch (error) {
      console.log('香港备用源抓取失败：', error.message)
    }
  }

  return allRows
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

  const staticRows = await fetchHongKongFromStaticSource()

  staticRows.forEach((item) => {
    const normalized = normalizeHongKongItem(item)

    if (!normalized?.expect) return

    uniqueMap.set(normalized.expect, normalized)
  })

  const history = sortHistory(Array.from(uniqueMap.values()))

  if (!history.length) {
    throw new Error('没有获取到香港历史开奖数据，请稍后刷新重试')
  }

  const latest = history[0]
  const currentAnalysis = buildAnalysis(history, 100)

  // 香港不是每天开奖，所以这里先不强行 +1。
  // 后面如果你要显示准确“下一期开奖日期/期号”，再单独接香港官方开奖日历。
  const nextExpect = '等待下期开奖'

  return {
    ok: true,
    play: 'hongkong',
    source: 'lottery.hk',
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
