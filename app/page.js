'use client'

import React from 'react'

const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

function getWave(num) {
  if (redWave.includes(num)) return 'red'
  if (blueWave.includes(num)) return 'blue'
  return 'green'
}

function Ball({ num, count, type, small = false }) {
  const wave = getWave(Number(num))

  return (
    <div className={`ball-box ${small ? 'small' : ''}`}>
      <div className={`ball ${wave}`}>
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

export default function Page() {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [filter, setFilter] = React.useState('all')

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
    } catch (err) {
      setError(err.message || '数据获取失败')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const recommendNumbers = data?.recommendNumbers || []
  const hotNumbers = data?.hotNumbers || []
  const coldNumbers = data?.coldNumbers || []
  const ranking = data?.ranking || []

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
          <div className="badge">澳门六合彩历史数据分析</div>
          <h1>36码智能筛选系统</h1>
          <p>
            自动抓取历史开奖数据，统计最近100期号码频率，筛选24个热门号 + 12个冷门号。
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
          <section className="top-grid">
            <div className="card latest-card">
              <div className="card-title">最新开奖</div>

              <div className="latest-info">
                <div>
                  <span>最新期号</span>
                  <strong>第 {data.latest?.expect} 期</strong>
                </div>

                <div>
                  <span>开奖时间</span>
                  <strong>{data.latest?.openTime || '-'}</strong>
                </div>

                <div>
                  <span>下期参考</span>
                  <strong>第 {data.nextExpect || '-'} 期</strong>
                </div>
              </div>

              <div className="latest-balls">
                {(data.latest?.numbers || []).map((num, index) => (
                  <React.Fragment key={`${num}-${index}`}>
                    {index === 6 && <div className="plus">+</div>}
                    <Ball num={num} />
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="card stats-card">
              <div className="card-title">筛选结果</div>

              <div className="stats-list">
                <div>
                  <span>统计期数</span>
                  <strong>{data.recentCount}期</strong>
                </div>

                <div>
                  <span>热门号码</span>
                  <strong>{hotNumbers.length}个</strong>
                </div>

                <div>
                  <span>冷门号码</span>
                  <strong>{coldNumbers.length}个</strong>
                </div>

                <div>
                  <span>最终推荐</span>
                  <strong>{recommendNumbers.length}个</strong>
                </div>
              </div>

              <div className="mini-note">
                规则：最近100期，平码 + 特码全部参与统计。
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-head">
              <div>
                <div className="card-title">推荐36码</div>
                <p className="section-desc">
                  24个热门号 + 12个冷门号，按号码从小到大排列。
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
                />
              ))}
            </div>
          </section>

          <section className="three-grid">
            <div className="card">
              <div className="card-title hot-title">热门号码 24个</div>
              <p className="section-desc">出现次数最多的前24个号码。</p>

              <div className="ball-grid">
                {hotNumbers.map((item) => (
                  <Ball
                    key={item.num}
                    num={item.num}
                    count={item.count}
                    type="hot"
                    small
                  />
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-title cold-title">冷门号码 12个</div>
              <p className="section-desc">出现次数最少的前12个号码。</p>

              <div className="ball-grid">
                {coldNumbers.map((item) => (
                  <Ball
                    key={item.num}
                    num={item.num}
                    count={item.count}
                    type="cold"
                    small
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

          <section className="card">
            <div className="section-head">
              <div>
                <div className="card-title">1-49完整出现次数</div>
                <p className="section-desc">
                  用于查看每个号码在最近100期内的出现频率。
                </p>
              </div>
            </div>

            <div className="rank-grid">
              {ranking.map((item) => (
                <div key={item.num} className="rank-item">
                  <Ball num={item.num} small />
                  <div className="rank-count">{item.count}次</div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-title">最近开奖记录</div>

            <div className="history-list">
              {(data.recentHistory || []).map((item) => (
                <div key={item.expect} className="history-row">
                  <div className="history-meta">
                    <strong>第 {item.expect} 期</strong>
                    <span>{item.openTime}</span>
                  </div>

                  <div className="history-balls">
                    {item.numbers.map((num, index) => (
                      <React.Fragment key={`${item.expect}-${num}-${index}`}>
                        {index === 6 && <span className="history-plus">+</span>}
                        <Ball num={num} small />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="footer-note">
            数据来源：macaujc.com。系统只做历史数据统计参考，不代表下一期开奖结果。
          </div>
        </>
      )}
    </main>
  )
}
