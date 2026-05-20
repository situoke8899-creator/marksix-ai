'use client'

import React from 'react'

const PLAY_CONFIG = {
  macau: {
    key: 'macau',
    name: '澳门',
    api: '/api/history?play=macau',
  },
  hongkong: {
    key: 'hongkong',
    name: '香港',
    api: '/api/history?play=hongkong',
  },
}

function formatNumber(num) {
  return String(num || '').padStart(2, '0')
}

function formatMoney(value) {
  const num = Number(value || 0)
  return `¥${num.toFixed(2)}`
}

function calculateProfit(hitCount, testedCount, totalBetPerIssue = 3600, odds = 47) {
  const betPerNumber = totalBetPerIssue / 36
  const returnPerHit = betPerNumber * odds
  const totalCost = testedCount * totalBetPerIssue
  const totalReturn = hitCount * returnPerHit
  const profit = totalReturn - totalCost

  return {
    totalCost,
    totalReturn,
    profit,
  }
}

function makeStrategies() {
  const samples = [30, 50, 80, 100, 150]
  const hotCounts = [18, 20, 22, 24, 26, 28, 30]

  const modes = [
    {
      key: 'all',
      label: '全部开奖号统计',
    },
    {
      key: 'special',
      label: '只统计特码',
    },
    {
      key: 'specialWeight',
      label: '特码加权',
    },
    {
      key: 'omitSpecial',
      label: '特码遗漏加权',
    },
  ]

  const strategies = []

  samples.forEach((sampleSize) => {
    hotCounts.forEach((hotCount) => {
      modes.forEach((mode) => {
        strategies.push({
          id: `${mode.key}-${sampleSize}-${hotCount}`,
          mode: mode.key,
          modeLabel: mode.label,
          sampleSize,
          hotCount,
          coldCount: 36 - hotCount,
          label: `${mode.label}｜前${sampleSize}期｜热${hotCount}+冷${36 - hotCount}`,
        })
      })
    })
  })

  return strategies
}

function buildRecommend(beforeHistory, strategy) {
  const source = beforeHistory.slice(0, strategy.sampleSize)

  const scores = {}
  const lastSpecialIndex = {}

  for (let i = 1; i <= 49; i++) {
    scores[i] = 0
    lastSpecialIndex[i] = -1
  }

  source.forEach((item, index) => {
    const numbers = item.numbers || []
    const specialNumber = numbers[numbers.length - 1]

    if (strategy.mode === 'all') {
      numbers.forEach((num) => {
        scores[num] += 1
      })
    }

    if (strategy.mode === 'special') {
      if (specialNumber) scores[specialNumber] += 1
    }

    if (strategy.mode === 'specialWeight') {
      numbers.forEach((num) => {
        scores[num] += 1
      })

      if (specialNumber) {
        scores[specialNumber] += 3
      }
    }

    if (strategy.mode === 'omitSpecial') {
      if (specialNumber) {
        scores[specialNumber] += 3

        if (lastSpecialIndex[specialNumber] === -1) {
          lastSpecialIndex[specialNumber] = index
        }
      }
    }
  })

  if (strategy.mode === 'omitSpecial') {
    for (let i = 1; i <= 49; i++) {
      const lastIndex = lastSpecialIndex[i]
      const omitValue = lastIndex === -1 ? strategy.sampleSize : lastIndex
      const omitScore = Math.min(omitValue, 30) * 0.18
      scores[i] += omitScore
    }
  }

  const ranking = Object.entries(scores).map(([num, score]) => ({
    num: Number(num),
    count: Number(score.toFixed(2)),
  }))

  const hotNumbers = [...ranking]
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.num - b.num
    })
    .slice(0, strategy.hotCount)

  const coldNumbers = [...ranking]
    .sort((a, b) => {
      if (a.count !== b.count) return a.count - b.count
      return a.num - b.num
    })
    .slice(0, strategy.coldCount)

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
    hotNumbers,
    coldNumbers,
    recommendNumbers,
  }
}

