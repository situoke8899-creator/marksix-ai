'use client'

import React from 'react'

const PLAY_CONFIG = {
  macau: {
    name: '澳门',
    api: '/api/history?play=macau',
  },
  hongkong: {
    name: '香港',
    api: '/api/history?play=hongkong',
  },
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



const STABLE_BACKTEST_VERSION = 'stable-backtest-v19'
const TOP20_REALTIME_SNAPSHOT_VERSION = 'top20-realtime-snapshot-v19'
const LEGACY_STABLE_BACKTEST_VERSIONS = ['v16', 'v15']
const LEGACY_TOP20_SNAPSHOT_VERSIONS = ['v16']

function getStableBacktestKey(play, strategyId, expect) {
  return `marksix-stable-backtest-v19-${play}-${strategyId || 'auto'}-${expect}`
}

function getLegacyStableBacktestKey(version, play, strategyId, expect) {
  return `marksix-stable-backtest-${version}-${play}-${strategyId || 'auto'}-${expect}`
}

function getTop20RealtimeSnapshotKey(play, expect) {
  return `marksix-top20-realtime-snapshot-v19-${play}-${expect}`
}

function getLegacyTop20RealtimeSnapshotKey(version, play, expect) {
  return `marksix-top20-realtime-snapshot-${version}-${play}-${expect}`
}

function numberItemsToNumbers(items) {
  return (items || [])
    .map((item) => Number(item?.num ?? item))
    .filter((num) => Number.isInteger(num) && num >= 1 && num <= 49)
}

function isStableBacktestRecord(parsed, play, strategyId, expect) {
  return (
    parsed &&
    parsed.play === play &&
    parsed.strategyId === (strategyId || 'auto') &&
    String(parsed.expect) === String(expect)
  )
}

function isQuotaError(error) {
  return (
    error?.name === 'QuotaExceededError' ||
    error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    Number(error?.code) === 22 ||
    Number(error?.code) === 1014
  )
}

function sortStoredItemsNewestFirst(a, b) {
  const timeDiff = Number(b.generatedAt || b.resolvedAt || 0) - Number(a.generatedAt || a.resolvedAt || 0)
  if (timeDiff !== 0) return timeDiff
  return String(b.expect || '').localeCompare(String(a.expect || ''), undefined, { numeric: true })
}

function cleanupStableStorage(play, aggressive = false) {
  if (typeof window === 'undefined' || !play) return

  try {
    const removeKeys = new Set()
    const realtimeItems = []
    const snapshotItems = []
    const historicalSources = ['historical-baseline', 'visible-row-freeze', 'historical-first-view']

    for (let index = 0; index < window.localStorage.length; index++) {
      const key = window.localStorage.key(index)
      if (!key) continue

      const isStableKey =
        key.startsWith(`marksix-stable-backtest-v19-${play}-`) ||
        key.startsWith(`marksix-stable-backtest-v16-${play}-`) ||
        key.startsWith(`marksix-stable-backtest-v15-${play}-`)

      const isSnapshotKey =
        key.startsWith(`marksix-top20-realtime-snapshot-v19-${play}-`) ||
        key.startsWith(`marksix-top20-realtime-snapshot-v16-${play}-`)

      if (!isStableKey && !isSnapshotKey) continue

      let parsed = null
      try {
        parsed = JSON.parse(window.localStorage.getItem(key) || 'null')
      } catch (error) {
        removeKeys.add(key)
        continue
      }

      if (isStableKey) {
        const source = String(parsed?.source || '')
        if (!parsed || historicalSources.some((item) => source.includes(item))) {
          removeKeys.add(key)
          continue
        }

        if (source.startsWith('realtime-next-freeze')) {
          realtimeItems.push({ key, ...parsed })
        } else if (aggressive) {
          removeKeys.add(key)
        }
      }

      if (isSnapshotKey) {
        if (!parsed || !Array.isArray(parsed.strategies)) {
          removeKeys.add(key)
          continue
        }
        snapshotItems.push({ key, ...parsed })
      }
    }

    const keepRealtimeCount = aggressive ? 1800 : 3200
    const keepSnapshotCount = aggressive ? 160 : 260

    realtimeItems
      .sort(sortStoredItemsNewestFirst)
      .slice(keepRealtimeCount)
      .forEach((item) => removeKeys.add(item.key))

    snapshotItems
      .sort(sortStoredItemsNewestFirst)
      .slice(keepSnapshotCount)
      .forEach((item) => removeKeys.add(item.key))

    removeKeys.forEach((key) => window.localStorage.removeItem(key))
  } catch (error) {
    console.warn('清理冻结缓存失败', error)
  }
}

function safeSetLocalStorage(key, value, play) {
  if (typeof window === 'undefined') return false

  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (error) {
    if (!isQuotaError(error)) {
      console.warn('保存冻结缓存失败', error)
      return false
    }
  }

  cleanupStableStorage(play, true)

  try {
    window.localStorage.setItem(key, value)
    return true
  } catch (error) {
    console.warn('浏览器本地缓存空间不足，已清理旧历史基准记录，但保存仍然失败', error)
    return false
  }
}

function compactStableRecord(record) {
  return {
    version: STABLE_BACKTEST_VERSION,
    play: record.play,
    strategyId: record.strategyId || 'auto',
    expect: String(record.expect),
    generatedAt: Number(record.generatedAt || Date.now()),
    source: record.source || 'realtime-next-freeze-v19',
    usedStrategyId: record.usedStrategyId || record.strategyId || '',
    recommendNumbers: numberItemsToNumbers(record.recommendNumbers),
    hotNumbers: numberItemsToNumbers(record.hotNumbers),
    coldNumbers: numberItemsToNumbers(record.coldNumbers),
    resultLocked: Boolean(record.resultLocked),
    ...(record.resultLocked
      ? {
          resolvedAt: Number(record.resolvedAt || Date.now()),
          specialNumber: Number(record.specialNumber),
          hit: Boolean(record.hit),
          hotHit: Boolean(record.hotHit),
          coldHit: Boolean(record.coldHit),
        }
      : {}),
  }
}

function readStableBacktest(play, strategyId, expect) {
  if (typeof window === 'undefined' || !play || !expect) return null

  try {
    const key = getStableBacktestKey(play, strategyId, expect)
    const currentRaw = window.localStorage.getItem(key)

    if (currentRaw) {
      const currentParsed = JSON.parse(currentRaw)
      if (
        currentParsed?.version === STABLE_BACKTEST_VERSION &&
        isStableBacktestRecord(currentParsed, play, strategyId, expect)
      ) {
        return { ...currentParsed, persisted: true }
      }
    }

    for (const version of LEGACY_STABLE_BACKTEST_VERSIONS) {
      const legacyRaw = window.localStorage.getItem(
        getLegacyStableBacktestKey(version, play, strategyId, expect)
      )
      if (!legacyRaw) continue

      const legacyParsed = JSON.parse(legacyRaw)
      const isRealtimeLegacy =
        isStableBacktestRecord(legacyParsed, play, strategyId, expect) &&
        String(legacyParsed?.source || '').startsWith('realtime-next-freeze')

      if (!isRealtimeLegacy) continue

      const migrated = compactStableRecord({
        ...legacyParsed,
        source: `realtime-next-freeze-migrated-${version}`,
      })

      safeSetLocalStorage(key, JSON.stringify(migrated), play)
      return { ...migrated, persisted: true }
    }
  } catch (error) {
    console.warn('读取冻结回测数据失败', error)
  }

  return null
}

function makeLockedOutcome(draw, stored) {
  const specialNumber = Number(draw?.numbers?.[draw.numbers.length - 1])
  const recommendSet = new Set(numberItemsToNumbers(stored?.recommendNumbers))
  const hotSet = new Set(numberItemsToNumbers(stored?.hotNumbers))
  const coldSet = new Set(numberItemsToNumbers(stored?.coldNumbers))

  return {
    resultLocked: true,
    resolvedAt: Date.now(),
    specialNumber,
    hit: recommendSet.has(specialNumber),
    hotHit: hotSet.has(specialNumber),
    coldHit: coldSet.has(specialNumber),
  }
}

function finalizeStableBacktestOutcome(play, strategyId, draw, stored) {
  if (!stored || !draw?.numbers?.length) return stored
  if (stored.resultLocked) return stored

  const resolved = {
    ...stored,
    ...makeLockedOutcome(draw, stored),
  }

  if (stored.persisted !== false) {
    const compact = compactStableRecord(resolved)
    safeSetLocalStorage(
      getStableBacktestKey(play, strategyId, draw.expect),
      JSON.stringify(compact),
      play
    )
    return { ...compact, persisted: true }
  }

  return { ...resolved, persisted: false }
}

function makeHistoricalBaselineRecord(play, strategyId, draw, strategy, analysis) {
  const baseline = {
    version: STABLE_BACKTEST_VERSION,
    play,
    strategyId: strategyId || strategy.id || 'auto',
    expect: String(draw.expect),
    generatedAt: Date.now(),
    source: 'historical-calculated-baseline-v19',
    usedStrategyId: strategy.id || '',
    recommendNumbers: numberItemsToNumbers(analysis.recommendNumbers),
    hotNumbers: numberItemsToNumbers(analysis.hotNumbers),
    coldNumbers: numberItemsToNumbers(analysis.coldNumbers),
    resultLocked: false,
    persisted: false,
  }

  return {
    ...baseline,
    ...makeLockedOutcome(draw, baseline),
    persisted: false,
  }
}

function ensureStableBacktestRow(history, index, strategy, play) {
  const draw = history?.[index]
  if (!draw || !strategy || !play) return null

  const existed = readStableBacktest(play, strategy.id, draw.expect)
  if (existed) return existed

  const beforeHistory = history.slice(index + 1)
  if (beforeHistory.length < getRequiredSampleSize(strategy)) return null

  const analysis = buildRecommendByStrategy(beforeHistory, strategy)
  return makeHistoricalBaselineRecord(play, strategy.id, draw, strategy, analysis)
}

function compactTop20Snapshot(snapshot) {
  return {
    version: TOP20_REALTIME_SNAPSHOT_VERSION,
    play: snapshot.play,
    expect: String(snapshot.expect),
    generatedAt: Number(snapshot.generatedAt || Date.now()),
    strategies: (snapshot.strategies || []).slice(0, 20).map((strategy, index) => ({
      rank: Number(strategy.rank || index + 1),
      id: strategy.id,
      label: strategy.label,
      mode: strategy.mode,
      modeLabel: strategy.modeLabel,
      desc: strategy.desc,
      sampleSize: strategy.sampleSize,
      hotCount: strategy.hotCount,
      coldCount: strategy.coldCount,
      score: strategy.score,
      result100: strategy.result100,
      result50: strategy.result50,
    })),
  }
}

function readTop20RealtimeSnapshot(play, expect) {
  if (typeof window === 'undefined' || !play || !expect) return null

  try {
    const key = getTop20RealtimeSnapshotKey(play, expect)
    const raw = window.localStorage.getItem(key)

    if (raw) {
      const parsed = JSON.parse(raw)
      if (
        parsed?.version === TOP20_REALTIME_SNAPSHOT_VERSION &&
        parsed?.play === play &&
        String(parsed?.expect) === String(expect) &&
        Array.isArray(parsed?.strategies)
      ) {
        return parsed
      }
    }

    for (const version of LEGACY_TOP20_SNAPSHOT_VERSIONS) {
      const legacyRaw = window.localStorage.getItem(
        getLegacyTop20RealtimeSnapshotKey(version, play, expect)
      )
      if (!legacyRaw) continue

      const legacyParsed = JSON.parse(legacyRaw)
      if (
        legacyParsed?.play !== play ||
        String(legacyParsed?.expect) !== String(expect) ||
        !Array.isArray(legacyParsed?.strategies)
      ) {
        continue
      }

      const migrated = compactTop20Snapshot(legacyParsed)
      safeSetLocalStorage(key, JSON.stringify(migrated), play)
      return migrated
    }
  } catch (error) {
    console.warn('读取20档位实时排名快照失败', error)
  }

  return null
}


function makeFrozenHitCell(draw, stored, play, strategyId) {
  if (!stored) {
    return {
      hit: false,
      hotHit: false,
      coldHit: false,
      unavailable: true,
      status: '无实时记录',
      shortStatus: '无记录',
    }
  }

  const resolved = finalizeStableBacktestOutcome(play, strategyId, draw, stored) || stored

  return {
    hit: Boolean(resolved.hit),
    hotHit: Boolean(resolved.hotHit),
    coldHit: Boolean(resolved.coldHit),
    unavailable: false,
    status: resolved.hotHit ? '热码命中' : resolved.coldHit ? '冷码命中' : resolved.hit ? '命中' : '未中',
    shortStatus: resolved.hotHit ? '热中' : resolved.coldHit ? '冷中' : resolved.hit ? '中' : '未中',
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

function buildStableStatsForStrategy(history, play, strategy, rangeSize = 100) {
  const rows = []

  if (!history?.length || !strategy) return summarizeStableRows(rows)

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const draw = history[index]
    const stored = ensureStableBacktestRow(history, index, strategy, play)
    if (!stored) continue

    const resolved = finalizeStableBacktestOutcome(play, strategy.id, draw, stored) || stored

    rows.push({
      expect: draw.expect,
      hit: Boolean(resolved.hit),
      hotHit: Boolean(resolved.hotHit),
      coldHit: Boolean(resolved.coldHit),
    })
  }

  return summarizeStableRows(rows)
}

function buildRealtimeStrategyRanking(history, play) {
  if (!history?.length || !play) return []

  return buildStrategyRanking(history)
    .slice(0, 20)
    .map((strategy) => {
      const result100 = buildStableStatsForStrategy(history, play, strategy, 100)
      const result50 = summarizeStableRows(result100.rows.slice(0, 50))
      const score = Number(((Number(result100.hitRate) || 0) * 0.7 + (Number(result50.hitRate) || 0) * 0.3).toFixed(2))

      return {
        ...strategy,
        result100,
        result50,
        score,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (b.result100.hitRate !== a.result100.hitRate) return b.result100.hitRate - a.result100.hitRate
      return b.result50.hitRate - a.result50.hitRate
    })
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


function getTop20StrategiesForDraw(history, drawIndex, currentPlay) {
  const draw = history?.[drawIndex]
  if (!draw) {
    return {
      strategies: [],
      hasRealtimeSnapshot: false,
    }
  }

  const beforeHistory = history.slice(drawIndex + 1)
  if (!beforeHistory.length) {
    return {
      strategies: [],
      hasRealtimeSnapshot: false,
    }
  }

  // 没有快照的旧历史，严格按照“该期开奖以前的数据”重新计算当时排名。
  // 因为输入数据固定，所以结果不会随着后续新增开奖而改变。
  const calculatedRanking = buildRealtimeStrategyRanking(beforeHistory, currentPlay).slice(0, 20)
  const snapshot = readTop20RealtimeSnapshot(currentPlay, draw.expect)

  if (!snapshot?.strategies?.length) {
    return {
      strategies: calculatedRanking,
      hasRealtimeSnapshot: false,
    }
  }

  // 有开奖前快照时，排名位置必须以快照为准。
  // 即使某个策略以后从第4名升到第2名，也不能改写过去已经开奖期号的列位置。
  const allCandidates = buildStrategyRanking(beforeHistory)
  const candidateMap = new Map(allCandidates.map((strategy) => [strategy.id, strategy]))

  const strategies = snapshot.strategies
    .slice(0, 20)
    .map((saved, index) => {
      const calculated = candidateMap.get(saved.id)

      return {
        ...(calculated || saved),
        ...saved,
        rank: Number(saved.rank || index + 1),
        id: saved.id,
        label: saved.label || calculated?.label || saved.id,
      }
    })
    .filter((strategy) => strategy?.id)

  return {
    strategies,
    hasRealtimeSnapshot: true,
  }
}

function decorateStrategyWithStableStats(history, currentPlay, strategy) {
  const result100 = buildStableStatsForStrategy(history, currentPlay, strategy, 100)
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
}

function buildTop20DrawStats(history, currentPlay, rangeSize = 30) {
  if (!history?.length || !currentPlay) return null

  const latest = history[0]
  const latestSpecial = latest?.numbers?.[latest.numbers.length - 1]
  const latestRankingData = getTop20StrategiesForDraw(history, 0, currentPlay)

  if (!latestRankingData.strategies.length) return null

  const latestStrategies = latestRankingData.strategies.map((strategy) =>
    decorateStrategyWithStableStats(history, currentPlay, strategy)
  )

  const latestStats = latestStrategies.map((strategy, index) => {
    const stored = ensureStableBacktestRow(history, 0, strategy, currentPlay)
    const cell = makeFrozenHitCell(latest, stored, currentPlay, strategy.id)
    const result30 = summarizeStableRows(strategy.result100.rows.slice(0, 30))

    return {
      rank: index + 1,
      strategy: {
        ...strategy,
        result30,
      },
      label: getShortStrategyLabel(strategy),
      expect: latest.expect,
      openTime: latest.openTime,
      specialNumber: latestSpecial,
      ...cell,
    }
  })

  const hitRanks = latestStats.filter((item) => item.hit)

  const recentRows = history.slice(0, rangeSize).map((draw, drawIndex) => {
    const specialNumber = draw?.numbers?.[draw.numbers.length - 1]
    const rowRankingData = getTop20StrategiesForDraw(history, drawIndex, currentPlay)

    const cells = rowRankingData.strategies.slice(0, 20).map((strategy, index) => {
      const stored = ensureStableBacktestRow(history, drawIndex, strategy, currentPlay)
      const cell = makeFrozenHitCell(draw, stored, currentPlay, strategy.id)

      return {
        rank: index + 1,
        strategyId: strategy.id,
        strategyLabel: strategy.label,
        usedStrategyId: strategy.id,
        usedStrategyLabel: strategy.label,
        hasRealtimeSnapshot: rowRankingData.hasRealtimeSnapshot,
        ...cell,
        status: cell.shortStatus,
      }
    })

    return {
      expect: draw.expect,
      openTime: draw.openTime,
      specialNumber,
      hasRealtimeSnapshot: rowRankingData.hasRealtimeSnapshot,
      cells,
    }
  })

  return {
    latest,
    latestSpecial,
    latestStats,
    hitRanks,
    recentRows,
    hasRealtimeRecord: latestStats.every((item) => !item.unavailable),
    hasRealtimeSnapshot: latestRankingData.hasRealtimeSnapshot,
  }
}

function formatNumber(num) {
  return String(num || '').padStart(2, '0')
}


function getHeadNumber(num) {
  const n = Number(num)

  if (!Number.isInteger(n) || n < 1 || n > 49) return ''

  if (n <= 9) return 0
  if (n <= 19) return 1
  if (n <= 29) return 2
  if (n <= 39) return 3
  return 4
}

function makeEmptyHeadCounts() {
  return {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  }
}

function buildSpecialHeadRanking(beforeHistory, sampleSize = 30) {
  const source = beforeHistory.slice(0, sampleSize)
  const counts = makeEmptyHeadCounts()

  source.forEach((item) => {
    const numbers = item.numbers || []
    const specialNumber = numbers[numbers.length - 1]
    const head = getHeadNumber(specialNumber)

    if (head !== '') {
      counts[head] += 1
    }
  })

  const ranking = Object.entries(counts).map(([head, count]) => ({
    head: Number(head),
    count,
  }))

  const hotRanking = [...ranking].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.head - b.head
  })

  const coldRanking = [...ranking].sort((a, b) => {
    if (a.count !== b.count) return a.count - b.count
    return a.head - b.head
  })

  return {
    counts,
    ranking,
    hotRanking,
    coldRanking,
  }
}

function buildHeadRecommend(beforeHistory, sampleSize = 30, hotHeadCount = 3, coldHeadCount = 1) {
  const rankingData = buildSpecialHeadRanking(beforeHistory, sampleSize)

  const hotHeads = rankingData.hotRanking
    .slice(0, hotHeadCount)
    .map((item) => ({
      ...item,
      type: 'hot',
    }))

  const hotSet = new Set(hotHeads.map((item) => item.head))

  const coldHeads = rankingData.coldRanking
    .filter((item) => !hotSet.has(item.head))
    .slice(0, coldHeadCount)
    .map((item) => ({
      ...item,
      type: 'cold',
    }))

  const recommendHeads = [...hotHeads, ...coldHeads].sort(
    (a, b) => a.head - b.head
  )

  return {
    counts: rankingData.counts,
    hotHeads,
    coldHeads,
    recommendHeads,
  }
}

function getOmissionRanking(beforeHistory) {
  const omissionMap = new Map()

  for (let head = 0; head <= 4; head++) {
    omissionMap.set(head, {
      head,
      omit: beforeHistory.length,
      count: 0,
      type: 'cold',
    })
  }

  beforeHistory.forEach((item, index) => {
    const numbers = item.numbers || []
    const specialNumber = numbers[numbers.length - 1]
    const head = getHeadNumber(specialNumber)

    if (head === '') return

    const old = omissionMap.get(head)

    omissionMap.set(head, {
      ...old,
      count: old.count + 1,
      omit: old.omit === beforeHistory.length ? index : old.omit,
    })
  })

  return Array.from(omissionMap.values()).sort((a, b) => {
    if (b.omit !== a.omit) return b.omit - a.omit
    return a.count - b.count
  })
}

function uniqueHeadItems(items) {
  const map = new Map()

  items.forEach((item) => {
    if (!item || item.head === undefined || item.head === '') return

    if (!map.has(item.head)) {
      map.set(item.head, item)
    }
  })

  return Array.from(map.values()).sort((a, b) => a.head - b.head)
}

function buildHeadRecommendByConfig(beforeHistory, config) {
  if (config.kind === 'hotCold') {
    return buildHeadRecommend(
      beforeHistory,
      config.sampleSize,
      config.hotHeadCount,
      config.coldHeadCount
    )
  }

  if (config.kind === 'hotHotMix') {
    const rank30 = buildSpecialHeadRanking(beforeHistory, 30)
    const rank50 = buildSpecialHeadRanking(beforeHistory, 50)

    const hot30 = rank30.hotRanking.slice(0, 2).map((item) => ({
      ...item,
      type: 'hot',
      source: '30期热',
    }))

    const hot50 = rank50.hotRanking.slice(0, 2).map((item) => ({
      ...item,
      type: 'hot',
      source: '50期热',
    }))

    const hotHeads = uniqueHeadItems([...hot30, ...hot50])

    return {
      counts: rank30.counts,
      hotHeads,
      coldHeads: [],
      recommendHeads: hotHeads,
    }
  }

  if (config.kind === 'hotColdMix') {
    const rank30 = buildSpecialHeadRanking(beforeHistory, 30)
    const rank50 = buildSpecialHeadRanking(beforeHistory, 50)

    const hot30 = rank30.hotRanking.slice(0, 2).map((item) => ({
      ...item,
      type: 'hot',
      source: '30期热',
    }))

    const hotSet = new Set(hot30.map((item) => item.head))

    const cold50 = rank50.coldRanking
      .filter((item) => !hotSet.has(item.head))
      .slice(0, 2)
      .map((item) => ({
        ...item,
        type: 'cold',
        source: '50期冷',
      }))

    const hotHeads = uniqueHeadItems(hot30)
    const coldHeads = uniqueHeadItems(cold50)

    return {
      counts: rank30.counts,
      hotHeads,
      coldHeads,
      recommendHeads: uniqueHeadItems([...hotHeads, ...coldHeads]),
    }
  }

  if (config.kind === 'hotOmit') {
    const rank30 = buildSpecialHeadRanking(beforeHistory, 30)

    const hotHeads = rank30.hotRanking.slice(0, 2).map((item) => ({
      ...item,
      type: 'hot',
      source: '30期热',
    }))

    const hotSet = new Set(hotHeads.map((item) => item.head))

    const omissionHeads = getOmissionRanking(beforeHistory)
      .filter((item) => !hotSet.has(item.head))
      .slice(0, config.omitHeadCount)
      .map((item) => ({
        head: item.head,
        count: item.omit,
        omit: item.omit,
        type: 'cold',
        source: '最大遗漏',
      }))

    const coldHeads = uniqueHeadItems(omissionHeads)

    return {
      counts: rank30.counts,
      hotHeads,
      coldHeads,
      recommendHeads: uniqueHeadItems([...hotHeads, ...coldHeads]),
    }
  }

  return buildHeadRecommend(beforeHistory, 30, 3, 1)
}

function testHeadStrategy(history, config, rangeSize) {
  const rows = []

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const target = history[index]
    const beforeHistory = history.slice(index + 1)

    if (beforeHistory.length < (config.minSampleSize || config.sampleSize || 30)) continue

    const analysis = buildHeadRecommendByConfig(beforeHistory, config)
    const specialNumber = target.numbers[target.numbers.length - 1]
    const specialHead = getHeadNumber(specialNumber)
    const recommendSet = new Set(analysis.recommendHeads.map((item) => item.head))
    const hit = recommendSet.has(specialHead)

    rows.push({
      expect: target.expect,
      openTime: target.openTime,
      specialNumber,
      specialHead,
      hit,
      ...analysis,
    })
  }

  const testedCount = rows.length
  const hitCount = rows.filter((item) => item.hit).length
  const hitRate = testedCount ? Number(((hitCount / testedCount) * 100).toFixed(2)) : 0

  return {
    testedCount,
    hitCount,
    hitRate,
    rows,
  }
}

function getHeadConfigs() {
  return [
    {
      id: 'head-30-3hot-1cold',
      title: '1. 30期｜3热 + 1冷',
      kind: 'hotCold',
      sampleSize: 30,
      minSampleSize: 30,
      hotHeadCount: 3,
      coldHeadCount: 1,
    },
    {
      id: 'head-30-2hot-2cold',
      title: '2. 30期｜2热 + 2冷',
      kind: 'hotCold',
      sampleSize: 30,
      minSampleSize: 30,
      hotHeadCount: 2,
      coldHeadCount: 2,
    },
    {
      id: 'head-30-2hot-1cold',
      title: '3. 30期｜2热 + 1冷',
      kind: 'hotCold',
      sampleSize: 30,
      minSampleSize: 30,
      hotHeadCount: 2,
      coldHeadCount: 1,
    },
    {
      id: 'head-50-3hot-1cold',
      title: '4. 50期｜3热 + 1冷',
      kind: 'hotCold',
      sampleSize: 50,
      minSampleSize: 50,
      hotHeadCount: 3,
      coldHeadCount: 1,
    },
    {
      id: 'head-50-2hot-2cold',
      title: '5. 50期｜2热 + 2冷',
      kind: 'hotCold',
      sampleSize: 50,
      minSampleSize: 50,
      hotHeadCount: 2,
      coldHeadCount: 2,
    },
    {
      id: 'head-50-2hot-1cold',
      title: '6. 50期｜2热 + 1冷',
      kind: 'hotCold',
      sampleSize: 50,
      minSampleSize: 50,
      hotHeadCount: 2,
      coldHeadCount: 1,
    },
    {
      id: 'head-30hot2-50hot2',
      title: '7. 30期热2头 + 50期热2头',
      kind: 'hotHotMix',
      minSampleSize: 50,
    },
    {
      id: 'head-30hot2-50cold2',
      title: '8. 30期热2头 + 50期冷2头',
      kind: 'hotColdMix',
      minSampleSize: 50,
    },
    {
      id: 'head-hot2-omit1',
      title: '9. 热2头 + 最大遗漏1头',
      kind: 'hotOmit',
      minSampleSize: 30,
      omitHeadCount: 1,
    },
    {
      id: 'head-hot2-omit2',
      title: '10. 热2头 + 最大遗漏2头',
      kind: 'hotOmit',
      minSampleSize: 30,
      omitHeadCount: 2,
    },
  ]
}

function buildHeadStats(history) {
  if (!history?.length) return []

  return getHeadConfigs().map((config) => {
    const nextRecommend = buildHeadRecommendByConfig(history, config)
    const result100 = testHeadStrategy(history, config, 100)
    const result50 = testHeadStrategy(history, config, 50)
    const result30 = testHeadStrategy(history, config, 30)

    return {
      ...config,
      nextRecommend,
      result100,
      result50,
      result30,
    }
  })
}

function buildHeadRecentRows(history, rangeSize = 20) {
  if (!history?.length) return []

  const configs = getHeadConfigs()

  return history.slice(0, rangeSize).map((draw) => {
    const numbers = draw.numbers || []
    const specialNumber = numbers[numbers.length - 1]
    const specialHead = getHeadNumber(specialNumber)
    const targetIndex = history.findIndex(
      (item) => String(item.expect) === String(draw.expect)
    )
    const beforeHistory = targetIndex >= 0 ? history.slice(targetIndex + 1) : []

    const cells = configs.map((config) => {
      if (beforeHistory.length < (config.minSampleSize || config.sampleSize || 30)) {
        return {
          id: config.id,
          title: config.title,
          hit: false,
          status: '数据不足',
          recommendHeads: [],
        }
      }

      const analysis = buildHeadRecommendByConfig(beforeHistory, config)
      const recommendHeads = analysis.recommendHeads || []
      const recommendSet = new Set(recommendHeads.map((item) => item.head))
      const hit = recommendSet.has(specialHead)

      return {
        id: config.id,
        title: config.title,
        hit,
        status: hit ? '中' : '未中',
        recommendHeads,
      }
    })

    return {
      expect: draw.expect,
      openTime: draw.openTime,
      specialNumber,
      specialHead,
      cells,
    }
  })
}


function buildHeadAggregateTop4(history) {
  if (!history?.length) return null

  const configs = getHeadConfigs()
  const headMap = new Map()

  for (let head = 0; head <= 4; head++) {
    headMap.set(head, {
      head,
      count: 0,
      scoreTotal: 0,
      sourceTitles: [],
    })
  }

  configs.forEach((config) => {
    if (history.length < (config.minSampleSize || config.sampleSize || 30)) return

    const analysis = buildHeadRecommendByConfig(history, config)

    ;(analysis.recommendHeads || []).forEach((item) => {
      const old = headMap.get(item.head) || {
        head: item.head,
        count: 0,
        scoreTotal: 0,
        sourceTitles: [],
      }

      headMap.set(item.head, {
        ...old,
        count: old.count + 1,
        scoreTotal: old.scoreTotal + Number(item.count || 0),
        sourceTitles: [...old.sourceTitles, config.title],
      })
    })
  })

  const ranking = Array.from(headMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    if (b.scoreTotal !== a.scoreTotal) return b.scoreTotal - a.scoreTotal
    return a.head - b.head
  })

  return {
    ranking,
    recommendHeads: ranking.slice(0, 4),
    sourceCount: configs.length,
  }
}

