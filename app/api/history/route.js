import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function parseOpenCode(value) {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
  }

  return String(value)
    .split(/[,，\s|/]+/)
    .map((n) => Number(String(n).trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
}

function parseDateTime(value) {
  if (!value) return 0

  const text = String(value).trim()

  const ymd = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (ymd) {
    return new Date(
      `${ymd[1]}-${String(ymd[2]).padStart(2, '0')}-${String(ymd[3]).padStart(2, '0')}T00:00:00`
    ).getTime()
  }

  const dmy = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (dmy) {
    return new Date(
      `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}T00:00:00`
    ).getTime()
  }

  const normal = new Date(text).getTime()
  return Number.isFinite(normal) ? normal : 0
}

function sortHistory(list) {
  return [...list].sort((a, b) => {
    const tb = parseDateTime(b.openTime)
    const ta = parseDateTime(a.openTime)

    if (tb !== ta) return tb - ta

    const eb = Number(String(b.expect || '').replace(/\D/g, ''))
    const ea = Number(String(a.expect || '').replace(/\D/g, ''))

    return eb - ea
  })
}

async function fetchText(url) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept: 'application/json,text/html,*/*',
      'user-agent': 'Mozilla/5.0',
    },
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`接口请求失败：${url}`)
  }

  if (!text || !text.trim()) {
    throw new Error(`接口返回空内容：${url}`)
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

async function postFormJson(url, formData) {
  const body = new URLSearchParams(formData)

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://6hch.com',
      referer: 'https://6hch.com/',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148 Safari/537.36',
    },
    body,
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`接口请求失败：${url}`)
  }

  if (!text || !text.trim()) {
    throw new Error(`接口返回空内容：${url}`)
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`接口返回不是JSON：${text.slice(0, 200)}`)
  }
}

function normalizeDate(value) {
  const text = String(value || '').trim()

  const ymd = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (ymd) {
    return `${ymd[1]}-${String(ymd[2]).padStart(2, '0')}-${String(ymd[3]).padStart(2, '0')}`
  }

  const dmy = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (dmy) {
    return `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`
  }

  return text
}

function normalizeHongKongExpect(issue, openTime) {
  const text = String(issue || '').trim()

  const hk = text.match(/^(\d{2})\/(\d{3})$/)
  if (hk) return `${hk[1]}/${hk[2]}`

  const full = text.match(/^20(\d{2})(\d{3})/)
  if (full) return `${full[1]}/${full[2]}`

  const pure = text.match(/(\d{1,3})/)
  if (pure) {
    const yearMatch = String(openTime || '').match(/^20(\d{2})/)
    const yearPart = yearMatch
      ? yearMatch[1]
      : String(new Date().getFullYear()).slice(-2)

    const issuePart = String(Number(pure[1])).padStart(3, '0')
    return `${yearPart}/${issuePart}`
  }

  return text
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
  const numbers = parseOpenCode(item.openCode || item.numbers)

  if (!item.expect) return null
  if (!item.openTime) return null
  if (numbers.length < 7) return null

  return {
    expect: normalizeHongKongExpect(item.expect, item.openTime),
    openTime: normalizeDate(item.openTime),
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

function buildHongKongNextExpect(history) {
  const latest = history?.[0]

  if (!latest?.expect) return '等待下期开奖'

  const match = String(latest.expect).match(/^(\d{2})\/(\d{3})$/)

  if (!match) return '等待下期开奖'

  const yearPart = match[1]
  const issuePart = String(Number(match[2]) + 1).padStart(3, '0')

  return `${yearPart}/${issuePart}`
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
  const now = new Date()
  const currentYear = now.getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]

  const uniqueMap = new Map()
  const sourceStatus = []

  for (const year of years) {
    try {
      const json = await postFormJson(
        'https://1680660.com/smallSix/findSmallSixHistory.do',
        {
          year: String(year),
          type: '1',
        }
      )

      const list = Array.isArray(json?.history)
        ? json.history
        : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : []

      let count = 0

      list.forEach((item) => {
        const normalized = normalizeHongKongItem(item)

        if (!normalized?.expect) return

        uniqueMap.set(normalized.expect, normalized)
        count += 1
      })

      sourceStatus.push({
        year,
        ok: count > 0,
        count,
      })
    } catch (error) {
      sourceStatus.push({
        year,
        ok: false,
        count: 0,
        error: error.message,
      })

      console.log(`香港接口抓取失败：${year}`, error.message)
    }
  }

  const history = sortHistory(Array.from(uniqueMap.values()))

  if (!history.length) {
    throw new Error('没有获取到香港历史开奖数据，请稍后刷新重试')
  }

  const latest = history[0]
  const currentAnalysis = buildAnalysis(history, 100)
  const nextExpect = buildHongKongNextExpect(history)

  return {
    ok: true,
    play: 'hongkong',
    source: '1680660.com/smallSix/findSmallSixHistory.do',
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
