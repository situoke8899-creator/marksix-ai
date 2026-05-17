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
        <div className="ball-count">{count}次</div>
      )}

      {type && (
        <div className={`ball-type ${type}`}>
          {type === 'hot' ? '热' : '冷'}
        </div>
      )}
    </div>
  )
}

function buildBacktest(history, targetExpect) {
  if (!history?.length || !targetExpect) return null

  const targetIndex = history.findIndex(
    (item) => String(item.expect) === String(targetExpect)
  )

  if (targetIndex === -1) return null

  const target = history[targetIndex]

  const beforeHistory = history.slice(targetIndex + 1, targetIndex + 101)

  const counts = {}

  for (let i = 1; i <= 49; i++) {
    counts[i] = 0
  }

  beforeHistory.forEach((item) => {
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

  const recommendSet = new Set(recommendNumbers.map((item) => item.num))

  const hitNumbers = target.numbers.filter((num) => recommendSet.has(num))
  const missNumbers = target.numbers.filter((num) => !recommendSet.has(num))

  const hitRate = target.numbers.length
    ? ((hitNumbers.length / target.numbers.length) * 100).toFixed(2)
    : '0.00'

  return {
    target,
    beforeHistory,
    hotNumbers,
    coldNumbers,
    recommendNumbers,
    hitNumbers,
    missNumbers,
    hitRate,
  }
}

export default function Page() {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [filter, setFilter] = React.useState('all')
  const [selectedExpect, setSelectedExpect] = React.useState('')

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
  const backtest = buildBacktest(history, selectedExpect)

  const recommendNumbers = backtest?.recommendNumbers || []
  const hotNumbers = backtest?.hotNumbers || []
  const coldNumbers = backtest?.coldNumbers || []

  const filteredRecommend = recommendNumbers.filter((item) => {
    if (filter === 'hot') return item.type === 'hot'
    if (filter === 'cold') return item.type === 'cold'
    if (filter === 'red') return getWave(item.num) === 'red'
    if (filter === 'blue') return getWave(item.num) === 'blue'
    if (filter === 'green') return getWave(item.num) === 'green'
    return true
  })

  const redCount = recommendNumbers.filter((item) => getWave(item.num) === 'red').length
  const blueCount = recommendNumbers.filter((item) => getWave(item.num) === 'blue').length
  const greenCount = recommendNumbers.filter((item) => getWave(item.num) === 'green').length
  const oddCount = recommendNumbers.filter((item) => item.num % 2 !== 0).length
  const evenCount = recommendNumbers.filter((item) => item.num % 2 === 0).length

  return (
    <main className="page">
      <section className="hero">
        <div>
          <div className="badge">澳门六合彩历史数据回测</div>
          <h1>36码智能筛选系统</h1>
          <p>
            选择任意历史期号，系统只用该期之前的100期数据生成36码，再对比该期开奖结果。
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

      {data && (
        <>
          <section className="card">
            <div className="section-head">
              <div>
                <div className="card-title">选择回测期号</div>
                <p className="section-desc">
                  例如选择第2026132期，系统会用2026132期之前的100期数据计算36码，然后对比2026132期真实开奖号码。
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
                <span>回测样本</span>
                <strong>{backtest?.beforeHistory?.length || 0}期</strong>
              </div>

              <div>
                <span>命中率</span>
                <strong>{backtest ? `${backtest.hitRate}%` : '-'}</strong>
              </div>
            </div>
          </section>

          {backtest && (
            <>
              <section className="top-grid">
                <div className="card latest-card">
                  <div className="card-title">
                    第 {backtest.target.expect} 期真实开奖
                  </div>

                  <div className="latest-info">
                    <div>
                      <span>开奖期号</span>
                      <strong>第 {backtest.target.expect} 期</strong>
                    </div>

                    <div>
                      <span>开奖时间</span>
                      <strong>{backtest.target.openTime || '-'}</strong>
                    </div>

                    <div>
                      <span>命中结果</span>
                      <strong>{backtest.hitNumbers.length} / 7</strong>
                    </div>
                  </div>

                  <div className="latest-balls">
                    {backtest.target.numbers.map((num, index) => (
                      <React.Fragment key={`${num}-${index}`}>
                        {index === 6 && <div className="plus">+</div>}
                        <Ball
                          num={num}
                          hit={backtest.hitNumbers.includes(num)}
                        />
                      </React.Fragment>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', color: '#a1a1aa' }}>
                    黄色边框 = 命中的开奖号码
                  </div>
                </div>

                <div className="card stats-card">
                  <div className="card-title">回测结果</div>

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
                      <span>命中率</span>
                      <strong>{backtest.hitRate}%</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card">
                <div className="card-title">命中号码</div>

                <div className="latest-balls">
                  {backtest.hitNumbers.length > 0 ? (
                    backtest.hitNumbers.map((num) => (
                      <Ball key={num} num={num} hit />
                    ))
                  ) : (
                    <p className="section-desc">没有命中号码</p>
                  )}
                </div>
              </section>

              <section className="card">
                <div className="card-title">未命中号码</div>

                <div className="latest-balls">
                  {backtest.missNumbers.length > 0 ? (
                    backtest.missNumbers.map((num) => (
                      <Ball key={num} num={num} />
                    ))
                  ) : (
                    <p className="section-desc">全部命中</p>
                  )}
                </div>
              </section>

              <section className="card">
                <div className="section-head">
                  <div>
                    <div className="card-title">该期回测推荐36码</div>
                    <p className="section-desc">
                      只使用第 {backtest.target.expect} 期之前的100期数据计算。
                    </p>
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
                      hit={backtest.target.numbers.includes(item.num)}
                    />
                  ))}
                </div>
              </section>

              <section className="three-grid">
                <div className="card">
                  <div className="card-title hot-title">热门号码 24个</div>
                  <p className="section-desc">该期之前100期中出现次数最多的24个号码。</p>

                  <div className="ball-grid">
                    {hotNumbers.map((item) => (
                      <Ball
                        key={item.num}
                        num={item.num}
                        count={item.count}
                        type="hot"
                        small
                        hit={backtest.target.numbers.includes(item.num)}
                      />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title cold-title">冷门号码 12个</div>
                  <p className="section-desc">该期之前100期中出现次数最少的12个号码。</p>

                  <div className="ball-grid">
                    {coldNumbers.map((item) => (
                      <Ball
                        key={item.num}
                        num={item.num}
                        count={item.count}
                        type="cold"
                        small
                        hit={backtest.target.numbers.includes(item.num)}
                      />
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">推荐结构</div>

                  <div className="analysis-list">
                    <div>
                      <span>红波</span>
                      <strong>{redCount}个</strong>
                    </div>

                    <div>
                      <span>蓝波</span>
                      <strong>{blueCount}个</strong>
                    </div>

                    <div>
                      <span>绿波</span>
                      <strong>{greenCount}个</strong>
                    </div>

                    <div>
                      <span>单数</span>
                      <strong>{oddCount}个</strong>
                    </div>

                    <div>
                      <span>双数</span>
                      <strong>{evenCount}个</strong>
                    </div>
                  </div>
                </div>
              </section>

              <div className="footer-note">
                回测逻辑：选择某一期后，只使用该期之前的100期数据计算36码，避免用开奖后的数据反推。
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