function testHeadAggregateTop4(history, rangeSize) {
  const rows = []

  for (let index = 0; index < history.length && rows.length < rangeSize; index++) {
    const target = history[index]
    const beforeHistory = history.slice(index + 1)

    if (beforeHistory.length < 50) continue

    const analysis = buildHeadAggregateTop4(beforeHistory)
    const specialNumber = target.numbers[target.numbers.length - 1]
    const specialHead = getHeadNumber(specialNumber)
    const recommendSet = new Set((analysis?.recommendHeads || []).map((item) => item.head))
    const hit = recommendSet.has(specialHead)

    rows.push({
      expect: target.expect,
      openTime: target.openTime,
      specialNumber,
      specialHead,
      hit,
      recommendHeads: analysis?.recommendHeads || [],
    })
  }

  const testedCount = rows.length
  const hitCount = rows.filter((item) => item.hit).length
  const hitRate = testedCount ? Number(((hitCount / testedCount) * 100).toFixed(2)) : 0

  return {
    testedCount,
    hitCount,
    hitRate,
    rows,
  }
}

function buildHeadAggregateStats(history) {
  if (!history?.length) return null

  return {
    nextRecommend: buildHeadAggregateTop4(history),
    result50: testHeadAggregateTop4(history, 50),
    result30: testHeadAggregateTop4(history, 30),
  }
}

