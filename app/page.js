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

function getWaveText(num) {
  if (redWave.includes(Number(num))) return '红'
  if (blueWave.includes(Number(num))) return '蓝'
  return '绿'
}

function getZodiac(num, openTime) {
  const n = Number(num)
  const date = String(openTime || '')
  const year = Number(date.slice(0, 4)) || new Date().getFullYear()

  // 2026年对应：01/13/25/37/49 = 马，然后按号码分组顺序排列。
  const baseYear = 2026
  const baseZodiacs = ['马', '蛇', '龙', '兔', '虎', '牛', '鼠', '猪', '狗', '鸡', '猴', '羊']
  const offset = ((year - baseYear) % 12 + 12) % 12
  const zodiacs = baseZodiacs.map((_, index) => baseZodiacs[(index - offset + 12) % 12])

  const groups = [
    [1, 13, 25, 37, 49],
    [2, 14, 26, 38],
    [3, 15, 27, 39],
    [4, 16, 28, 40],
    [5, 17, 29, 41],
    [6, 18, 30, 42],
    [7, 19, 31, 43],
    [8, 20, 32, 44],
    [9, 21, 33, 45],
    [10, 22, 34, 46],
    [11, 23, 35, 47],
    [12, 24, 36, 48],
  ]

  const index = groups.findIndex((nums) => nums.includes(n))
  return index >= 0 ? zodiacs[index] : ''
}

function getOddEven(num) {
  return Number(num) % 2 === 0 ? '双' : '单'
}

function getBigSmall(num) {
  return Number(num) >= 25 ? '大' : '小'
}

function digitSum(num) {
  return String(Number(num) || 0)
    .split('')
    .reduce((total, item) => total + Number(item), 0)
}

function getSumOddEven(num) {
  return digitSum(num) % 2 === 0 ? '合双' : '合单'
}

function getSumBigSmall(num) {
  return digitSum(num) >= 7 ? '合大' : '合小'
}

function getTailBigSmall(num) {
  const tail = Number(String(num).slice(-1))
  return tail >= 5 ? '尾大' : '尾小'
}

function getDetailRecord(item) {
  const numbers = item?.numbers || []
  const specialNumber = item?.specialNumber || numbers[numbers.length - 1]
  const sum = numbers.reduce((total, num) => total + Number(num), 0)

  const numbersDetail = numbers.map((num, index) => ({
    num,
    zodiac: getZodiac(num, item.openTime),
    wave: getWaveText(num),
    isSpecial: index === numbers.length - 1,
  }))

  return {
    ...item,
    numbersDetail,
    specialNumber,
    specialDetail: numbersDetail[numbersDetail.length - 1],
    sum,
    sumOddEven: sum % 2 === 0 ? '双' : '单',
    sumBigSmall: sum >= 175 ? '大' : '小',
    specialOddEven: getOddEven(specialNumber),
    specialBigSmall: getBigSmall(specialNumber),
    specialSumOddEven: getSumOddEven(specialNumber),
    specialSumBigSmall: getSumBigSmall(specialNumber),
    specialTailBigSmall: getTailBigSmall(specialNumber),
  }
}

function DetailNumber({ detail, hit = false, hitType = 'normal' }) {
  const num = Number(detail?.num)
  const wave = getWave(num)
  const outlineColor = hit ? (hitType === 'special' ? '#facc15' : '#fde68a') : undefined

  return (
    <span className="detail-number">
      <span
        className={`mini-ball ${wave}`}
        style={
          hit
            ? {
                outline: `3px solid ${outlineColor}`,
                boxShadow: `0 0 10px ${outlineColor}`,
              }
            : undefined
        }
      >
        {String(num).padStart(2, '0')}
      </span>
      <span className="mini-zodiac">{detail?.zodiac || getZodiac(num)}</span>
    </span>
  )
}

