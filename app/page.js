'use client'

import React from 'react'

const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

function getWave(num) {
  if (redWave.includes(Number(num))) return 'red'
  if (blueWave.includes(Number(num))) return 'blue'
  return 'green'
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

function Ball({ num, count, type, small = false, hit = false }) {
  const wave = getWave(Number(num))

  return (
    <div className={`ball-box ${small ? 'small' : ''}`}>
      <div
        className={`ball ${wave}`}
        style={hit ? { outline: '4px solid #facc15' } : undefined}
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
    const hit = recommendSet.has(specialNumber)

    rows.push({
      expect: target.expect,
      openTime: target.openTime,
      numbers: target.numbers,
      specialNumber,
      hit,
      ...analysis,
    })
  }

  const hitCount = rows.filter((item) => item.hit).length
  const testedCount = rows.length
  const hitRate = testedCount ? Number(((hitCount / testedCount) * 100).toFixed(2)) : 0

  return {
    testedCount,
    hitCount,
    hitRate,
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
  const hit = recommendSet.has(specialNumber)

  return {
    target,
    specialNumber,
    hit,
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
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selectedExpect, setSelectedExpect] = React.useState('')
  const [selectedStrategyId, setSelectedStrategyId] = React.useState('auto')
  const [filter, setFilter] = React.useState('all')
  const [totalBetPerIssue, setTotalBetPerIssue] = React.useState(3600)
  const [odds, setOdds] = React.useState(47)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/history', {
        cache: 'no-store',
      })

      const json = await res.json()

      if (!json.ok) {
        throw new Error(json.message || '数据获取失败')
      }

      setData(json)

      if (!selectedExpect && json.history?.[0]?.expect) {
        setSelectedExpect(json.history[0].expect)
      }
    } catch (err) {
      setError(err.message || '数据获取失败')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

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

  const best100Rows = currentStrategy?.result100?.rows || []
  const best50Rows = currentStrategy?.result50?.rows || []

  const recommendNumbers = singleBacktest?.recommendNumbers || []
  const hotNumbers = singleBacktest?.hotNumbers || []
  const coldNumbers = singleBacktest?.coldNumbers || []

  const recommendText = formatNumbers(recommendNumbers)
  const hotText = formatNumbers(hotNumbers)
  const coldText = formatNumbers(coldNumbers)

  const fullCopyText = [
    `期号：${singleBacktest?.target?.expect || ''}`,
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
      <section className="hero">
        <div>
          <div className="badge">澳门六合彩特码多策略回测</div>
          <h1>36码智能筛选系统</h1>
          <p>
            自动测试多种36码筛选规则，寻找近100期和近50期里面特码命中率更高，同时金额回测更好的策略。
          </p>
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
          正在抓取澳门六合彩开奖数据，请稍等...
        </div>
      )}

      {data && currentStrategy && (
        <>
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
                  <span>近100期命中率</span>
                  <strong>
                    {currentStrategy.result100.hitCount} / {currentStrategy.result100.testedCount}
                    {' '}
                    = {currentStrategy.result100.hitRate}%
                  </strong>
                </div>

                <div>
                  <span>近50期命中率</span>
                  <strong>
                    {currentStrategy.result50.hitCount} / {currentStrategy.result50.testedCount}
                    {' '}
                    = {currentStrategy.result50.hitRate}%
                  </strong>
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

              <div className="latest-info">
                <div>
                  <span>统计样本</span>
                  <strong>前{currentStrategy.sampleSize}期</strong>
                </div>

                <div>
                  <span>热门 / 冷门</span>
                  <strong>热{currentStrategy.hotCount} + 冷{currentStrategy.coldCount}</strong>
                </div>

                <div>
                  <span>算法</span>
                  <strong>{currentStrategy.modeLabel}</strong>
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
                        <span>近100期</span>
                        <strong>{item.result100.hitCount} / {item.result100.testedCount} = {item.result100.hitRate}%</strong>
                      </div>

                      <div>
                        <span>近50期</span>
                        <strong>{item.result50.hitCount} / {item.result50.testedCount} = {item.result50.hitRate}%</strong>
                      </div>

                      <div>
                        <span>规则</span>
                        <strong>{item.modeLabel}</strong>
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
                    </div>

                    <div className="latest-info" style={{ marginTop: '14px', marginBottom: 0 }}>
                      <div>
                        <span>100期总投入</span>
                        <strong>{formatMoney(finance100.totalCost)}</strong>
                      </div>

                      <div>
                        <span>100期总回款</span>
                        <strong>{formatMoney(finance100.totalReturn)}</strong>
                      </div>

                      <div>
                        <span>100期收益率</span>
                        <strong style={{ color: finance100.profit >= 0 ? '#22c55e' : '#f87171' }}>
                          {finance100.roi}%
                        </strong>
                      </div>

                      <div>
                        <span>50期总投入</span>
                        <strong>{formatMoney(finance50.totalCost)}</strong>
                      </div>

                      <div>
                        <span>50期总回款</span>
                        <strong>{formatMoney(finance50.totalReturn)}</strong>
                      </div>

                      <div>
                        <span>50期收益率</span>
                        <strong style={{ color: finance50.profit >= 0 ? '#22c55e' : '#f87171' }}>
                          {finance50.roi}%
                        </strong>
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
                <div className="card-title">选择单期回测</div>
                <p className="section-desc">
                  选择某一期，系统会用该期之前的数据按当前策略生成36码，只判断该期最后的特码是否命中。
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
                <span>该期特码结果</span>
                <strong>{singleBacktest?.hit ? '命中' : '未命中'}</strong>
              </div>
            </div>
          </section>

          {singleBacktest && (
            <>
              <section className="top-grid">
                <div className="card latest-card">
                  <div className="card-title">
                    第 {singleBacktest.target.expect} 期真实开奖
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
                      <strong>{singleBacktest.hit ? '命中' : '未命中'}</strong>
                    </div>
                  </div>

                  <div className="latest-balls">
                    {singleBacktest.target.numbers.map((num, index) => (
                      <React.Fragment key={`${num}-${index}`}>
                        {index === 6 && <div className="plus">+</div>}
                        <Ball
                          num={num}
                          hit={index === 6 && singleBacktest.hit}
                        />
                      </React.Fragment>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', color: '#a1a1aa' }}>
                    黄色边框 = 特码命中36码。这里只判断最后一个特码。
                  </div>
                </div>

                <div className="card stats-card">
                  <div className="card-title">该期策略结果</div>

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
                      <strong>{singleBacktest.hit ? '命中' : '未命中'}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="section-head">
                  <div>
                    <div className="card-title">当前策略推荐36码</div>
                    <p className="section-desc">
                      该36码由当前策略生成。黄色边框代表该期最后的特码。
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
                      <CopyButton label="复制36码" text={recommendText} />
                      <CopyButton label="复制热门号" text={hotText} />
                      <CopyButton label="复制冷门号" text={coldText} />
                      <CopyButton label="复制完整结果" text={fullCopyText} />
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
                  {filteredRecommend.map((item) => (
                    <Ball
                      key={item.num}
                      num={item.num}
                      count={item.count}
                      type={item.type}
                      hit={item.num === singleBacktest.specialNumber}
                    />
                  ))}
                </div>
              </section>

              <section className="three-grid">
                <div className="card">
                  <div className="card-title hot-title">热门号码</div>
                  <p className="section-desc">当前策略筛选出的高分号码。</p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <CopyButton label="复制热门号" text={hotText} />
                  </div>

                  <div className="ball-grid">
                    {hotNumbers.map((item) => (
                      <Ball
                        key={item.num}
                        num={item.num}
                        count={item.count}
                        type="hot"
                        small
                        hit={item.num === singleBacktest.specialNumber}
                      />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title cold-title">冷门号码</div>
                  <p className="section-desc">当前策略筛选出的低分号码。</p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                    <CopyButton label="复制冷门号" text={coldText} />
                  </div>

                  <div className="ball-grid">
                    {coldNumbers.map((item) => (
                      <Ball
                        key={item.num}
                        num={item.num}
                        count={item.count}
                        type="cold"
                        small
                        hit={item.num === singleBacktest.specialNumber}
                      />
                    ))}
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
                  每一期都用它之前的数据生成36码，然后判断该期最后特码是否命中。
                </p>

                <div className="history-list">
                  {best100Rows.slice(0, 30).map((item) => (
                    <div key={item.expect} className="history-row">
                      <div className="history-meta">
                        <strong>第 {item.expect} 期</strong>
                        <span>{item.openTime}</span>
                        <span style={{ display: 'block', marginTop: '6px', color: item.hit ? '#facc15' : '#a1a1aa' }}>
                          特码 {String(item.specialNumber).padStart(2, '0')}：{item.hit ? '命中' : '未命中'}
                        </span>
                      </div>

                      <div className="history-balls">
                        {item.numbers.map((num, index) => (
                          <React.Fragment key={`${item.expect}-${num}-${index}`}>
                            {index === 6 && <span className="history-plus">+</span>}
                            <Ball
                              num={num}
                              small
                              hit={index === 6 && item.hit}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="card">
                <div className="card-title">近50期回测明细</div>
                <p className="section-desc">
                  每一期都用它之前的数据生成36码，然后判断该期最后特码是否命中。
                </p>

                <div className="history-list">
                  {best50Rows.slice(0, 30).map((item) => (
                    <div key={item.expect} className="history-row">
                      <div className="history-meta">
                        <strong>第 {item.expect} 期</strong>
                        <span>{item.openTime}</span>
                        <span style={{ display: 'block', marginTop: '6px', color: item.hit ? '#facc15' : '#a1a1aa' }}>
                          特码 {String(item.specialNumber).padStart(2, '0')}：{item.hit ? '命中' : '未命中'}
                        </span>
                      </div>

                      <div className="history-balls">
                        {item.numbers.map((num, index) => (
                          <React.Fragment key={`${item.expect}-${num}-${index}`}>
                            {index === 6 && <span className="history-plus">+</span>}
                            <Ball
                              num={num}
                              small
                              hit={index === 6 && item.hit}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="footer-note">
                回测逻辑：只判断特码是否落入36码，不判断平码。金额回测按“每期总投入 / 36 = 单码投注额”，命中后按赔率回款。历史命中率高不代表下一期一定命中。
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