function buildTop20AggregateRecommend(beforeHistory, aggregateStrategies = [], hotCount = 36, coldCount = 0) {
  const occurrenceMap = new Map()

  for (let i = 1; i <= 49; i++) {
    occurrenceMap.set(i, {
      num: i,
      count: 0,
      scoreTotal: 0,
      type: 'hot',
    })
  }

  const usableStrategies = aggregateStrategies
    .filter((strategy) => strategy && beforeHistory.length >= strategy.sampleSize)
    .slice(0, 20)

  usableStrategies.forEach((strategy) => {
    const analysis = buildRecommend(beforeHistory, strategy)

    analysis.recommendNumbers.forEach((item) => {
      const old = occurrenceMap.get(item.num)

      occurrenceMap.set(item.num, {
        ...old,
        count: old.count + 1,
        scoreTotal: old.scoreTotal + Number(item.count || 0),
      })
    })
  })

  const rankingHigh = Array.from(occurrenceMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    if (b.scoreTotal !== a.scoreTotal) return b.scoreTotal - a.scoreTotal
    return a.num - b.num
  })

  const hotNumbers = rankingHigh.slice(0, hotCount).map((item) => ({
    num: item.num,
    count: item.count,
    scoreTotal: Number(item.scoreTotal.toFixed(2)),
    type: 'hot',
  }))

  const hotSet = new Set(hotNumbers.map((item) => item.num))

  const coldNumbers = rankingHigh
    .filter((item) => !hotSet.has(item.num))
    .sort((a, b) => {
      if (a.count !== b.count) return a.count - b.count
      if (a.scoreTotal !== b.scoreTotal) return a.scoreTotal - b.scoreTotal
      return a.num - b.num
    })
    .slice(0, coldCount)
    .map((item) => ({
      num: item.num,
      count: item.count,
      scoreTotal: Number(item.scoreTotal.toFixed(2)),
      type: 'cold',
    }))

  const recommendNumbers = [...hotNumbers, ...coldNumbers].sort(
    (a, b) => a.num - b.num
  )

  return {
    hotNumbers,
    coldNumbers,
    recommendNumbers,
  }
}

function buildRecommendByStrategy(beforeHistory, strategy) {
  if (strategy?.mode === 'aggregateTop20') {
    return buildTop20AggregateRecommend(
      beforeHistory,
      strategy.aggregateStrategies || [],
      strategy.hotCount || 36,
      strategy.coldCount || 0
    )
  }

  return buildRecommend(beforeHistory, strategy)
}

function getRequiredSampleSize(strategy) {
  if (strategy?.mode === 'aggregateTop20') {
    const sizes = (strategy.aggregateStrategies || []).map((item) => item.sampleSize || 0)
    return sizes.length ? Math.min(...sizes) : 30
  }

  return strategy?.sampleSize || 30
}

function testStrategy(history, strategy, rangeSize) {
  const rows = []

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const target = history[index]
    const beforeHistory = history.slice(index + 1)

    if (beforeHistory.length < getRequiredSampleSize(strategy)) continue

    const analysis = buildRecommendByStrategy(beforeHistory, strategy)
    const specialNumber = target.numbers[target.numbers.length - 1]

    const recommendSet = new Set(analysis.recommendNumbers.map((item) => item.num))
    const hotSet = new Set(analysis.hotNumbers.map((item) => item.num))
    const coldSet = new Set(analysis.coldNumbers.map((item) => item.num))

    const hit = recommendSet.has(specialNumber)
    const hotHit = hotSet.has(specialNumber)
    const coldHit = coldSet.has(specialNumber)

    rows.push({
      expect: target.expect,
      openTime: target.openTime,
      numbers: target.numbers,
      specialNumber,
      hit,
      hotHit,
      coldHit,
      ...analysis,
    })
  }

  const testedCount = rows.length
  const hitCount = rows.filter((item) => item.hit).length
  const hotHitCount = rows.filter((item) => item.hotHit).length
  const coldHitCount = rows.filter((item) => item.coldHit).length

  const hitRate = testedCount ? Number(((hitCount / testedCount) * 100).toFixed(2)) : 0
  const hotHitRate = testedCount ? Number(((hotHitCount / testedCount) * 100).toFixed(2)) : 0
  const coldHitRate = testedCount ? Number(((coldHitCount / testedCount) * 100).toFixed(2)) : 0

  return {
    testedCount,
    hitCount,
    hotHitCount,
    coldHitCount,
    hitRate,
    hotHitRate,
    coldHitRate,
    rows,
  }
}

