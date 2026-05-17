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
      accept: 'application/json,text/plain,*/*',
      'user-agent': 'Mozilla/5.0',
    },
  })

  if (!res.ok) {
    throw new Error(`Fetch failed: ${url}`)
  }

  return res.json()
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

    const historyResults = await Promise.allSettled(
      historyUrls.map((url) => fetchJson(url))
    )

    let allHistory = []

    historyResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        const data = result.value?.data

        if (Array.isArray(data)) {
          allHistory = allHistory.concat(data)
        }
      }
    })

    const uniqueMap = new Map()

    allHistory.forEach((item) => {
      if (!item?.expect || !item?.openCode) return

      const numbers = parseOpenCode(item.openCode)

      if (numbers.length < 6) return

      uniqueMap.set(String(item.expect), {
        expect: String(item.expect),
        openTime: item.openTime || '',
        openCode: item.openCode,
        numbers,
        wave: item.wave || '',
        zodiac: item.zodiac || '',
      })
    })

    let history = sortHistory(Array.from(uniqueMap.values()))

    let latest = history[0] || null

    try {
      const latestData = await fetchJson('https://macaumarksix.com/api/macaujc2.com')

      if (Array.isArray(latestData) && latestData[0]?.openCode) {
        const latestItem = latestData[0]
        const latestNumbers = parseOpenCode(latestItem.openCode)

        latest = {
          expect: String(latestItem.expect),
          openTime: latestItem.openTime || '',
          openCode: latestItem.openCode,
          numbers: latestNumbers,
          wave: latestItem.wave || '',
          zodiac: latestItem.zodiac || '',
        }

        if (!uniqueMap.has(String(latest.expect))) {
          history.unshift(latest)
        }
      }
    } catch (error) {
      console.log('Latest fetch failed, using history latest only.')
    }

    history = sortHistory(history)

    const recentCount = 100
    const recentHistory = history.slice(0, recentCount)

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

    const nextExpect = latest?.expect
      ? String(Number(latest.expect) + 1)
      : ''

    return NextResponse.json({
      ok: true,
      source: 'macaujc.com',
      latest,
      nextExpect,
      recentCount: recentHistory.length,
      hotNumbers,
      coldNumbers,
      recommendNumbers,
      ranking: ranking.sort((a, b) => a.num - b.num),
      recentHistory: recentHistory.slice(0, 20),
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: '获取开奖数据失败，请稍后重试',
        error: error.message,
      },
      {
        status: 500,
      }
    )
  }
}