function formatHeadOnlyList(list) {
  return (list || [])
    .map((item) => `${item.head}头`)
    .join('、')
}

function formatHeadCopyText(list) {
  return (list || [])
    .map((item) => `${item.head}头`)
    .join(' ')
}


function formatHeadList(list) {
  return (list || [])
    .map((item) => `${item.head}头(${item.count})`)
    .join('、')
}

export default function Top20StatsPage() {
  const [currentPlay, setCurrentPlay] = React.useState(() => {
    if (typeof window === 'undefined') return 'macau'
    const params = new URLSearchParams(window.location.search)
    return params.get('play') === 'hongkong' ? 'hongkong' : 'macau'
  })
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
        console.log(`${playConfig.name}接口原始返回内容：`, text)
        const preview = String(text || '').slice(0, 200)
        throw new Error(`${playConfig.name}接口返回不是JSON，请检查 /api/history?play=${currentPlay}。返回内容前200字：${preview}`)
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

  const changePlay = (play) => {
    if (!PLAY_CONFIG[play]) return
    setCurrentPlay(play)

    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/top20?play=${play}`)
    }
  }

  React.useEffect(() => {
    cleanupStableStorage(currentPlay)
  }, [currentPlay])

  React.useEffect(() => {
    loadData()
  }, [loadData])


  const top20DrawStats = React.useMemo(() => {
    if (!history.length) return null
    return buildTop20DrawStats(history, currentPlay, 30)
  }, [history, currentPlay])

  const headStats = React.useMemo(() => {
    if (!history.length) return []
    return buildHeadStats(history)
  }, [history])

  const headRecentRows = React.useMemo(() => {
    if (!history.length) return []
    return buildHeadRecentRows(history, 20)
  }, [history])

  const headAggregateStats = React.useMemo(() => {
    if (!history.length) return null
    return buildHeadAggregateStats(history)
  }, [history])

  const latest = history[0]

  async function copyAggregateHeads() {
    const text = formatHeadCopyText(headAggregateStats?.nextRecommend?.recommendHeads || [])

    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      alert(`已复制预测头数：${text}`)
    } catch (error) {
      alert(`复制失败，请手动复制：${text}`)
    }
  }

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

        .head-recent-table {
          min-width: 1280px;
        }

        .head-recent-table .head-hit-cell {
          background: rgba(250, 204, 21, 0.18);
          color: #facc15;
          font-weight: 900;
        }

        .head-recent-table .head-miss-cell {
          color: #94a3b8;
          font-weight: 800;
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
            独立页面：统计策略排行榜前20个档位，每个档位筛选36码后，是否命中当期特码；并展示近30期中奖 / 不中奖明细。
          </p>

          <div className="switch-row">
            <button className="btn secondary" onClick={() => window.history.back()}>
              返回上一页
            </button>
            <button
              className={`btn secondary ${currentPlay === 'macau' ? 'active' : ''}`}
              onClick={() => changePlay('macau')}
            >
              澳门玩法
            </button>
            <button
              className={`btn secondary ${currentPlay === 'hongkong' ? 'active' : ''}`}
              onClick={() => changePlay('hongkong')}
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
              当期特码：{formatNumber(top20DrawStats.latestSpecial)}。
              下面读取首页在当期开奖前已经保存的前20名档位。所有100期、50期和30期数据均来自同一份实时冻结记录。
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
                <span>当期特码</span>
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
                <div className="no-hit-chip">
                  {top20DrawStats.hasRealtimeRecord ? '当期前20名档位暂无命中' : '当期没有开奖前保存的实时记录'}
                </div>
              )}
            </div>

            {!top20DrawStats.hasRealtimeRecord && (
              <div className="error" style={{ margin: '16px 0 0' }}>
                旧历史会严格使用该期以前的数据即时计算；从下一期开奖开始继续使用开奖前保存的真实号码和排名快照。
              </div>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>排名</th>
                    <th>档位策略</th>
                    <th>当期特码</th>
                    <th>是否命中</th>
                    <th>100期命中</th>
                    <th>50期命中</th>
                    <th>100期盈亏</th>
                    <th>50期盈亏</th>
                    <th>30期盈亏</th>
                  </tr>
                </thead>
                <tbody>
                  {top20DrawStats.latestStats.map((item) => {
                    const profit100 = calculateProfit(
                      item.strategy.result100?.hitCount || 0,
                      item.strategy.result100?.testedCount || 0,
                      totalBetPerIssue,
                      odds
                    )

                    const profit50 = calculateProfit(
                      item.strategy.result50?.hitCount || 0,
                      item.strategy.result50?.testedCount || 0,
                      totalBetPerIssue,
                      odds
                    )

                    const profit30 = calculateProfit(
                      item.strategy.result30?.hitCount || 0,
                      item.strategy.result30?.testedCount || 0,
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
                        <td style={{ color: profit100.profit >= 0 ? '#22c55e' : '#f87171', fontWeight: 900 }}>
                          {formatMoney(profit100.profit)}
                        </td>
                        <td style={{ color: profit50.profit >= 0 ? '#22c55e' : '#f87171', fontWeight: 900 }}>
                          {formatMoney(profit50.profit)}
                        </td>
                        <td style={{ color: profit30.profit >= 0 ? '#22c55e' : '#f87171', fontWeight: 900 }}>
                          {formatMoney(profit30.profit)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="card-title">30期 / 50期最后特码头数预测统计</div>

            <p className="desc">
              头数规则：01-09 = 0头，10-19 = 1头，20-29 = 2头，30-39 = 3头，40-49 = 4头。
              这里只统计每期开奖最后一个特码的头数，不统计前6个正码。系统会显示本期最后特码头数，并用10组方案预测下一期可能出现的头数，同时综合10个方案取出现最多的4个头数。
            </p>

            <div className="summary-grid">
              {headStats.map((item) => (
                <div key={`next-head-${item.id}`} className="stat">
                  <span>{item.title}｜预测下一期头数</span>
                  <strong>
                    {item.nextRecommend.recommendHeads.map((headItem) => `${headItem.head}头`).join('、')}
                  </strong>
                </div>
              ))}
            </div>


            {headAggregateStats && (
              <div className="aggregate-box">
                <div className="card-title">10个头数档位综合｜出现最多的4个头数</div>

                <p className="desc">
                  计算方式：先抓取上面10个头数方案各自预测的头数，再统计0头到4头在10个方案里出现的次数，取出现最多的4个头数作为下一期综合预测。
                </p>

                <div className="aggregate-head-row">
                  {(headAggregateStats.nextRecommend?.recommendHeads || []).map((item) => (
                    <span key={`aggregate-head-${item.head}`} className="aggregate-head-chip">
                      {item.head}头｜出现{item.count}次
                    </span>
                  ))}
                </div>

                <button className="copy-btn" onClick={copyAggregateHeads}>
                  复制综合预测头数
                </button>

                <div className="summary-grid">
                  <div className="stat">
                    <span>综合预测下一期头数</span>
                    <strong>{formatHeadOnlyList(headAggregateStats.nextRecommend?.recommendHeads || [])}</strong>
                  </div>

                  <div className="stat">
                    <span>近50期综合命中</span>
                    <strong>
                      {headAggregateStats.result50.hitCount} / {headAggregateStats.result50.testedCount} = {headAggregateStats.result50.hitRate}%
                    </strong>
                  </div>

                  <div className="stat">
                    <span>近30期综合命中</span>
                    <strong>
                      {headAggregateStats.result30.hitCount} / {headAggregateStats.result30.testedCount} = {headAggregateStats.result30.hitRate}%
                    </strong>
                  </div>

                  <div className="stat">
                    <span>统计来源</span>
                    <strong>10个头数方案</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>方案</th>
                    <th>热头数</th>
                    <th>冷头数</th>
                    <th>推荐头数</th>
                    <th>近100期命中</th>
                    <th>近50期命中</th>
                    <th>近30期命中</th>
                  </tr>
                </thead>

                <tbody>
                  {headStats.map((item) => (
                    <tr key={`head-row-${item.id}`}>
                      <td>{item.title}</td>
                      <td>{formatHeadList(item.nextRecommend.hotHeads)}</td>
                      <td>{formatHeadList(item.nextRecommend.coldHeads)}</td>
                      <td>{item.nextRecommend.recommendHeads.map((headItem) => `${headItem.head}头`).join('、')}</td>
                      <td>
                        {item.result100.hitCount} / {item.result100.testedCount} = {item.result100.hitRate}%
                      </td>
                      <td>
                        {item.result50.hitCount} / {item.result50.testedCount} = {item.result50.hitRate}%
                      </td>
                      <td>
                        {item.result30.hitCount} / {item.result30.testedCount} = {item.result30.hitRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="card-title">近20期头数方案中奖 / 不中奖列表</div>

            <p className="desc">
              每一行是一期开奖结果，只看当期最后特码头数；每一列是上面10个头数方案。
              中 = 该方案预测头数包含当期最后特码头数；未中 = 没有包含。
            </p>

            <div className="table-wrap">
              <table className="head-recent-table">
                <thead>
                  <tr>
                    <th>日期 / 期数</th>
                    <th>最后特码</th>
                    <th>特码头数</th>
                    {headStats.map((item) => (
                      <th key={`head-recent-head-${item.id}`}>{item.title}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {headRecentRows.map((row) => (
                    <tr key={`head-recent-row-${row.expect}`}>
                      <td>{row.openTime} 第{row.expect}期</td>
                      <td>{formatNumber(row.specialNumber)}</td>
                      <td>{row.specialHead}头</td>

                      {row.cells.map((cell) => (
                        <td
                          key={`head-recent-cell-${row.expect}-${cell.id}`}
                          className={cell.hit ? 'head-hit-cell' : 'head-miss-cell'}
                          title={`推荐：${cell.recommendHeads.map((headItem) => `${headItem.head}头`).join('、')}`}
                        >
                          {cell.status}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card">
            <div className="card-title">近30期前20名档位中奖 / 不中奖列表【V19完整冻结修复版】</div>
            <p className="desc">
              【V19完整冻结修复版】旧历史严格按照当期以前的数据即时计算；开奖前真实记录只保存必要快照，避免浏览器缓存写满。每一期前20名的排名位置分别固定，后续名次变化不会改写过去的列位置。首页100期、50期数据与本页20档位统计使用相同公式。
            </p>

            <div className="table-wrap">
              <table className="recent-table">
                <thead>
                  <tr>
                    <th>日期 / 期数</th>
                    <th>特码</th>
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
                          title={`首页策略：${cell.strategyLabel || cell.strategy?.label || ''}；当期计算策略：${cell.usedStrategyLabel || cell.strategyLabel || cell.strategy?.label || ''}`}
                        >
                          {cell.status}
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