function buildStrategyRanking(history) {
  const strategies = makeStrategies()

  const baseResults = strategies.map((strategy) => {
    const result100 = testStrategy(history, strategy, 100)
    const result50 = testStrategy(history, strategy, 50)

    return {
      ...strategy,
      result100,
      result50,
      score: Number((result100.hitRate * 0.7 + result50.hitRate * 0.3).toFixed(2)),
    }
  })

  const sortedBaseResults = [...baseResults].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.result100.hitRate !== a.result100.hitRate) return b.result100.hitRate - a.result100.hitRate
    return b.result50.hitRate - a.result50.hitRate
  })

  const top20BaseStrategies = sortedBaseResults.slice(0, 20)

  const aggregateCombos = [
    {
      hotCount: 36,
      coldCount: 0,
      label: '20档位综合｜前20档×36码｜出现率最高36码',
    },
    {
      hotCount: 30,
      coldCount: 6,
      label: '20档位综合｜30热+6冷｜前20档出现率',
    },
    {
      hotCount: 26,
      coldCount: 10,
      label: '20档位综合｜26热+10冷｜前20档出现率',
    },
    {
      hotCount: 24,
      coldCount: 12,
      label: '20档位综合｜24热+12冷｜前20档出现率',
    },
    {
      hotCount: 18,
      coldCount: 18,
      label: '20档位综合｜18热+18冷｜前20档出现率',
    },
  ]

  const aggregateStrategies = aggregateCombos.map((combo) => {
    const aggregateStrategyBase = {
      id: `aggregate-top20-${combo.hotCount}-${combo.coldCount}`,
      mode: 'aggregateTop20',
      modeLabel: `20档位综合 ${combo.hotCount}热+${combo.coldCount}冷`,
      sampleSize: 30,
      hotCount: combo.hotCount,
      coldCount: combo.coldCount,
      label: combo.label,
      aggregateStrategies: top20BaseStrategies,
    }

    const aggregateResult100 = testStrategy(history, aggregateStrategyBase, 100)
    const aggregateResult50 = testStrategy(history, aggregateStrategyBase, 50)

    return {
      ...aggregateStrategyBase,
      result100: aggregateResult100,
      result50: aggregateResult50,
      score: Number((aggregateResult100.hitRate * 0.7 + aggregateResult50.hitRate * 0.3).toFixed(2)),
    }
  })

  const results = [...aggregateStrategies, ...sortedBaseResults]

  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.result100.hitRate !== a.result100.hitRate) return b.result100.hitRate - a.result100.hitRate
    return b.result50.hitRate - a.result50.hitRate
  })
}

function buildSingleBacktest(history, targetExpect, strategy) {
  if (!history?.length || !targetExpect || !strategy) return null

  const targetIndex = history.findIndex(
    (item) => String(item.expect) === String(targetExpect)
  )

  if (targetIndex === -1) return null

  const target = history[targetIndex]
  const beforeHistory = history.slice(targetIndex + 1)

  if (beforeHistory.length < getRequiredSampleSize(strategy)) return null

  const analysis = buildRecommendByStrategy(beforeHistory, strategy)
  const specialNumber = target.numbers[target.numbers.length - 1]

  const recommendSet = new Set(analysis.recommendNumbers.map((item) => item.num))
  const hotSet = new Set(analysis.hotNumbers.map((item) => item.num))
  const coldSet = new Set(analysis.coldNumbers.map((item) => item.num))

  const hit = recommendSet.has(specialNumber)
  const hotHit = hotSet.has(specialNumber)
  const coldHit = coldSet.has(specialNumber)

  return {
    target,
    specialNumber,
    hit,
    hotHit,
    coldHit,
    ...analysis,
  }
}

