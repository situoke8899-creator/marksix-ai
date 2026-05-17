'use client'

import React from 'react'

const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

const PLAY_CONFIG = {
  macau: {
    key: 'macau',
    name: '澳门',
    badge: '澳门六合彩特码多策略回测',
    api: '/api/history?play=macau',
  },
  hongkong: {
    key: 'hongkong',
    name: '香港',
    badge: '香港六合彩特码多策略回测',
    api: '/api/history?play=hongkong',
  },
}

function getWave(num) {
  if (redWave.includes(Number(num))) return 'red'
  if (blueWave.includes(Number(num))) return 'blue'
  return 'green'
}

function formatMoney(value) {
  const num = Number(value || 0)
  return `¥${num.toFixed(2)}`
}


function getNextExpectByPlay(history, data, currentPlay) {
  if (data?.nextExpect) return data.nextExpect
  if (!history?.[0]?.expect) return ''

  const latestExpect = String(history[0].expect)

  if (currentPlay === 'macau') {
    const num = Number(latestExpect)
    if (!Number.isNaN(num)) return String(num + 1)
    return latestExpect
  }

  // 香港不是每天开奖，最好由后端返回 nextExpect。
  return '等待下期开奖'
}

function calculateProfit(hitCount, testedCount, totalBetPerIssue = 3600, odds = 47) {
  const betPerNumber = totalBetPerIssue / 36
  const returnPerHit = betPerNumber * odds
  const totalCost = testedCount * totalBetPerIssue
  const totalReturn = hitCount * returnPerHit
  const profit = totalReturn - totalCost
  const roi = totalCost ? ((profit / totalCost) * 100).toFixed(2) : '0.00'

  return {
    betPerNumber,
    returnPerHit,
    totalCost,
    totalReturn,
    profit,
    roi,
  }
}

function Ball({ num, count, type, small = false, hit = false, hitType = 'special' }) {
  const wave = getWave(Number(num))

 const outlineColor = hit
  ? hitType === 'normal'
    ? '#fde68a'
    : '#facc15'
  : undefined
  return (
    <div className={`ball-box ${small ? 'small' : ''}`}>
      <div
        className={`ball ${wave}`}
        style={
          hit
            ? {
                outline: `4px solid ${outlineColor}`,
                boxShadow: `0 0 18px ${outlineColor}`,
              }
            : undefined
        }
      >
        {String(num).padStart(2, '0')}
      </div>

      {typeof count === 'number' && (
        <div className="ball-count">{count}分</div>
      )}

      {type && (
        <div className={`ball-type ${type}`}>
          {type === 'hot' ? '热' : '冷'}
        </div>
      )}
    </div>
  )
}


function PlaySwitch({ currentPlay, onChange }) {
  return (
    <div className="play-switch">
      <button
        type="button"
        className={`play-box macau ${currentPlay === 'macau' ? 'active' : ''}`}
        onClick={() => onChange('macau')}
        title="点击进入澳门玩法"
      >
        澳门玩法
      </button>

      <button
        type="button"
        className={`play-box hongkong ${currentPlay === 'hongkong' ? 'active' : ''}`}
        onClick={() => onChange('hongkong')}
        title="点击进入香港玩法"
      >
        香港玩法
      </button>
    </div>
  )
}

