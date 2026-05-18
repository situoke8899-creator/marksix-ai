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
    .split(/[,，\s|/]+/)
    .map((n) => Number(String(n).trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
}

function sortHistory(list) {
  return [...list].sort((a, b) => {
    const ea = Number(String(a.expect || '').replace(/\D/g, ''))
    const eb = Number(String(b.expect || '').replace(/\D/g, ''))

    if (eb !== ea) return eb - ea

    const ta = new Date(a.openTime || 0).getTime()
    const tb = new Date(b.openTime || 0).getTime()

    return tb - ta
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

async function getHongKongData(request) {
  const baseUrl = new URL(request.url).origin
  const hkTestUrl = `${baseUrl}/api/hk-test`

  const res = await fetch(hkTestUrl, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'user-agent': 'Mozilla/5.0',
    },
  })

  const text = await res.text()

  if (!text || !text.trim()) {
    throw new Error('香港测试接口返回空内容')
  }

  let json

  try {
    json = JSON.parse(text)
  } catch (error) {
    throw new Error(`香港测试接口返回不是JSON：${text.slice(0, 200)}`)
  }

  if (!json.ok) {
    throw new Error(json.message || '香港测试接口没有返回有效数据')
  }

  const history = Array.isArray(json.history) ? json.history : []

  if (!history.length) {
    throw new Error('香港测试接口没有返回历史开奖数据')
  }

  const currentAnalysis = buildAnalysis(history, 100)

  return {
    ok: true,
    play: 'hongkong',
    source: '1680660.com/smallSix/findSmallSixHistory.do',
    latest: json.latest || history[0],
    nextExpect: json.nextExpect || '等待下期开奖',
    history: history.slice(0, 400),
    recentHistory: history.slice(0, 30),
    sourceStatus: json.sourceStatus || [],
    updatedAt: new Date().toISOString(),
    ...currentAnalysis,
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const play = searchParams.get('play') || 'macau'

    if (play === 'hongkong') {
      const data = await getHongKongData(request)
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