function getShortStrategyLabel(strategy) {
  if (!strategy) return ''

  if (strategy.mode === 'aggregateTop20') {
    return `${strategy.hotCount}热+${strategy.coldCount}冷`
  }

  return strategy.label
    .replace('全部开奖号统计｜', '全开｜')
    .replace('只统计特码｜', '特码｜')
    .replace('特码加权｜', '加权｜')
    .replace('特码遗漏加权｜', '遗漏｜')
}

function buildTop20DrawStats(history, strategyRanking, rangeSize = 30) {
  if (!history?.length || !strategyRanking?.length) return null

  const top20 = strategyRanking.slice(0, 20)
  const latest = history[0]
  const latestSpecial = latest?.numbers?.[latest.numbers.length - 1]

  const latestStats = top20.map((strategy, index) => {
    const result = buildSingleBacktest(history, latest.expect, strategy)

    return {
      rank: index + 1,
      strategy,
      label: getShortStrategyLabel(strategy),
      expect: latest.expect,
      openTime: latest.openTime,
      specialNumber: latestSpecial,
      hit: Boolean(result?.hit),
      hotHit: Boolean(result?.hotHit),
      coldHit: Boolean(result?.coldHit),
      status: result?.hotHit ? '热码命中' : result?.coldHit ? '冷码命中' : result?.hit ? '命中' : '未中',
    }
  })

  const hitRanks = latestStats.filter((item) => item.hit)

  const recentRows = history.slice(0, rangeSize).map((draw) => {
    const specialNumber = draw?.numbers?.[draw.numbers.length - 1]

    const cells = top20.map((strategy, index) => {
      const result = buildSingleBacktest(history, draw.expect, strategy)

      return {
        rank: index + 1,
        strategy,
        hit: Boolean(result?.hit),
        hotHit: Boolean(result?.hotHit),
        coldHit: Boolean(result?.coldHit),
        status: result?.hotHit ? '热中' : result?.coldHit ? '冷中' : result?.hit ? '中' : '未中',
      }
    })

    return {
      expect: draw.expect,
      openTime: draw.openTime,
      specialNumber,
      cells,
    }
  })

  return {
    latest,
    latestSpecial,
    latestStats,
    hitRanks,
    recentRows,
  }
}

