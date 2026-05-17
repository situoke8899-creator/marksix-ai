import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function parseOpenCode(openCode) {
  if (!openCode) return []

  return String(openCode)
    .split(',')
    .map((n) => Number(String(n).trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
}

function sortHistory(list) {
  return [...list].sort((a, b) => {
    const ea = Number(a.expect || 0)
    const eb = Number(b.expect || 0)

    if (eb !== ea) return eb - ea

    const ta = new Date(a.openTime || 0).getTime()
    const tb = new Date(b.openTime || 0).getTime()

    return tb - ta
  })
}

async function fetchJson(url) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept: 'application/json',
      'user-agent': 'Mozilla/5.0',
    },
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`接口请求失败：${url}`)
  }

  if (text.trim().startsWith('<')) {
    throw new Error(`接口返回网页，不是开奖JSON：${url}`)
  }

  return JSON.parse(text)
}

function normalizeItem(item) {
  const numbers = parseOpenCode(item.openCode)

  if (numbers.length < 6) return null

  return {
    expect: String(item.expect || ''),
    openTime: item.openTime || '',
    openCode: item.openCode || '',
    numbers,
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

export async function GET() {
  try {
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
      const normalized = normalizeItem(item)

      if (!normalized?.expect) return

      uniqueMap.set(normalized.expect, normalized)
    })

    let latest = null

    try {
      const latestJson = await fetchJson('https://macaumarksix.com/api/macaujc2.com')

      if (Array.isArray(latestJson) && latestJson[0]?.openCode) {
        const normalizedLatest = normalizeItem(latestJson[0])

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
      throw new Error('没有获取到历史开奖数据，请稍后刷新重试')
    }

    latest = latest || history[0]

    const currentAnalysis = buildAnalysis(history, 100)

    const nextExpect = latest?.expect
      ? String(Number(latest.expect) + 1)
      : ''

    return NextResponse.json({
      ok: true,
      source: 'macaujc.com',
      latest,
      nextExpect,
      history: history.slice(0, 400),
      recentHistory: history.slice(0, 30),
      updatedAt: new Date().toISOString(),
      ...currentAnalysis,
    })
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