function DetailBacktestTable({ title, rows, limit = 100 }) {
  return (
    <section className="card">
      <div className="card-title">{title}</div>
      <p className="section-desc">
        表格按开奖站样式展示，号码显示波色与生肖。下一期36码会提前固定保存；当前页面显示出来的近100期回测也会在后台分批冻结。上期或前几期如果显示未中，以后新增开奖后仍显示未中；策略切换不会再明显卡顿。黄色圈 = 特码落入当期筛选36码，绿色圈 = 平码落入36码。金额回测仍只按特码命中计算。
      </p>

      <div className="detail-table-wrap">
        <table className="detail-table">
          <thead>
            <tr>
              <th rowSpan="2">日期/期数</th>
              <th rowSpan="2">正码</th>
              <th rowSpan="2">特码</th>
              <th colSpan="4">总和</th>
              <th colSpan="5">特码</th>
              <th rowSpan="2">命中结果</th>
            </tr>
            <tr>
              <th>总数</th>
              <th>单双</th>
              <th>大小</th>
              <th>七色波</th>
              <th>单双</th>
              <th>大小</th>
              <th>合单双</th>
              <th>合大小</th>
              <th>尾大小</th>
            </tr>
          </thead>

          <tbody>
            {rows.slice(0, limit).map((rawItem) => {
              const item = getDetailRecord(rawItem)
              const recommendSet = new Set(item.recommendNumbers?.map((n) => n.num))
              const normalDetails = item.numbersDetail.slice(0, 6)
              const specialDetail = item.numbersDetail[6]
              const specialHit = recommendSet.has(item.specialNumber)

              return (
                <tr key={item.expect}>
                  <td className="issue-cell">
                    <strong>{item.openTime || '-'}</strong>
                    <span>第 {item.expect} 期</span>
                  </td>

                  <td className="numbers-cell">
                    {normalDetails.map((detail, index) => (
                      <DetailNumber
                        key={`${item.expect}-${detail.num}-${index}`}
                        detail={detail}
                        hit={recommendSet.has(detail.num)}
                        hitType="normal"
                      />
                    ))}
                  </td>

                  <td className="special-cell">
                    <DetailNumber
                      detail={specialDetail}
                      hit={specialHit}
                      hitType="special"
                    />
                  </td>

                  <td>{item.sum}</td>
                  <td className={item.sumOddEven === '双' ? 'red-text' : ''}>{item.sumOddEven}</td>
                  <td className={item.sumBigSmall === '大' ? 'red-text' : ''}>{item.sumBigSmall}</td>
                  <td className={`${getWave(item.specialNumber)}-text`}>{getWaveText(item.specialNumber)}</td>
                  <td className={item.specialOddEven === '双' ? 'red-text' : ''}>{item.specialOddEven}</td>
                  <td className={item.specialBigSmall === '大' ? 'red-text' : ''}>{item.specialBigSmall}</td>
                  <td className={item.specialSumOddEven === '合双' ? 'red-text' : ''}>{item.specialSumOddEven}</td>
                  <td className={item.specialSumBigSmall === '合大' ? 'red-text' : ''}>{item.specialSumBigSmall}</td>
                  <td className={item.specialTailBigSmall === '尾大' ? 'red-text' : ''}>{item.specialTailBigSmall}</td>

                  <td className={item.hit ? 'hit-text' : 'miss-text'}>
                    特码 {String(item.specialNumber).padStart(2, '0')}：
                    {item.hotHit ? '热码命中' : item.coldHit ? '冷码命中' : '未命中'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
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


function normalizeNumberList(items) {
  return (items || [])
    .map((item) => Number(item?.num ?? item))
    .filter((num) => Number.isInteger(num) && num >= 1 && num <= 49)
}

function getStableBacktestKey(play, strategyId, expect) {
  return `marksix-stable-backtest-v14-${play}-${strategyId || 'auto'}-${expect}`
}

function readStableBacktest(play, strategyId, expect) {
  if (typeof window === 'undefined' || !play || !expect) return null

  try {
    const raw = window.localStorage.getItem(getStableBacktestKey(play, strategyId, expect))
    if (!raw) return null

    const parsed = JSON.parse(raw)

    if (
      parsed?.version === 'stable-backtest-v14' &&
      parsed?.play === play &&
      parsed?.strategyId === (strategyId || 'auto') &&
      String(parsed?.expect) === String(expect)
    ) {
      return parsed
    }
  } catch (error) {
    console.warn('读取固定回测数据失败', error)
  }

  return null
}

function writeStableBacktest(play, strategyId, expect, strategy, analysis) {
  if (typeof window === 'undefined' || !play || !expect || !strategy || !analysis) return null

  try {
    const key = getStableBacktestKey(play, strategyId, expect)
    const existed = window.localStorage.getItem(key)

    // 核心规则：已经保存过的期号，永远不覆盖。
    // 所以今天未中，明天新增开奖后也不会被重算成中奖。
    if (existed) {
      return readStableBacktest(play, strategyId, expect)
    }

    const stored = {
      version: 'stable-backtest-v14',
      play,
      strategyId: strategyId || 'auto',
      expect: String(expect),
      generatedAt: Date.now(),
      usedStrategyId: strategy.id || '',
      usedStrategyLabel: strategy.label || '',
      recommendNumbers: normalizeNumberList(analysis.recommendNumbers),
      hotNumbers: normalizeNumberList(analysis.hotNumbers),
      coldNumbers: normalizeNumberList(analysis.coldNumbers),
    }

    window.localStorage.setItem(key, JSON.stringify(stored))
    return stored
  } catch (error) {
    console.warn('写入固定回测数据失败', error)
  }

  return null
}

function buildRowFromStableBacktest(target, stored) {
  const specialNumber = target.numbers[target.numbers.length - 1]

  const recommendNumbers = (stored?.recommendNumbers || []).map((num) => ({
    num: Number(num),
    count: 0,
    type: 'hot',
  }))

  const hotNumbers = (stored?.hotNumbers || []).map((num) => ({
    num: Number(num),
    count: 0,
    type: 'hot',
  }))

  const coldNumbers = (stored?.coldNumbers || []).map((num) => ({
    num: Number(num),
    count: 0,
    type: 'cold',
  }))

  const recommendSet = new Set(recommendNumbers.map((item) => item.num))
  const hotSet = new Set(hotNumbers.map((item) => item.num))
  const coldSet = new Set(coldNumbers.map((item) => item.num))

  const hit = recommendSet.has(Number(specialNumber))
  const hotHit = hotSet.has(Number(specialNumber))
  const coldHit = coldSet.has(Number(specialNumber))

  return {
    expect: target.expect,
    openTime: target.openTime,
    numbers: target.numbers,
    specialNumber,
    hit,
    hotHit,
    coldHit,
    recommendNumbers,
    hotNumbers,
    coldNumbers,
    usedStrategyId: stored?.usedStrategyId || '',
    usedStrategyLabel: stored?.usedStrategyLabel || '',
    isStableFrozen: true,
  }
}

function summarizeStableRows(rows = []) {
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

function buildStableBacktestResult(history, selectedStrategyId = 'auto', currentPlay = 'macau', rangeSize = 100) {
  const rows = []
  const strategyId = selectedStrategyId || 'auto'

  if (!history?.length) return summarizeStableRows(rows)

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const target = history[index]

    const stored = readStableBacktest(currentPlay, strategyId, target.expect)

    if (stored) {
      rows.push(buildRowFromStableBacktest(target, stored))
      continue
    }

    const beforeHistory = history.slice(index + 1)

    if (!beforeHistory.length) continue

    const beforeRanking = buildStrategyRanking(beforeHistory)

    if (!beforeRanking.length) continue

    const strategy =
      strategyId === 'auto'
        ? beforeRanking[0]
        : beforeRanking.find((item) => item.id === strategyId) || beforeRanking[0]

    if (!strategy || beforeHistory.length < getRequiredSampleSize(strategy)) continue

    const analysis = buildRecommendByStrategy(beforeHistory, strategy)
    const newStored = writeStableBacktest(currentPlay, strategyId, target.expect, strategy, analysis)

    if (newStored) {
      rows.push(buildRowFromStableBacktest(target, newStored))
      continue
    }

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
      usedStrategyId: strategy.id,
      usedStrategyLabel: strategy.label,
      ...analysis,
    })
  }

  return summarizeStableRows(rows)
}


function buildFastStableBacktestResult(history, strategy, selectedStrategyId = 'auto', currentPlay = 'macau', rangeSize = 100) {
  const rows = []
  const strategyId = selectedStrategyId || 'auto'

  if (!history?.length || !strategy) return summarizeStableRows(rows)

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const target = history[index]
    const stored = readStableBacktest(currentPlay, strategyId, target.expect)

    // 已经冻结过的期号，直接读取，不重新计算，不覆盖。
    if (stored) {
      rows.push(buildRowFromStableBacktest(target, stored))
      continue
    }

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

    // 注意：这里不写 localStorage。
    // 原来 V14 在切换策略时会一次性写入近100期，导致下拉框卡顿。
    // 固定功能由 freezeNextStableBacktest 负责提前冻结下一期。
    rows.push({
      expect: target.expect,
      openTime: target.openTime,
      numbers: target.numbers,
      specialNumber,
      hit,
      hotHit,
      coldHit,
      usedStrategyId: strategy.id,
      usedStrategyLabel: strategy.label,
      ...analysis,
    })
  }

  return summarizeStableRows(rows)
}


function freezeNextStableBacktest(history, strategyRanking, currentPlay, nextExpect) {
  if (typeof window === 'undefined') return
  if (!history?.length || !strategyRanking?.length || !nextExpect) return
  if (String(nextExpect).includes('等待')) return

  try {
    const targets = [
      {
        strategyId: 'auto',
        strategy: strategyRanking[0],
      },
      ...strategyRanking.slice(0, 20).map((strategy) => ({
        strategyId: strategy.id,
        strategy,
      })),
    ]

    targets.forEach(({ strategyId, strategy }) => {
      if (!strategy) return

      const key = getStableBacktestKey(currentPlay, strategyId, nextExpect)

      // 下一期如果已经冻结过，也不覆盖。
      if (window.localStorage.getItem(key)) return

      const analysis = buildRecommendByStrategy(history, strategy)

      window.localStorage.setItem(
        key,
        JSON.stringify({
          version: 'stable-backtest-v14',
          play: currentPlay,
          strategyId: strategyId || 'auto',
          expect: String(nextExpect),
          generatedAt: Date.now(),
          usedStrategyId: strategy.id || '',
          usedStrategyLabel: strategy.label || '',
          recommendNumbers: normalizeNumberList(analysis.recommendNumbers),
          hotNumbers: normalizeNumberList(analysis.hotNumbers),
          coldNumbers: normalizeNumberList(analysis.coldNumbers),
        })
      )
    })
  } catch (error) {
    console.warn('冻结下一期固定回测数据失败', error)
  }
}


function freezeVisibleBacktestRows(rows, currentPlay, selectedStrategyId) {
  if (typeof window === 'undefined') return
  if (!rows?.length || !currentPlay) return

  const strategyId = selectedStrategyId || 'auto'

  const tasks = rows
    .filter((row) => row && row.expect && row.recommendNumbers)
    .map((row) => ({
      key: getStableBacktestKey(currentPlay, strategyId, row.expect),
      row,
    }))

  if (!tasks.length) return

  let index = 0

  const runBatch = () => {
    const end = Math.min(index + 8, tasks.length)

    for (; index < end; index++) {
      const { key, row } = tasks[index]

      try {
        // 核心：已经冻结过的期号，永远不覆盖。
        if (window.localStorage.getItem(key)) continue

        window.localStorage.setItem(
          key,
          JSON.stringify({
            version: 'stable-backtest-v14',
            play: currentPlay,
            strategyId,
            expect: String(row.expect),
            generatedAt: Date.now(),
            usedStrategyId: row.usedStrategyId || '',
            usedStrategyLabel: row.usedStrategyLabel || '',
            recommendNumbers: normalizeNumberList(row.recommendNumbers),
            hotNumbers: normalizeNumberList(row.hotNumbers),
            coldNumbers: normalizeNumberList(row.coldNumbers),
          })
        )
      } catch (error) {
        console.warn('后台冻结近100期回测失败', error)
      }
    }

    if (index < tasks.length) {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(runBatch, { timeout: 800 })
      } else {
        window.setTimeout(runBatch, 30)
      }
    }
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(runBatch, { timeout: 800 })
  } else {
    window.setTimeout(runBatch, 30)
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


function buildTop20AggregateRecommend(beforeHistory, aggregateStrategies = [], hotCount = 36, coldCount = 0) {
  const occurrenceMap = new Map()

  for (let i = 1; i <= 49; i++) {
    occurrenceMap.set(i, {
      num: i,
      count: 0,
      scoreTotal: 0,
      strategies: 0,
      type: 'hot',
    })
  }

  const usableStrategies = aggregateStrategies
    .filter((strategy) => strategy && beforeHistory.length >= strategy.sampleSize)
    .slice(0, 20)

  usableStrategies.forEach((strategy) => {
    const analysis = buildRecommend(beforeHistory, strategy)

    analysis.recommendNumbers.forEach((item) => {
      const old = occurrenceMap.get(item.num) || {
        num: item.num,
        count: 0,
        scoreTotal: 0,
        strategies: 0,
        type: 'hot',
      }

      occurrenceMap.set(item.num, {
        ...old,
        count: old.count + 1,
        scoreTotal: old.scoreTotal + Number(item.count || 0),
        strategies: old.strategies + 1,
        type: 'hot',
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
    strategies: item.strategies,
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
      strategies: item.strategies,
      type: 'cold',
    }))

  const recommendNumbers = [...hotNumbers, ...coldNumbers].sort(
    (a, b) => a.num - b.num
  )

  return {
    hotNumbers,
    coldNumbers,
    recommendNumbers,
    sourceStrategyCount: usableStrategies.length,
    totalCandidateCount: usableStrategies.length * 36,
  }
}

function buildRecommendByStrategy(beforeHistory, strategy) {
  if (strategy?.mode === 'aggregateTop20') {
    return buildTop20AggregateRecommend(beforeHistory, strategy.aggregateStrategies || [], strategy.hotCount || 36, strategy.coldCount || 0)
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
      label: '20档位综合｜前20档 × 36码｜出现率最高36码',
      desc: '取策略排行榜前20个档位，每个档位筛选36码，共720个号码，统计出现次数最高的前36个号码。',
    },
    {
      hotCount: 30,
      coldCount: 6,
      label: '20档位综合｜30热 + 6冷｜前20档出现率',
      desc: '取前20个档位共720个号码，选出现次数最高30个作为热码，再选出现次数最低6个作为冷码。',
    },
    {
      hotCount: 26,
      coldCount: 10,
      label: '20档位综合｜26热 + 10冷｜前20档出现率',
      desc: '取前20个档位共720个号码，选出现次数最高26个作为热码，再选出现次数最低10个作为冷码。',
    },
    {
      hotCount: 24,
      coldCount: 12,
      label: '20档位综合｜24热 + 12冷｜前20档出现率',
      desc: '取前20个档位共720个号码，选出现次数最高24个作为热码，再选出现次数最低12个作为冷码。',
    },
    {
      hotCount: 18,
      coldCount: 18,
      label: '20档位综合｜18热 + 18冷｜前20档出现率',
      desc: '取前20个档位共720个号码，选出现次数最高18个作为热码，再选出现次数最低18个作为冷码。',
    },
  ]

  const aggregateStrategies = aggregateCombos.map((combo) => {
    const aggregateStrategyBase = {
      id: `aggregate-top20-${combo.hotCount}-${combo.coldCount}`,
      mode: 'aggregateTop20',
      modeLabel: `20档位综合 ${combo.hotCount}热+${combo.coldCount}冷`,
      desc: combo.desc,
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


function buildFixedStrategyBacktestResult(history, strategy, rangeSize = 100) {
  const rows = []

  if (!history?.length || !strategy) {
    return {
      testedCount: 0,
      hitCount: 0,
      hotHitCount: 0,
      coldHitCount: 0,
      hitRate: 0,
      hotHitRate: 0,
      coldHitRate: 0,
      rows,
    }
  }

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

      const text = await res.text()

      if (!text || !text.trim()) {
        throw new Error(`${playConfig.name}接口返回空内容，请检查 app/api/history/route.js`)
      }

      let json

      try {
        json = JSON.parse(text)
      } catch (error) {
        console.log(`${playConfig.name}接口原始返回内容：`, text)
        throw new Error(`${playConfig.name}接口返回的不是JSON，请检查 app/api/history/route.js`)
      }

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

  const rawStrategyRanking = React.useMemo(() => {
    if (!history.length) return []
    return buildStrategyRanking(history)
  }, [history])

  const strategyRanking = React.useMemo(() => {
    if (!history.length || !rawStrategyRanking.length) return []

    return rawStrategyRanking.slice(0, 20)
      .map((strategy) => {
        const result100 = buildFastStableBacktestResult(
          history,
          strategy,
          strategy.id,
          currentPlay,
          100
        )

        const result50 = summarizeStableRows(result100.rows.slice(0, 50))

        const score = Number(
          (
            (Number(result100.hitRate) || 0) * 0.7 +
            (Number(result50.hitRate) || 0) * 0.3
          ).toFixed(2)
        )

        return {
          ...strategy,
          result100,
          result50,
          score,
        }
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        if (b.result100.hitRate !== a.result100.hitRate) {
          return b.result100.hitRate - a.result100.hitRate
        }
        return b.result50.hitRate - a.result50.hitRate
      })
  }, [history, rawStrategyRanking, currentPlay])

  const bestStrategy = strategyRanking[0] || null

  const currentStrategy =
    selectedStrategyId === 'auto'
      ? bestStrategy
      : strategyRanking.find((item) => item.id === selectedStrategyId) || bestStrategy

  function saveTop20SnapshotAndGo() {
    try {
      const top20 = strategyRanking.slice(0, 20)
      const latest = history[0]

      if (!latest || !top20.length) {
        window.location.href = '/top20'
        return
      }

      function makeCellByStrategy(draw, strategy, index) {
        const result = buildSingleBacktest(history, draw.expect, strategy)

        return {
          rank: index + 1,
          label: strategy.label,
          strategyId: strategy.id,
          modeLabel: strategy.modeLabel,
          usedStrategyId: strategy.id,
          usedStrategyLabel: strategy.label,
          expect: draw.expect,
          openTime: draw.openTime,
          specialNumber: draw.numbers?.[draw.numbers.length - 1],
          hit: Boolean(result?.hit),
          hotHit: Boolean(result?.hotHit),
          coldHit: Boolean(result?.coldHit),
          status: result?.hotHit ? '热码命中' : result?.coldHit ? '冷码命中' : result?.hit ? '命中' : '未中',
          shortStatus: result?.hotHit ? '热中' : result?.coldHit ? '冷中' : result?.hit ? '中' : '未中',
          strategy: {
            id: strategy.id,
            label: strategy.label,
            modeLabel: strategy.modeLabel,
            hotCount: strategy.hotCount,
            coldCount: strategy.coldCount,
            result100: strategy.result100
              ? {
                  hitCount: strategy.result100.hitCount,
                  testedCount: strategy.result100.testedCount,
                  hitRate: strategy.result100.hitRate,
                }
              : null,
            result50: strategy.result50
              ? {
                  hitCount: strategy.result50.hitCount,
                  testedCount: strategy.result50.testedCount,
                  hitRate: strategy.result50.hitRate,
                }
              : null,
            result30: strategy.result30
              ? {
                  hitCount: strategy.result30.hitCount,
                  testedCount: strategy.result30.testedCount,
                  hitRate: strategy.result30.hitRate,
                }
              : null,
          },
        }
      }

      function makeCellFromDetailRow(draw, detailRow, fallbackStrategy, index) {
        if (!detailRow) {
          return makeCellByStrategy(draw, fallbackStrategy, index)
        }

        const specialNumber = draw.numbers?.[draw.numbers.length - 1]

        return {
          rank: index + 1,
          label: fallbackStrategy.label,
          strategyId: fallbackStrategy.id,
          modeLabel: fallbackStrategy.modeLabel,
          usedStrategyId: fallbackStrategy.id,
          usedStrategyLabel: fallbackStrategy.label,
          expect: draw.expect,
          openTime: draw.openTime,
          specialNumber,
          hit: Boolean(detailRow.hit),
          hotHit: Boolean(detailRow.hotHit),
          coldHit: Boolean(detailRow.coldHit),
          status: detailRow.hotHit ? '热码命中' : detailRow.coldHit ? '冷码命中' : detailRow.hit ? '命中' : '未中',
          shortStatus: detailRow.hotHit ? '热中' : detailRow.coldHit ? '冷中' : detailRow.hit ? '中' : '未中',
          strategy: {
            id: fallbackStrategy.id,
            label: fallbackStrategy.label,
            modeLabel: fallbackStrategy.modeLabel,
            hotCount: fallbackStrategy.hotCount,
            coldCount: fallbackStrategy.coldCount,
            result100: fallbackStrategy.result100
              ? {
                  hitCount: fallbackStrategy.result100.hitCount,
                  testedCount: fallbackStrategy.result100.testedCount,
                  hitRate: fallbackStrategy.result100.hitRate,
                }
              : null,
            result50: fallbackStrategy.result50
              ? {
                  hitCount: fallbackStrategy.result50.hitCount,
                  testedCount: fallbackStrategy.result50.testedCount,
                  hitRate: fallbackStrategy.result50.hitRate,
                }
              : null,
            result30: fallbackStrategy.result30
              ? {
                  hitCount: fallbackStrategy.result30.hitCount,
                  testedCount: fallbackStrategy.result30.testedCount,
                  hitRate: fallbackStrategy.result30.hitRate,
                }
              : null,
          },
        }
      }

      const latestStats = top20.map((strategy, index) => {
        if (index === 0) {
          const detailRow = best100Rows.find(
            (row) => String(row.expect) === String(latest.expect)
          )

          return makeCellFromDetailRow(latest, detailRow, strategy, index)
        }

        return makeCellByStrategy(latest, strategy, index)
      })

      const recentRows = history.slice(0, 30).map((draw) => {
        const specialNumber = draw?.numbers?.[draw.numbers.length - 1]
        const detailRow = best100Rows.find(
          (row) => String(row.expect) === String(draw.expect)
        )

        const cells = top20.map((strategy, index) => {
          const cell = index === 0
            ? makeCellFromDetailRow(draw, detailRow, strategy, index)
            : makeCellByStrategy(draw, strategy, index)

          return {
            rank: cell.rank,
            strategyId: cell.strategyId,
            strategyLabel: cell.label,
            usedStrategyId: cell.usedStrategyId,
            usedStrategyLabel: cell.usedStrategyLabel,
            hit: cell.hit,
            hotHit: cell.hotHit,
            coldHit: cell.coldHit,
            status: cell.shortStatus,
          }
        })

        return {
          expect: draw.expect,
          openTime: draw.openTime,
          specialNumber,
          cells,
        }
      })

      const snapshot = {
        version: 'home-sync-v10-first-column-detail-table',
        play: currentPlay,
        generatedAt: Date.now(),
        latest,
        latestSpecial: latest.numbers?.[latest.numbers.length - 1],
        latestStats,
        hitRanks: latestStats.filter((item) => item.hit),
        recentRows,
      }

      window.localStorage.setItem(
        `marksix-top20-home-snapshot-${currentPlay}`,
        JSON.stringify(snapshot)
      )
    } catch (error) {
      console.warn('保存 /top20 同步数据失败', error)
    }

    window.location.href = '/top20'
  }

  const historicalStrategy = React.useMemo(() => {
    if (!history.length || !selectedExpect) return currentStrategy

    const targetIndex = history.findIndex(
      (item) => String(item.expect) === String(selectedExpect)
    )

    if (targetIndex === -1) return currentStrategy

    const beforeHistory = history.slice(targetIndex + 1)

    if (!beforeHistory.length) return currentStrategy

    const beforeRanking = buildStrategyRanking(beforeHistory)

    if (!beforeRanking.length) return currentStrategy

    if (selectedStrategyId === 'auto') {
      return beforeRanking[0]
    }

    return beforeRanking.find((item) => item.id === selectedStrategyId) || beforeRanking[0]
  }, [history, selectedExpect, selectedStrategyId, currentStrategy])

  const singleBacktest = buildSingleBacktest(
    history,
    selectedExpect,
    historicalStrategy
  )

  const nextAnalysis =
    currentStrategy && history.length
      ? buildRecommendByStrategy(history, currentStrategy)
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

  const detailBacktest100 = React.useMemo(() => {
    if (!history.length || !currentStrategy) return null
    return buildFastStableBacktestResult(history, currentStrategy, currentStrategy.id, currentPlay, 100)
  }, [history, currentStrategy, currentPlay])

  const detailBacktest50 = React.useMemo(() => {
    if (!detailBacktest100?.rows?.length) return null
    return summarizeStableRows(detailBacktest100.rows.slice(0, 50))
  }, [detailBacktest100])

  const best100Rows = detailBacktest100?.rows || []
  const best50Rows = detailBacktest50?.rows || []

  React.useEffect(() => {
    freezeVisibleBacktestRows(best100Rows, currentPlay, selectedStrategyId)
  }, [best100Rows, currentPlay, selectedStrategyId])

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

  const currentFinance100 = detailBacktest100
    ? calculateProfit(
        detailBacktest100.hitCount,
        detailBacktest100.testedCount,
        totalBetPerIssue,
        odds
      )
    : null

  const currentFinance50 = detailBacktest50
    ? calculateProfit(
        detailBacktest50.hitCount,
        detailBacktest50.testedCount,
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


        .detail-table-wrap {
          overflow-x: auto;
          border: 1px solid #d9d9d9;
          border-radius: 0;
          margin-top: 16px;
          background: #ffffff;
        }

        .detail-table {
          width: max-content;
          min-width: 1240px;
          border-collapse: collapse;
          font-size: 14px;
          color: #111827;
          background: #ffffff;
        }

        .detail-table th,
        .detail-table td {
          border: 1px solid #d9d9d9;
          padding: 10px 8px;
          text-align: center;
          white-space: nowrap;
          background: #ffffff;
          vertical-align: middle;
        }

        .detail-table thead th {
          background: #f3f4f6;
          color: #111827;
          font-weight: 800;
        }

        .detail-table tbody tr:hover td {
          background: #fffaf0;
        }

        .issue-cell {
          text-align: left !important;
          min-width: 138px;
          color: #111827;
          font-weight: 700;
        }

        .issue-cell strong,
        .issue-cell span {
          display: inline;
        }

        .issue-cell span {
          margin-left: 4px;
          color: #111827;
        }

        .numbers-cell {
          min-width: 385px;
          text-align: left !important;
        }

        .special-cell {
          min-width: 92px;
        }

        .detail-number {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin: 3px 5px;
        }

        .mini-ball {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 900;
          font-size: 14px;
          box-shadow: none;
        }

        .mini-ball.red {
          background: #ff2448;
        }

        .mini-ball.blue {
          background: #1296db;
        }

        .mini-ball.green {
          background: #22c55e;
        }

        .mini-zodiac {
          color: #111827;
          font-weight: 700;
        }

        .red-text {
          color: #ff2448;
          font-weight: 800;
        }

        .blue-text {
          color: #1296db;
          font-weight: 800;
        }

        .green-text {
          color: #16a34a;
          font-weight: 800;
        }

        .hit-text {
          color: #d97706;
          font-weight: 800;
        }

        .miss-text {
          color: #111827;
          font-weight: 700;
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

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
            <button
              type="button"
              onClick={saveTop20SnapshotAndGo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 18px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#ffffff',
                fontWeight: 900,
                textDecoration: 'none',
                boxShadow: '0 10px 24px rgba(34, 197, 94, 0.22)',
                border: 0,
                cursor: 'pointer',
              }}
            >
              查看20档位当期开奖统计
            </button>
          </div>
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

                {currentStrategy?.mode === 'aggregateTop20' && (
                  <div>
                    <span>综合统计</span>
                    <strong>20档×36码，{currentStrategy.hotCount}热 + {currentStrategy.coldCount}冷</strong>
                  </div>
                )}
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
                系统自动测试多种组合，默认选择综合表现最好的策略。这里的100期/50期胜率与右侧策略选择下拉框使用同一套固定回测口径。
              </p>

              <div className="latest-info">
                <div>
                  <span>策略名称</span>
                  <strong>{currentStrategy?.label}</strong>
                </div>

                <div>
                  <span>近100期总命中率</span>
                  <strong>
                    {detailBacktest100?.hitCount || 0} / {detailBacktest100?.testedCount || 0}
                    {' '}
                    = {detailBacktest100?.hitRate || 0}%
                  </strong>
                </div>

                <div>
                  <span>近50期总命中率</span>
                  <strong>
                    {detailBacktest50?.hitCount || 0} / {detailBacktest50?.testedCount || 0}
                    {' '}
                    = {detailBacktest50?.hitRate || 0}%
                  </strong>
                </div>
              </div>

              <div className="latest-info">
                <div>
                  <span>近100期热码命中</span>
                  <strong>
                    {detailBacktest100?.hotHitCount || 0} / {detailBacktest100?.testedCount || 0}
                    {' '}
                    = {detailBacktest100?.hotHitRate || 0}%
                  </strong>
                </div>

                <div>
                  <span>近100期冷码命中</span>
                  <strong>
                    {detailBacktest100?.coldHitCount || 0} / {detailBacktest100?.testedCount || 0}
                    {' '}
                    = {detailBacktest100?.coldHitRate || 0}%
                  </strong>
                </div>

                <div>
                  <span>{currentStrategy.mode === 'aggregateTop20' ? '综合来源' : '热码 + 冷码'}</span>
                  <strong>
                    {currentStrategy.mode === 'aggregateTop20'
                      ? `20档 × 36码 = 720码，${currentStrategy.hotCount}热 + ${currentStrategy.coldCount}冷`
                      : `${currentStrategy.hotCount} + ${currentStrategy.coldCount} = 36码`}
                  </strong>
                </div>
              </div>

              <div className="latest-info">
                <div>
                  <span>近50期热码命中</span>
                  <strong>
                    {detailBacktest50?.hotHitCount || 0} / {detailBacktest50?.testedCount || 0}
                    {' '}
                    = {detailBacktest50?.hotHitRate || 0}%
                  </strong>
                </div>

                <div>
                  <span>近50期冷码命中</span>
                  <strong>
                    {detailBacktest50?.coldHitCount || 0} / {detailBacktest50?.testedCount || 0}
                    {' '}
                    = {detailBacktest50?.coldHitRate || 0}%
                  </strong>
                </div>

                <div>
                  <span>算法</span>
                  <strong>{historicalStrategy?.modeLabel || currentStrategy?.modeLabel}</strong>
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
              排名按同一套固定回测口径计算：近100期命中率70%权重 + 近50期命中率30%权重。金额按每期投入 {formatMoney(totalBetPerIssue)}、赔率 {odds} 倍计算。
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
                  这里是历史回测，不是下一期推荐。选择某一期，系统会优先读取该期已经固定保存的36码；如果没有保存，才使用该期之前的数据生成并立即固定保存，避免以后新增开奖后旧期结果被改写。
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
                <strong>{historicalStrategy?.modeLabel || currentStrategy?.modeLabel}</strong>
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
                      <strong>{historicalStrategy?.modeLabel || currentStrategy?.modeLabel}</strong>
                    </div>

                    <div>
                      <span>样本/来源</span>
                      <strong>{currentStrategy.mode === 'aggregateTop20' ? '前20档位综合' : `前${currentStrategy.sampleSize}期`}</strong>
                    </div>

                    <div>
                      <span>组合</span>
                      <strong>{currentStrategy.mode === 'aggregateTop20' ? `720码里选 ${currentStrategy.hotCount}热 + ${currentStrategy.coldCount}冷` : `热${currentStrategy.hotCount} + 冷${currentStrategy.coldCount}`}</strong>
                    </div>

                    <div>
                      <span>说明</span>
                      <strong>{currentStrategy.desc}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <DetailBacktestTable title="近100期回测明细" rows={best100Rows} limit={100} />

              <DetailBacktestTable title="近50期回测明细" rows={best50Rows} limit={50} />

              <div className="footer-note">
                回测逻辑：近100期/50期明细优先读取固定保存的36码。上期开的号码或前几期开的号码，如果当时未中，后面新增开奖后仍然未中。绿色圈表示前6个平码落入36码；黄色圈表示最后特码落入36码。金额回测只按特码命中计算。
              </div>
            </>
          )}
        </>
      )}
    </main>
  )
}