export default function Top20StatsPage() {
  const [currentPlay, setCurrentPlay] = React.useState('macau')
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [totalBetPerIssue, setTotalBetPerIssue] = React.useState(3600)
  const [odds, setOdds] = React.useState(47)

  const playConfig = PLAY_CONFIG[currentPlay]
  const history = data?.history || []

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      setData(null)

      const res = await fetch(playConfig.api, {
        cache: 'no-store',
      })

      const text = await res.text()

      if (!text || !text.trim()) {
        throw new Error(`${playConfig.name}接口返回空内容`)
      }

      let json

      try {
        json = JSON.parse(text)
      } catch (error) {
        throw new Error(`${playConfig.name}接口返回不是JSON`)
      }

      if (!json.ok) {
        throw new Error(json.message || `${playConfig.name}数据获取失败`)
      }

      setData(json)
    } catch (err) {
      setError(err.message || '数据获取失败')
    } finally {
      setLoading(false)
    }
  }, [playConfig.api, playConfig.name])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const strategyRanking = React.useMemo(() => {
    if (!history.length) return []
    return buildStrategyRanking(history)
  }, [history])

  const top20DrawStats = React.useMemo(() => {
    if (!history.length || !strategyRanking.length) return null
    return buildTop20DrawStats(history, strategyRanking, 30)
  }, [history, strategyRanking])

  const latest = history[0]

  return (
    <main className="page">
      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 28px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 30%),
            linear-gradient(135deg, #07111f, #020617 60%, #111827);
          color: #ffffff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .hero {
          max-width: 1320px;
          margin: 0 auto 18px;
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
        }

        h1 {
          margin: 0 0 10px;
          font-size: 34px;
          font-weight: 900;
        }

        .desc {
          color: #cbd5e1;
          line-height: 1.6;
          margin: 0;
        }

        .switch-row {
          margin-top: 16px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          border: 0;
          border-radius: 14px;
          padding: 12px 18px;
          cursor: pointer;
          font-weight: 900;
          background: linear-gradient(135deg, #facc15, #f97316);
          color: #111827;
        }

        .btn.secondary {
          background: #111827;
          color: #ffffff;
          border: 1px solid #334155;
        }

        .btn.active {
          outline: 3px solid #facc15;
        }

        .card {
          max-width: 1320px;
          margin: 16px auto;
          padding: 20px;
          border-radius: 22px;
          background: rgba(15, 23, 42, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
        }

        .card-title {
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .stat {
          padding: 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .stat span {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 8px;
        }

        .stat strong {
          font-size: 20px;
          font-weight: 900;
        }

        .error {
          max-width: 1320px;
          margin: 18px auto;
          padding: 18px;
          border-radius: 16px;
          background: rgba(127, 29, 29, 0.8);
          border: 1px solid #ef4444;
          color: #ffffff;
        }

        .hit-rank-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 16px 0;
        }

        .hit-rank-chip {
          padding: 9px 13px;
          border-radius: 999px;
          background: #facc15;
          color: #111827;
          font-size: 14px;
          font-weight: 900;
        }

        .no-hit-chip {
          padding: 9px 13px;
          border-radius: 999px;
          background: #374151;
          color: #e5e7eb;
          font-size: 14px;
          font-weight: 800;
        }

        .table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 14px;
          margin-top: 16px;
          background: #0f172a;
        }

        table {
          width: max-content;
          min-width: 1100px;
          border-collapse: collapse;
          color: #ffffff;
          font-size: 14px;
        }

        th,
        td {
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 10px 12px;
          text-align: center;
          white-space: nowrap;
        }

        th {
          background: rgba(255, 255, 255, 0.08);
          color: #f8fafc;
          font-weight: 900;
        }

        .left {
          text-align: left;
        }

        .hit {
          color: #facc15;
          font-weight: 900;
        }

        .miss {
          color: #94a3b8;
          font-weight: 800;
        }

        .recent-table {
          min-width: 1500px;
        }

        .hit-cell {
          background: rgba(250, 204, 21, 0.18);
          color: #facc15;
          font-weight: 900;
        }

        .miss-cell {
          color: #94a3b8;
          font-weight: 800;
        }

        .control-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 14px;
        }

        input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: #111827;
          color: #ffffff;
          border: 1px solid #334155;
          font-weight: 800;
          box-sizing: border-box;
        }

        .back-link {
          display: inline-flex;
          margin-top: 14px;
          color: #93c5fd;
          text-decoration: none;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .hero {
            display: block;
          }

          .summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>

      <section className="hero">
        <div>
          <h1>20档位当期开奖统计</h1>
          <p className="desc">
            独立页面：统计策略排行榜前20个档位，每个档位筛选36码后，是否命中当期最后的特码；并展示近30期中奖 / 不中奖明细。
          </p>

          <a className="back-link" href="/">
            返回主筛选页面
          </a>

          <div className="switch-row">
            <button
              className={`btn secondary ${currentPlay === 'macau' ? 'active' : ''}`}
              onClick={() => setCurrentPlay('macau')}
            >
              澳门玩法
            </button>

            <button
              className={`btn secondary ${currentPlay === 'hongkong' ? 'active' : ''}`}
              onClick={() => setCurrentPlay('hongkong')}
            >
              香港玩法
            </button>
          </div>
        </div>

        <button className="btn" onClick={loadData} disabled={loading}>
          {loading ? '刷新中...' : '刷新数据'}
        </button>
      </section>

      {error && <div className="error">{error}</div>}

      {loading && !data && (
        <section className="card">
          <div className="card-title">正在抓取{playConfig.name}数据...</div>
        </section>
      )}

      {data && top20DrawStats && (
        <>
          <section className="card">
            <div className="card-title">
              {playConfig.name}｜第 {latest?.expect} 期当期开奖统计
            </div>

            <p className="desc">
              当期最后特码：{formatNumber(top20DrawStats.latestSpecial)}。
              下面统计当前策略排行榜前20名档位，每个档位筛选36码后，是否命中当期最后的特码。
            </p>

            <div className="summary-grid">
              <div className="stat">
                <span>最新开奖期号</span>
                <strong>第 {latest?.expect} 期</strong>
              </div>

              <div className="stat">
                <span>开奖日期</span>
                <strong>{latest?.openTime || '-'}</strong>
              </div>

              <div className="stat">
                <span>当期最后特码</span>
                <strong>{formatNumber(top20DrawStats.latestSpecial)}</strong>
              </div>

              <div className="stat">
                <span>前20名命中档位</span>
                <strong>{top20DrawStats.hitRanks.length} 个</strong>
              </div>
            </div>

            <div className="control-grid">
              <div className="stat">
                <span>每期总投入</span>
                <input
                  type="number"
                  value={totalBetPerIssue}
                  onChange={(e) => setTotalBetPerIssue(Number(e.target.value) || 0)}
                />
              </div>

              <div className="stat">
                <span>赔率</span>
                <input
                  type="number"
                  step="0.1"
                  value={odds}
                  onChange={(e) => setOdds(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="hit-rank-list">
              {top20DrawStats.hitRanks.length ? (
                top20DrawStats.hitRanks.map((item) => (
                  <div key={`hit-rank-${item.rank}`} className="hit-rank-chip">
                    第{item.rank}名：{item.status}
                  </div>
                ))
              ) : (
                <div className="no-hit-chip">当期前20名档位暂无命中</div>
              )}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>档位策略</th>
                    <th>当期最后特码</th>
                    <th>是否命中</th>
                    <th>近100期命中</th>
                    <th>近50期命中</th>
                    <th>100期盈亏</th>
                  </tr>
                </thead>

                <tbody>
                  {top20DrawStats.latestStats.map((item) => {
                    const profit = calculateProfit(
                      item.strategy.result100?.hitCount || 0,
                      item.strategy.result100?.testedCount || 0,
                      totalBetPerIssue,
                      odds
                    )

                    return (
                      <tr key={`latest-stat-${item.rank}`}>
                        <td>第{item.rank}名</td>
                        <td className="left">{item.label}</td>
                        <td>{formatNumber(item.specialNumber)}</td>
                        <td className={item.hit ? 'hit' : 'miss'}>{item.status}</td>
                        <td>
                          {item.strategy.result100?.hitCount || 0} / {item.strategy.result100?.testedCount || 0}
                          {' '}
                          = {item.strategy.result100?.hitRate || 0}%
                        </td>
                        <td>
                          {item.strategy.result50?.hitCount || 0} / {item.strategy.result50?.testedCount || 0}
                          {' '}
                          = {item.strategy.result50?.hitRate || 0}%
                        </td>
                        <td
                          style={{
                            color: profit.profit >= 0 ? '#22c55e' : '#f87171',
                            fontWeight: 900,
                          }}
                        >
                          {formatMoney(profit.profit)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="card-title">近30期前20名档位中奖 / 不中奖列表</div>

            <p className="desc">
              每一行是一期开奖结果，每一列是当前策略排行榜前20名档位。
              中 = 该档位36码命中当期最后特码；未中 = 没有命中。
            </p>

            <div className="table-wrap">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>日期 / 期数</th>
                    <th>当期最后特码</th>
                    {top20DrawStats.latestStats.map((item) => (
                      <th key={`head-rank-${item.rank}`}>
                        第{item.rank}名
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {top20DrawStats.recentRows.map((row) => (
                    <tr key={`recent-row-${row.expect}`}>
                      <td>{row.openTime} 第{row.expect}期</td>
                      <td>{formatNumber(row.specialNumber)}</td>

                      {row.cells.map((cell) => (
                        <td
                          key={`recent-cell-${row.expect}-${cell.rank}`}
                          className={cell.hit ? 'hit-cell' : 'miss-cell'}
                          title={cell.strategy.label}
                        >
                          {cell.hit ? cell.status : '未中'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  )
}