function makeStrategies() {
  const samples = [30, 50, 80, 100, 150]
  const hotCounts = [18, 20, 22, 24, 26, 28, 30]

  const modes = [
    {
      key: 'all',
      label: '全部开奖号统计',
      desc: '平码 + 特码全部统计',
    },
    {
      key: 'special',
      label: '只统计特码',
      desc: '只看最后一个特码',
    },
    {
      key: 'specialWeight',
      label: '特码加权',
      desc: '平码计1分，特码额外加3分',
    },
    {
      key: 'omitSpecial',
      label: '特码遗漏加权',
      desc: '特码出现次数 + 遗漏期数加权',
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
          desc: mode.desc,
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

function testStrategy(history, strategy, rangeSize) {
  const rows = []

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const target = history[index]
    const beforeHistory = history.slice(index + 1)

    if (beforeHistory.length < strategy.sampleSize) continue

    const analysis = buildRecommend(beforeHistory, strategy)
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

  const results = strategies.map((strategy) => {
    const result100 = testStrategy(history, strategy, 100)
    const result50 = testStrategy(history, strategy, 50)

    return {
      ...strategy,
      result100,
      result50,
      score: Number((result100.hitRate * 0.7 + result50.hitRate * 0.3).toFixed(2)),
    }
  })

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

  if (beforeHistory.length < strategy.sampleSize) return null

  const analysis = buildRecommend(beforeHistory, strategy)
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

function copyToClipboard(text) {
  if (!text) {
    alert('没有可复制的号码')
    return
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
    alert('已复制：' + text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  alert('已复制：' + text)
}

function formatNumbers(list) {
  return list
    .map((item) => String(item.num).padStart(2, '0'))
    .join(' ')
}

function CopyButton({ label, text }) {
  return (
    <button
      className="refresh-btn"
      style={{
        padding: '10px 16px',
        borderRadius: '14px',
        fontSize: '14px',
      }}
      onClick={() => copyToClipboard(text)}
    >
      {label}
    </button>
  )
}

export default function Page() {
  const [currentPlay, setCurrentPlay] = React.useState(() => {
    if (typeof window === 'undefined') return 'macau'

    const params = new URLSearchParams(window.location.search)
    const play = params.get('play')

    return play === 'hongkong' ? 'hongkong' : 'macau'
  })
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selectedExpect, setSelectedExpect] = React.useState('')
  const [selectedStrategyId, setSelectedStrategyId] = React.useState('auto')
  const [filter, setFilter] = React.useState('all')
  const [totalBetPerIssue, setTotalBetPerIssue] = React.useState(3600)
  const [odds, setOdds] = React.useState(47)

  const playConfig = PLAY_CONFIG[currentPlay]

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch(playConfig.api, {
        cache: 'no-store',
      })

      const json = await res.json()

      if (!json.ok) {
        throw new Error(json.message || '数据获取失败')
      }

      setData(json)

      if (json.history?.[0]?.expect) {
        setSelectedExpect(json.history[0].expect)
      }
    } catch (err) {
      setError(err.message || '数据获取失败')
    } finally {
      setLoading(false)
    }
  }

  const changePlay = (play) => {
    if (!PLAY_CONFIG[play]) return

    setCurrentPlay(play)
    setData(null)
    setSelectedExpect('')
    setSelectedStrategyId('auto')
    setFilter('all')

    if (typeof window !== 'undefined') {
      const url = `${window.location.pathname}?play=${play}`
      window.history.pushState(null, '', url)
    }
  }

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const play = params.get('play')

    if (play === 'hongkong' || play === 'macau') {
      setCurrentPlay(play)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [currentPlay])

  const history = data?.history || []

  const strategyRanking = React.useMemo(() => {
    if (!history.length) return []
    return buildStrategyRanking(history)
  }, [history])

  const bestStrategy = strategyRanking[0] || null

  const currentStrategy =
    selectedStrategyId === 'auto'
      ? bestStrategy
      : strategyRanking.find((item) => item.id === selectedStrategyId) || bestStrategy

  const singleBacktest = buildSingleBacktest(
    history,
    selectedExpect,
    currentStrategy
  )

  const nextAnalysis =
    currentStrategy && history.length
      ? buildRecommend(history, currentStrategy)
      : null

  const nextExpect = getNextExpectByPlay(history, data, currentPlay)

  const nextRecommendNumbers = nextAnalysis?.recommendNumbers || []
  const nextHotNumbers = nextAnalysis?.hotNumbers || []
  const nextColdNumbers = nextAnalysis?.coldNumbers || []

  const nextRecommendText = formatNumbers(nextRecommendNumbers)
  const nextHotText = formatNumbers(nextHotNumbers)
  const nextColdText = formatNumbers(nextColdNumbers)

  const nextFullCopyText = [
    `玩法：${playConfig.name}`,
    `下一期期号：${nextExpect}`,
    `策略：${currentStrategy?.label || ''}`,
    `下一期36码：${nextRecommendText}`,
    `热门号：${nextHotText}`,
    `冷门号：${nextColdText}`,
  ].join('\n')

  const best100Rows = currentStrategy?.result100?.rows || []
  const best50Rows = currentStrategy?.result50?.rows || []

  const recommendNumbers = singleBacktest?.recommendNumbers || []
  const hotNumbers = singleBacktest?.hotNumbers || []
  const coldNumbers = singleBacktest?.coldNumbers || []

  const recommendText = formatNumbers(recommendNumbers)
  const hotText = formatNumbers(hotNumbers)
  const coldText = formatNumbers(coldNumbers)

  const fullCopyText = [
    `玩法：${playConfig.name}`,
    `回测期号：${singleBacktest?.target?.expect || ''}`,
    `策略：${currentStrategy?.label || ''}`,
    `36码：${recommendText}`,
    `热门号：${hotText}`,
    `冷门号：${coldText}`,
  ].join('\n')

  const currentFinance100 = currentStrategy
    ? calculateProfit(
        currentStrategy.result100.hitCount,
        currentStrategy.result100.testedCount,
        totalBetPerIssue,
        odds
      )
    : null

  const currentFinance50 = currentStrategy
    ? calculateProfit(
        currentStrategy.result50.hitCount,
        currentStrategy.result50.testedCount,
        totalBetPerIssue,
        odds
      )
    : null

  const filteredRecommend = recommendNumbers.filter((item) => {
    if (filter === 'hot') return item.type === 'hot'
    if (filter === 'cold') return item.type === 'cold'
    if (filter === 'red') return getWave(item.num) === 'red'
    if (filter === 'blue') return getWave(item.num) === 'blue'
    if (filter === 'green') return getWave(item.num) === 'green'
    return true
  })

  return (
    <main className="page">
      <style jsx>{`
        .play-switch {
          display: flex;
          gap: 18px;
          margin-top: 18px;
          align-items: center;
          flex-wrap: wrap;
        }

        .play-box {
          min-width: 120px;
          height: 44px;
          padding: 0 28px;
          border-radius: 4px;
          background: rgba(15, 23, 42, 0.25);
          color: #fff;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .play-box.macau {
          border: 4px solid #ef4444;
        }

        .play-box.hongkong {
          border: 4px solid #52ff00;
        }

        .play-box:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .play-box.active {
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.65);
          background: rgba(250, 204, 21, 0.12);
        }
      `}</style>

      <section className="hero">
        <div>
          <div className="badge">{playConfig.badge}</div>
          <h1>36码智能筛选系统</h1>
          <p>
            上方显示下一期推荐号码，下方显示历史回测结果。绿色圈代表平码命中36码，黄色圈代表特码命中36码。
          </p>

          <PlaySwitch currentPlay={currentPlay} onChange={changePlay} />
        </div>

        <button className="refresh-btn" onClick={loadData} disabled={loading}>
          {loading ? '正在刷新...' : '刷新数据'}
        </button>
      </section>

      {error && (
        <div className="error-card">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="loading-card">
          正在抓取{playConfig.name}六合彩开奖数据，请稍等...
        </div>
      )}

      {data && currentStrategy && (
        <>
          {nextAnalysis && (
            <section className="card">
              <div className="section-head">
                <div>
                  <div className="card-title">
                    {playConfig.name}下一期推荐36码：第 {nextExpect} 期
                  </div>
                  <p className="section-desc">
                    这里是根据最新已开奖数据生成的下一期推荐号码，不是历史回测。开奖后可以再用回测区验证是否命中。
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                    <CopyButton label="复制下一期36码" text={nextRecommendText} />
                    <CopyButton label="复制下一期热门号" text={nextHotText} />
                    <CopyButton label="复制下一期冷门号" text={nextColdText} />
                    <CopyButton label="复制下一期完整结果" text={nextFullCopyText} />
                  </div>
                </div>

                <div className="filter-row">
                  <button className="active">下一期推荐</button>
                </div>
              </div>

              <div className="latest-info">
                <div>
                  <span>最新已开奖期号</span>
                  <strong>第 {history?.[0]?.expect} 期</strong>
                </div>

                <div>
                  <span>推荐下一期</span>
                  <strong>第 {nextExpect} 期</strong>
                </div>

                <div>
                  <span>当前策略</span>
                  <strong>{currentStrategy?.modeLabel}</strong>
                </div>

                <div>
                  <span>热门号码</span>
                  <strong>{nextHotNumbers.length}个</strong>
                </div>

                <div>
                  <span>冷门号码</span>
                  <strong>{nextColdNumbers.length}个</strong>
                </div>

                <div>
                  <span>最终推荐</span>
                  <strong>{nextRecommendNumbers.length}个</strong>
                </div>
              </div>

              <div className="ball-grid recommend-grid">
                {nextRecommendNumbers.map((item) => (
                  <Ball
                    key={item.num}
                    num={item.num}
                    count={item.count}
                    type={item.type}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="top-grid">
            <div className="card">
              <div className="card-title">当前最佳策略</div>
              <p className="section-desc">
                系统自动测试多种组合，默认选择综合表现最好的策略。历史回测高，不代表下一期一定命中。
              </p>

              <div className="latest-info">
                <div>
                  <span>策略名称</span>
                  <strong>{currentStrategy.label}</strong>
                </div>

                <div>
                  <span>近100期总命中率</span>
                  <strong>
                    {currentStrategy.result100.hitCount} / {currentStrategy.result100.testedCount}
                    {' '}
                    = {currentStrategy.result100.hitRate}%
                  </strong>
                </div>

                <div>
                  <span>近50期总命中率</span>
                  <strong>
                    {currentStrategy.result50.hitCount} / {currentStrategy.result50.testedCount}
                    {' '}
                    = {currentStrategy.result50.hitRate}%
                  </strong>
                </div>
              </div>

              <div className="latest-info">
                <div>
                  <span>近100期热码命中</span>
                  <strong>
                    {currentStrategy.result100.hotHitCount} / {currentStrategy.result100.testedCount}
                    {' '}
                    = {currentStrategy.result100.hotHitRate}%
                  </strong>
                </div>

                <div>
                  <span>近100期冷码命中</span>
                  <strong>
                    {currentStrategy.result100.coldHitCount} / {currentStrategy.result100.testedCount}
                    {' '}
                    = {currentStrategy.result100.coldHitRate}%
                  </strong>
                </div>

                <div>
                  <span>热码 + 冷码</span>
                  <strong>
                    {currentStrategy.hotCount} + {currentStrategy.coldCount} = 36码
                  </strong>
                </div>
              </div>

              <div className="latest-info">
                <div>
                  <span>近50期热码命中</span>
                  <strong>
                    {currentStrategy.result50.hotHitCount} / {currentStrategy.result50.testedCount}
                    {' '}
                    = {currentStrategy.result50.hotHitRate}%
                  </strong>
                </div>

                <div>
                  <span>近50期冷码命中</span>
                  <strong>
                    {currentStrategy.result50.coldHitCount} / {currentStrategy.result50.testedCount}
                    {' '}
                    = {currentStrategy.result50.coldHitRate}%
                  </strong>
                </div>

                <div>
                  <span>算法</span>
                  <strong>{currentStrategy.modeLabel}</strong>
                </div>
              </div>

              <div className="latest-info">
                <div>
                  <span>100期净盈亏</span>
                  <strong style={{ color: currentFinance100?.profit >= 0 ? '#22c55e' : '#f87171' }}>
                    {formatMoney(currentFinance100?.profit)}
                  </strong>
                </div>

                <div>
                  <span>50期净盈亏</span>
                  <strong style={{ color: currentFinance50?.profit >= 0 ? '#22c55e' : '#f87171' }}>
                    {formatMoney(currentFinance50?.profit)}
                  </strong>
                </div>

                <div>
                  <span>单码投注</span>
                  <strong>{formatMoney((totalBetPerIssue || 0) / 36)}</strong>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">金额设置 / 选择策略</div>

              <div className="stats-list">
                <div>
                  <span>每期总投入</span>
                  <input
                    type="number"
                    value={totalBetPerIssue}
                    onChange={(e) => setTotalBetPerIssue(Number(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#111827',
                      color: '#fff',
                      border: '1px solid #3f3f46',
                      fontWeight: '700',
                    }}
                  />
                </div>

                <div>
                  <span>赔率</span>
                  <input
                    type="number"
                    step="0.1"
                    value={odds}
                    onChange={(e) => setOdds(Number(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#111827',
                      color: '#fff',
                      border: '1px solid #3f3f46',
                      fontWeight: '700',
                    }}
                  />
                </div>

                <div>
                  <span>策略选择</span>
                  <select
                    value={selectedStrategyId}
                    onChange={(e) => setSelectedStrategyId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: '#111827',
                      color: '#fff',
                      border: '1px solid #3f3f46',
                      fontWeight: '700',
                    }}
                  >
                    <option value="auto">自动选择最佳策略</option>
                    {strategyRanking.slice(0, 20).map((item, index) => (
                      <option key={item.id} value={item.id}>
                        第{index + 1}名｜{item.label}｜100期{item.result100.hitRate}%｜50期{item.result50.hitRate}%
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span>理论随机命中率</span>
                  <strong>36 / 49 = 73.47%</strong>
                </div>

                <div>
                  <span>单次命中回款</span>
                  <strong>{formatMoney((totalBetPerIssue / 36) * odds)}</strong>
                </div>

                <div>
                  <span>策略综合分</span>
                  <strong>{currentStrategy.score}%</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-title">策略排行榜</div>
            <p className="section-desc">
              排名按：近100期命中率70%权重 + 近50期命中率30%权重。金额按每期投入 {formatMoney(totalBetPerIssue)}、赔率 {odds} 倍计算。
            </p>

            <div className="history-list">
              {strategyRanking.slice(0, 12).map((item, index) => {
                const finance100 = calculateProfit(
                  item.result100.hitCount,
                  item.result100.testedCount,
                  totalBetPerIssue,
                  odds
                )

                const finance50 = calculateProfit(
                  item.result50.hitCount,
                  item.result50.testedCount,
                  totalBetPerIssue,
                  odds
                )

                return (
                  <div key={item.id} className="history-row">
                    <div className="history-meta">
                      <strong>第 {index + 1} 名</strong>
                      <span>{item.label}</span>
                      <span style={{ display: 'block', marginTop: '6px', color: '#facc15' }}>
                        综合分：{item.score}%
                      </span>
                    </div>

                    <div className="latest-info" style={{ marginBottom: 0 }}>
                      <div>
                        <span>近100期总命中</span>
                        <strong>{item.result100.hitCount} / {item.result100.testedCount} = {item.result100.hitRate}%</strong>
                      </div>

                      <div>
                        <span>近100期热码命中</span>
                        <strong>{item.result100.hotHitCount} / {item.result100.testedCount} = {item.result100.hotHitRate}%</strong>
                      </div>

                      <div>
                        <span>近100期冷码命中</span>
                        <strong>{item.result100.coldHitCount} / {item.result100.testedCount} = {item.result100.coldHitRate}%</strong>
                      </div>

                      <div>
                        <span>近50期总命中</span>
                        <strong>{item.result50.hitCount} / {item.result50.testedCount} = {item.result50.hitRate}%</strong>
                      </div>

                      <div>
                        <span>近50期热码命中</span>
                        <strong>{item.result50.hotHitCount} / {item.result50.testedCount} = {item.result50.hotHitRate}%</strong>
                      </div>

                      <div>
                        <span>近50期冷码命中</span>
                        <strong>{item.result50.coldHitCount} / {item.result50.testedCount} = {item.result50.coldHitRate}%</strong>
                      </div>

                      <div>
                        <span>100期净盈亏</span>
                        <strong style={{ color: finance100.profit >= 0 ? '#22c55e' : '#f87171' }}>
                          {formatMoney(finance100.profit)}
                        </strong>
                      </div>

                      <div>
                        <span>50期净盈亏</span>
                        <strong style={{ color: finance50.profit >= 0 ? '#22c55e' : '#f87171' }}>
                          {formatMoney(finance50.profit)}
                        </strong>
                      </div>

                      <div>
                        <span>规则</span>
                        <strong>{item.modeLabel}</strong>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="card">
            <div className="section-head">
              <div>
                <div className="card-title">选择历史回测期号</div>
                <p className="section-desc">
                  这里是历史回测，不是下一期推荐。选择某一期，系统会用该期之前的数据按当前策略生成36码，只判断该期最后的特码是否命中。
                </p>
              </div>
            </div>

            <div className="latest-info">
              <div>
                <span>选择期号</span>
                <select
                  value={selectedExpect}
                  onChange={(e) => setSelectedExpect(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: '#111827',
                    color: '#fff',
                    border: '1px solid #3f3f46',
                    fontWeight: '700',
                  }}
                >
                  {history.map((item) => (
                    <option key={item.expect} value={item.expect}>
                      第 {item.expect} 期
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span>当前策略</span>
                <strong>{currentStrategy.modeLabel}</strong>
              </div>

              <div>
                <span>该期总结果</span>
                <strong>{singleBacktest?.hit ? '命中' : '未命中'}</strong>
              </div>

              <div>
                <span>该期热码结果</span>
                <strong>{singleBacktest?.hotHit ? '热码命中' : '热码未中'}</strong>
              </div>

              <div>
                <span>该期冷码结果</span>
                <strong>{singleBacktest?.coldHit ? '冷码命中' : '冷码未中'}</strong>
              </div>
            </div>
          </section>

          {singleBacktest && (
            <>
              <section className="top-grid">
                <div className="card latest-card">
                  <div className="card-title">
                    第 {singleBacktest.target.expect} 期历史回测开奖
                  </div>

                  <div className="latest-info">
                    <div>
                      <span>开奖时间</span>
                      <strong>{singleBacktest.target.openTime || '-'}</strong>
                    </div>

                    <div>
                      <span>特码</span>
                      <strong>
                        {String(singleBacktest.specialNumber).padStart(2, '0')}
                      </strong>
                    </div>

                    <div>
                      <span>结果</span>
                      <strong>
                        {singleBacktest.hotHit
                          ? '热码命中'
                          : singleBacktest.coldHit
                            ? '冷码命中'
                            : '未命中'}
                      </strong>
                    </div>
                  </div>

                  <div className="latest-balls">
                    {singleBacktest.target.numbers.map((num, index) => {
                      const inRecommend = singleBacktest.recommendNumbers?.some(
                        (recommend) => recommend.num === num
                      )

                      const isSpecial = index === 6

                      return (
                        <React.Fragment key={`${num}-${index}`}>
                          {isSpecial && <div className="plus">+</div>}
                          <Ball
                            num={num}
                            hit={inRecommend}
                            hitType={isSpecial ? 'special' : 'normal'}
                          />
                        </React.Fragment>
                      )
                    })}
                  </div>

                  <div style={{ marginTop: '20px', color: '#a1a1aa' }}>
                    绿色圈 = 平码落入36码；黄色圈 = 特码落入36码。
                  </div>
                </div>

                <div className="card stats-card">
                  <div className="card-title">该期历史回测结果</div>

                  <div className="stats-list">
                    <div>
                      <span>热门号码</span>
                      <strong>{hotNumbers.length}个</strong>
                    </div>

                    <div>
                      <span>冷门号码</span>
                      <strong>{coldNumbers.length}个</strong>
                    </div>

                    <div>
                      <span>最终筛选</span>
                      <strong>{recommendNumbers.length}个</strong>
                    </div>

                    <div>
                      <span>特码结果</span>
                      <strong>
                        {singleBacktest.hotHit
                          ? '热码命中'
                          : singleBacktest.coldHit
                            ? '冷码命中'
                            : '未命中'}
                      </strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="section-head">
                  <div>
                    <div className="card-title">本期历史回测36码</div>
                    <p className="section-desc">
                      这组36码是用于回测第 {singleBacktest.target.expect} 期的，不是下一期推荐。绿色圈代表平码命中36码，黄色圈代表特码命中36码。
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                      <CopyButton label="复制回测36码" text={recommendText} />
                      <CopyButton label="复制回测热门号" text={hotText} />
                      <CopyButton label="复制回测冷门号" text={coldText} />
                      <CopyButton label="复制回测完整结果" text={fullCopyText} />
                    </div>
                  </div>

                  <div className="filter-row">
                    {[
                      ['all', '全部'],
                      ['hot', '热门'],
                      ['cold', '冷门'],
                      ['red', '红波'],
                      ['blue', '蓝波'],
                      ['green', '绿波'],
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        className={filter === key ? 'active' : ''}
                        onClick={() => setFilter(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ball-grid recommend-grid">
                  {filteredRecommend.map((item) => {
                    const isSpecial = item.num === singleBacktest.specialNumber
                    const isNormal = singleBacktest.target.numbers
                      .slice(0, 6)
                      .includes(item.num)

                    return (
                      <Ball
                        key={item.num}
                        num={item.num}
                        count={item.count}
                        type={item.type}
                        hit={isSpecial || isNormal}
                        hitType={isSpecial ? 'special' : 'normal'}
                      />
                    )
                  })}
                </div>
              </section>

              <section className="three-grid">
                <div className="card">
                  <div className="card-title hot-title">回测热门号码</div>
                  <p className="section-desc">当前策略筛选出的高分号码。</p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <CopyButton label="复制热门号" text={hotText} />
                  </div>

                  <div className="ball-grid">
                    {hotNumbers.map((item) => {
                      const isSpecial = item.num === singleBacktest.specialNumber
                      const isNormal = singleBacktest.target.numbers
                        .slice(0, 6)
                        .includes(item.num)

                      return (
                        <Ball
                          key={item.num}
                          num={item.num}
                          count={item.count}
                          type="hot"
                          small
                          hit={isSpecial || isNormal}
                          hitType={isSpecial ? 'special' : 'normal'}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title cold-title">回测冷门号码</div>
                  <p className="section-desc">当前策略筛选出的低分号码。</p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <CopyButton label="复制冷门号" text={coldText} />
                  </div>

                  <div className="ball-grid">
                    {coldNumbers.map((item) => {
                      const isSpecial = item.num === singleBacktest.specialNumber
                      const isNormal = singleBacktest.target.numbers
                        .slice(0, 6)
                        .includes(item.num)

                      return (
                        <Ball
                          key={item.num}
                          num={item.num}
                          count={item.count}
                          type="cold"
                          small
                          hit={isSpecial || isNormal}
                          hitType={isSpecial ? 'special' : 'normal'}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">策略说明</div>

                  <div className="analysis-list">
                    <div>
                      <span>算法</span>
                      <strong>{currentStrategy.modeLabel}</strong>
                    </div>

                    <div>
                      <span>样本期数</span>
                      <strong>前{currentStrategy.sampleSize}期</strong>
                    </div>

                    <div>
                      <span>组合</span>
                      <strong>热{currentStrategy.hotCount} + 冷{currentStrategy.coldCount}</strong>
                    </div>

                    <div>
                      <span>说明</span>
                      <strong>{currentStrategy.desc}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="card-title">近100期回测明细</div>
                <p className="section-desc">
                  每一期都用它之前的数据生成36码。绿色圈 = 平码落入36码；黄色圈 = 特码落入36码。
                </p>

                <div className="history-list">
                  {best100Rows.slice(0, 30).map((item) => (
                    <div key={item.expect} className="history-row">
                      <div className="history-meta">
                        <strong>第 {item.expect} 期</strong>
                        <span>{item.openTime}</span>
                        <span style={{ display: 'block', marginTop: '6px', color: item.hit ? '#facc15' : '#a1a1aa' }}>
                          特码 {String(item.specialNumber).padStart(2, '0')}：
                          {item.hotHit ? '热码命中' : item.coldHit ? '冷码命中' : '未命中'}
                        </span>
                      </div>

                      <div className="history-balls">
                        {item.numbers.map((num, index) => {
                          const inRecommend = item.recommendNumbers?.some(
                            (recommend) => recommend.num === num
                          )

                          const isSpecial = index === 6

                          return (
                            <React.Fragment key={`${item.expect}-${num}-${index}`}>
                              {isSpecial && <span className="history-plus">+</span>}
                              <Ball
                                num={num}
                                small
                                hit={inRecommend}
                                hitType={isSpecial ? 'special' : 'normal'}
                              />
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card">
                <div className="card-title">近50期回测明细</div>
                <p className="section-desc">
                  每一期都用它之前的数据生成36码。绿色圈 = 平码落入36码；黄色圈 = 特码落入36码。
                </p>

                <div className="history-list">
                  {best50Rows.slice(0, 30).map((item) => (
                    <div key={item.expect} className="history-row">
                      <div className="history-meta">
                        <strong>第 {item.expect} 期</strong>
                        <span>{item.openTime}</span>
                        <span style={{ display: 'block', marginTop: '6px', color: item.hit ? '#facc15' : '#a1a1aa' }}>
                          特码 {String(item.specialNumber).padStart(2, '0')}：
                          {item.hotHit ? '热码命中' : item.coldHit ? '冷码命中' : '未命中'}
                        </span>
                      </div>

                      <div className="history-balls">
                        {item.numbers.map((num, index) => {
                          const inRecommend = item.recommendNumbers?.some(
                            (recommend) => recommend.num === num
                          )

                          const isSpecial = index === 6

                          return (
                            <React.Fragment key={`${item.expect}-${num}-${index}`}>
                              {isSpecial && <span className="history-plus">+</span>}
                              <Ball
                                num={num}
                                small
                                hit={inRecommend}
                                hitType={isSpecial ? 'special' : 'normal'}
                              />
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="footer-note">
                回测逻辑：绿色圈表示前6个平码落入当期筛选36码；黄色圈表示最后特码落入当期筛选36码。金额回测只按特码命中计算。
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
