ChatGPT









7456dd61-05ef-414a-8b52-c3b40e62a4cf.png
467fedab-9d89-4fcc-b322-33c1b8173382.png

粘贴的文本 (1)(48).txt
文档
帮我修改一下代码，就是在前端里的显示，筛选36个号码，然后添加多一个玩法，就是在红框里是澳门，在绿色框里是香港，但是玩法跟策略都要设置一样的，点击红框就是会进入跳转到澳门玩法，点击绿色框的部位是跳转到香港玩法，有个问题香港的开奖不是每天都有，待会我会给你个网站你去上面抓取香港的开奖网，跟开奖日期 期号这些
香港开奖网链接：https://bet.hkjc.com/ch/marksix/results


为什么会显示失败呢

显示这种

是在这里面修改吗


粘贴的文本 (1)(49).txt
文档
但是我刚才把你给我的代码添加到里面了

为什么没有香港的数据啊 是不是网址有问题啊

f908d130-e570-4871-88a3-7b71ad315619.png
fc19d606-dd9c-4dc8-8df9-e4c6d25ea162.png
你给我的香港不对吧，把刚才你找的网址全部删除了，因为我见有些网站它不是真正的香港六合彩开奖网，怎么会有4个26号呢，我重新给你网址。只需要从里面抓取香港六合彩的开奖记录即可

网址：https://6hch.com/html/kaihistory.html

b1a3d771-6f86-4cc2-8b81-17339319bffd.png
77227580-b372-4cfd-8d69-9d5829176354.png
为什么会这样呢，看它是已经修改成功了的

有没有开放开源呢

那你帮我去读取看看它有没有开放接口


0931b0ec-6599-4043-a684-9b9ace63acd0.png
e5ebdde3-7446-4496-a5e3-d135b0f6b0dc.png
回测这块能不能说前端显示像它里面这种，日期 期号 生肖  大小 单双 都显示呢，这个比较方便点，香港  澳门都修改

香港还是没有接口

打开是这样的

0eebd0bc-6ccb-49c7-8339-5b8ea25516e4.png
40ec5187-ffaa-4a91-b2f1-2a167d57f63f.png
现在网址都进不去了 什么情况 澳门跟香港都弄不了了


粘贴的文本 (1)(50).txt
文档
app/page.js  你看看里面的脚本是否正确

0fa010b9-34c8-462a-b8e6-c88a670a1cb4.png
14977166-65b0-4d8c-bd34-c6ba4f4168ac.png
还是不行 你是不是没发正式版的代码啊

打开你给我的网址显示这个

什么情况  我不是给你提供了开放的开源了吗

还是不行

34ad1069-3302-48cc-8f11-9b9e8090af39.png
b675cadf-8f74-4fb0-9b5b-90e29aa3b1ca.png
回测这块能不能说前端显示像它里面这种，日期 期号 生肖  大小 单双 都显示呢，这个比较方便点，香港  澳门都修改

d2a6df32-5a0c-4155-abea-52c37bbb3320.png
72e5e76d-1970-446e-b64a-9f4ba49735fd.png
为什么是这样的页面 看得头晕像它这种页面不得吗

可以帮我在添加一个数据吗，就是在这二十个档位里每期筛选出的36个号，就是20个档位里筛选出36*20个号码，然后在里面抓取前36个号码出现率最多的号码，

这个里面都是一个网站的代码吗

点击哪里创建呢

点击哪里呢

然后呢

已经有了啊

是在这里创建码

为什么会出现这种情况

这样没有选择错吧

为什么说网站没有设置啊

46edc9d2-cd69-4ec0-a2fd-e48f96601638.png
a8bb78ea-06e6-4983-81d3-30e8059948bf.png
打开是404，但是是这样的不知道是不是文件没移下去的原因

什么情况 为什么会这样啊

25ea6728-67a8-401b-b543-6bb1db9e04a5.png
e7a2964f-99c4-4b8f-9a66-8d3223a2eb6a.png
帮我在加一个功能就是在图一的红框里加一个20个档次的当天开奖统计，就是当天开奖，第一名 第二名 第三名 第四名 中奖后在红框统计里下面开个列表记录当天的开奖情况，然后再下面列一个30期的开奖中奖与不中奖列表，要全部的二十名的档位

我是叫你开单独的页面显示不是挂在同一个页面上的

eb51afde-e9d4-49f7-89a4-0310ee78758d.png
96b6b217-446d-4407-bdea-98dc68a03e57.png
为什么我点击后跳转会显示404啊

已思考 11s
给你，完整文件在这里：

下载 app/top20/page.js 完整代码

你在 GitHub 里这样建：

打开你的项目

点进：

app
点：

Add file
点：

Create new file
文件名这里填写：

top20/page.js
注意：你已经在 app 里面了，所以这里不要写 app/top20/page.js，只写：

top20/page.js
把下载文件里的代码全部复制进去

点：

Commit changes
提交后等 Vercel 自动部署，访问：

https://你的网站域名/top20
首页按钮就不会再 404 了。


你直接现写 下载链接点击进去是打不开的

已思考 11s
可以，我直接把 app/top20/page.js 完整代码写在下面。你直接复制整段代码。

操作位置：

app/top20/page.js
如果没有 top20 文件夹，就在 app 里面新建文件时，文件名填写：

top20/page.js
然后粘贴下面完整代码：

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
粘贴完提交后，等 Vercel 自动部署完成，再打开：

https://你的网站域名/top20

6f001be6-6539-418c-b91e-9ff0392f1546.png
我这个页面对了吗

已思考 10s
对，这个页面基本是正确的。

你现在的位置是：

marksix-ai / app /
里面已经有：

top20
并且左边能看到：

top20
  └── page.js
这就说明独立页面已经建对了，正确路径就是：

app/top20/page.js
现在下一步：

确认右上角或页面上有没有还没提交的提示。
你截图上方显示：

Create page.js
旁边有一个小黄点，可能表示刚提交不久或页面还没刷新完成。

等 GitHub 提交成功后，Vercel 会自动部署。

部署完成后打开：

https://你的网站域名/top20
比如你的正式站就是：

https://marksix-ai.vercel.app/top20
如果打开还是 404，通常是 Vercel 还没部署完成，等 1-2 分钟后按：

Ctrl + F5
强制刷新。

你这个目录结构现在是对的。


f7ea39e4-9ee4-4519-9040-6847b5ac2571.png
加个50期跟三十期的盈亏金额

已思考 15s
可以，这个只需要改独立页面：

app/top20/page.js
我已经帮你做好完整版本了，表格右边会新增：

50期盈亏
30期盈亏
现在表格会显示：

100期盈亏
50期盈亏
30期盈亏
下载完整文件：

下载 app/top20/page.js（新增50期和30期盈亏）

压缩包：

下载压缩包

你直接替换：

app/top20/page.js
替换后提交，等 Vercel 部署完成，再刷新：

/top20
这次不用动首页 app/page.js，也不用动后端 app/api/history/route.js。 


e2677c2c-e582-4f1a-b4e7-fda0fec2e879.png
这个没有返回上一页按钮，还有在这个页面加一个数据，就是抓取30期 50期的开奖号码头数，1  2  3  4 0 头数，抓取4个头数预测下期开奖号码，跟抓取预测63码一个道理，头数只抓取前三个头数出现最多的与冷头数，还有两个热头两个冷头数，然后看它的中奖率

已思考 19s
可以，这次只改独立页面：

app/top20/page.js
我已经加好了两个功能：

第一，顶部增加明显的返回按钮：

← 返回主筛选页面
点击返回首页。

第二，新增“30期 / 50期开奖号码头数预测统计”：

头数规则：

01-09 = 0头
10-19 = 1头
20-29 = 2头
30-39 = 3头
40-49 = 4头
新增 4 组头数方案：

30期头数｜3热 + 1冷
30期头数｜2热 + 2冷
50期头数｜3热 + 1冷
50期头数｜2热 + 2冷
每组都会显示：

热头数
冷头数
推荐头数
近100期命中率
近50期命中率
近30期命中率
下载完整文件：

下载 app/top20/page.js（返回按钮 + 头数统计版）

压缩包：

下载压缩包

替换位置：

app/top20/page.js
这次不用改首页，也不用改后端。替换提交后，等 Vercel 部署完成，刷新 /top20 页面就可以看到。 


3e82d90b-ce7a-45e4-bdd0-0eb65aaf5483.png
不对吧 头数，我只需要抓取它的最后一个开奖号码的头数，还有加预测下期的头数，你没做呀 你只是做了一个统计

已思考 16s
对，你说得对，我上一版做错了：我统计了每期 7 个开奖号码的头数，但你要的是只抓每期最后一个特码的头数。

我已经改好了，这版逻辑是：

只统计每期开奖最后一个号码，也就是特码的头数。

头数规则：

01-09 = 0头
10-19 = 1头
20-29 = 2头
30-39 = 3头
40-49 = 4头
现在新增的头数预测会这样算：

最近30期最后特码头数
最近50期最后特码头数
然后预测下一期最后特码可能落在哪些头数里。

保留 4 组方案：

30期头数｜3热 + 1冷
30期头数｜2热 + 2冷
50期头数｜3热 + 1冷
50期头数｜2热 + 2冷
每组都会显示：

预测下一期头数
热头数
冷头数
近100期命中率
近50期命中率
近30期命中率
下载完整文件：

下载 app/top20/page.js（只统计最后特码头数版）

压缩包：

下载压缩包

替换位置：

app/top20/page.js
这次不用改首页，也不用改后端。替换提交后，等 Vercel 部署完成，刷新 /top20。 


那你能帮我想多几个头数的方案给我参考吗

已思考 7s
可以，头数方案可以多做几组，但我建议不要一次乱加太多，先加“有意义、容易回测验证”的方案。你现在的逻辑是只看最后一个特码的头数，这个方向是对的。

我建议你可以参考这几类：

方案一：纯热头方案
只抓最近 30 / 50 期最后特码头数里出现最多的头。

30期｜1热头
30期｜2热头
30期｜3热头
50期｜1热头
50期｜2热头
50期｜3热头
用途：看短期热头是否延续。

比如最近 30 期里 1头、4头、2头出现最多，那就预测下一期重点在这几个头。

方案二：热冷混合方案
这个是你现在比较适合继续测试的。

30期｜3热 + 1冷
30期｜2热 + 2冷
30期｜2热 + 1冷
50期｜3热 + 1冷
50期｜2热 + 2冷
50期｜2热 + 1冷
用途：避免全部追热，因为特码经常有冷头突然补出。

我个人觉得最值得先保留的是：

30期｜2热 + 2冷
50期｜2热 + 2冷
30期｜3热 + 1冷
50期｜3热 + 1冷
方案三：短期 + 中期综合头数
这个更稳一点，不只看 30 期或 50 期，而是把两个周期合在一起。

30期热头 + 50期热头，去重后取前3头
30期热头 + 50期冷头，组合成4个头
30期冷头 + 50期热头，组合成4个头
30期2热 + 50期2热，去重后预测
30期2冷 + 50期2冷，去重后预测
用途：看短期和中期有没有共振。

比如：

30期热头：1头、4头
50期热头：4头、2头
那 4头就是共振热头，权重更高。

方案四：遗漏头数方案
这个很有价值。不是看出现次数，而是看哪个头数多久没开最后特码。

最大遗漏1头
最大遗漏2头
最大遗漏3头
热2头 + 最大遗漏1头
热2头 + 最大遗漏2头
用途：防止一直追热，补充长期没出的头。

比如 0头已经 12 期没出，4头已经 8 期没出，那它们就是冷遗漏头。

方案五：近期连续趋势方案
看最近 5 / 10 / 15 期最后特码头数走势。

最近10期最多头数
最近15期最多头数
最近10期未出现头数
最近15期未出现头数
最近10期热2头 + 最近30期冷2头
用途：抓短线波动。

这个适合当辅助，不建议单独做主策略，因为波动太大。

我建议你先加这 10 个方案
不要一口气加 30 个，页面会乱。先加这 10 个最实用：

1. 30期｜3热 + 1冷
2. 30期｜2热 + 2冷
3. 30期｜2热 + 1冷
4. 50期｜3热 + 1冷
5. 50期｜2热 + 2冷
6. 50期｜2热 + 1冷
7. 30期热2头 + 50期热2头
8. 30期热2头 + 50期冷2头
9. 热2头 + 最大遗漏1头
10. 热2头 + 最大遗漏2头
然后每个方案都显示：

预测下一期头数
近100期命中率
近50期命中率
近30期命中率
最近30期命中 / 未中明细
我的建议
优先观察这几个：

50期｜2热 + 2冷
30期｜2热 + 2冷
30期热2头 + 50期热2头
热2头 + 最大遗漏1头
因为它们不是单纯追热，也不是完全追冷，比较适合做“特码头数过滤”。

如果你要，我下一步可以直接给你完整 app/top20/page.js，把这 10 个头数方案全部加进去。


1. 30期｜3热 + 1冷
2. 30期｜2热 + 2冷
3. 30期｜2热 + 1冷
4. 50期｜3热 + 1冷
5. 50期｜2热 + 2冷
6. 50期｜2热 + 1冷
7. 30期热2头 + 50期热2头
8. 30期热2头 + 50期冷2头
9. 热2头 + 最大遗漏1头
10. 热2头 + 最大遗漏2头

按照这个做一个完整的脚本，还有记得添加本期的开奖头数然后再预测下一期可能会来的头数

App Top20 Page Head 10 Schemes
· javascript
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

已思考 3m 13s
已经按你这 10 个方案做好完整脚本，放在右侧代码页里了。

你直接把右侧完整代码复制，替换这个文件：

app/top20/page.js
这版已经改好：

只统计每期最后一个特码的头数，不统计前6个正码。

显示本期最后特码。

显示本期最后特码头数。

显示预测下一期可能来的头数。

加入你指定的 10 个方案：

1. 30期｜3热 + 1冷
2. 30期｜2热 + 2冷
3. 30期｜2热 + 1冷
4. 50期｜3热 + 1冷
5. 50期｜2热 + 2冷
6. 50期｜2热 + 1冷
7. 30期热2头 + 50期热2头
8. 30期热2头 + 50期冷2头
9. 热2头 + 最大遗漏1头
10. 热2头 + 最大遗漏2头
提交后等 Vercel 自动部署完成，再刷新：

/top20
首页和后端都不用动。


已思考 8s
可以，压缩包已经做好了。

下载压缩包：top20 头数10方案完整代码

里面有两个文件：

page.js
README.txt
你只需要用里面的 page.js 替换：

app/top20/page.js
这版已经包含：

1. 30期｜3热 + 1冷
2. 30期｜2热 + 2冷
3. 30期｜2热 + 1冷
4. 50期｜3热 + 1冷
5. 50期｜2热 + 2冷
6. 50期｜2热 + 1冷
7. 30期热2头 + 50期热2头
8. 30期热2头 + 50期冷2头
9. 热2头 + 最大遗漏1头
10. 热2头 + 最大遗漏2头
并且会显示：

本期最后特码
本期最后特码头数
预测下一期可能出现的头数
近100期 / 50期 / 30期命中率
只改 app/top20/page.js，首页和后端都不用动。 


f3211918-d583-4f3c-890c-9fd478290654.png
a2f772cf-8c68-42c8-88cc-768cd28f7b37.png
头数方案也要做个中奖与不中奖统计，跟36号码统计一样，但是头数统计只统计20期内

已思考 9s
可以，你说得对。头数方案也应该有一个独立的“中奖 / 不中奖列表”，而且只看近20期。

我已经做好新版压缩包了：

下载压缩包：头数10方案 + 近20期中奖/不中奖列表

这版新增：

近20期头数方案中奖 / 不中奖列表
显示内容：

日期 / 期数
最后特码
特码头数
方案1 是否中奖
方案2 是否中奖
...
方案10 是否中奖
判断逻辑：

只看每期最后一个特码的头数
如果该方案预测头数包含当期特码头数 = 中
否则 = 未中
替换位置：

app/top20/page.js
操作：

1. 下载压缩包
2. 解压
3. 打开里面的 page.js
4. 复制全部内容
5. 去 GitHub 替换 app/top20/page.js
6. Commit changes
7. 等 Vercel 自动部署
8. 刷新 /top20
首页和后端都不用动。 


f8f72e87-a8d4-42de-abbe-40654330f5bd.png
把这个显示删除掉，然后在加一个数据就是抓取10个头数档位，然后分析出现最多的4个头数，看它30期跟50期的中奖概率还有预测下一期的头数也抓取显示出来并且要带复制按钮

74fdbf67-f040-477f-8ace-6c28557f3c89.png
为什么会显示这个呢

aeb2eb1b-0263-42c8-a32d-c80755247bac.png
9c2ea655-8943-4e0c-b451-c707fec5fa8b.png
为什么这里昨天看没有33今天看就有了，数据都是乱给的吗，不是每期回测的实时数据吗，我看这个数据是会变化的，为什么呢帮我查下代码修复一下

5af14842-6976-4729-97bc-4549d5650baf.png
c66226c7-6bc9-4b98-9ee6-fb4fba8b2b2e.png
上面的已经修改了 但是下面的数据还是会变的为什么呢

58da32a1-99e6-4a4c-b2b4-05e05add62af.png
为什么换新代码就进不去啊

d758a74a-a9ec-40e3-a18a-0ceb085f6ebc.png
54b0ef93-950a-40e9-9f0f-7d39a10848ac.png
回测那个还是没有修改哦 

7c918bad-148c-4cd8-b3e9-46a3cdeb57f2.png
27c6908c-5bd8-4654-b372-9b639e4c0e33.png
这里的中奖率不对吧 没修改到

03039c97-37b2-4b18-b655-abf0810cee67.png
42dbd3c2-27c8-4c1a-b503-de8f137022c8.png
我让你去修改那个20个档位的中奖率，不是修改下面100期的回测，你这个跟上面的都不一样 33不中奖，你下面100期回测又中奖什么情况

cbaaca8c-9b46-4c15-8e9e-ea0ed413c1ee.png
app/top20/page.js  里面的代码也要修改一下 因为它今晚第一期不中，要固定的中与不中，不然我的计划全部被打乱

8d7a2618-6ffc-434a-bebd-fe2f053c4fe0.png
还是一样

d280b827-29f3-4733-89a5-8620f26a1761.png
feebaee1-a557-41d7-8074-8f7d57e0e69d.png
为什么第四名在首页筛选策略那边是中奖的，但是在20档位开奖里它显示不中呢

f4f93744-435c-4422-ae4c-e6e9033c5f6c.png
不对 你按照里面的策略排名抓取到跳转页面做数据呀 你给我的跟首页都不一样，首页第一名今日都不中奖，但是那边显示是中奖的

c48877e9-68ae-4214-807c-acc8dd593e02.png
3c62c455-bd2e-41f4-a41b-a4dbcf841471.png
首页第一名都没中奖 ，后面还是显示中奖，你能帮我认真查下做一下吗

63686e58-565c-4692-8b72-146ecd0046d2.png
为什么会这样呢

e88fbca5-b4b5-4515-b9a4-b16800a656bb.png
d432f083-c093-4d22-adea-57eab4c7405b.png
为什么还是会出现这种情况呢

7769e204-287b-4ddb-8b9d-3541d60a3aeb.png
c50e031d-6894-4031-975d-c2847481e555.png
按照首页排名，第四名是中奖的，第八名是未中奖的情况，但是里面还是显示反了 什么原因呢 帮我认真排查一下情况，不然后面那个20档位都是乱的我怎么去看

a041f139-9e12-41d7-aa09-5e528124cd6c.png
你给我代码修改后 就卡在这里了为什么

14a86a3b-7b87-47e3-9da5-ed2538519a8b.png
不行啊

fea653bf-6064-45a1-b722-9ac8c63ecc85.png
还是不行 你能好好检查一下吗

e026105b-e4a1-4f1b-8c9a-7ef5394ea629.png
第一名 不中 第二名中奖 第三名中奖 第四名中奖 第五到第八名未中奖 后面的都对上了 就第一名对不上这个是为什么呢，因为页面是不中奖的，20个档位是中奖的第一名，还有统计哪里30期盈亏为什么金额是0呢

803ba8b1-de1b-4a76-869d-2ba2eb639586.png
d6b592bc-b5f4-4f8f-9e01-2480c40c29a7.png
为什么那个上面的当天开奖对上了，但是近30期前20名档位中奖 / 不中奖列表【V9首页同ID历史计算版】 表跟近100期回测明细 表的第一名排名中奖与不中奖对不上呢

已思考 20s
你这个问题的原因我这次定位清楚了：

首页下面的“近100期回测明细”用的是：

best100Rows
但是 /top20 第1列之前不是直接读这个 best100Rows，而是重新按策略算了一遍，所以会出现：

首页近100期明细：第1名某期是热中
/top20 第1列：同一期显示未中
这就不应该。你要看的第1列，应该跟首页“近100期回测明细”完全一致。

我已经修成 V10 版：

下载 V10 第一列同步近100明细版

这版修复：

1. /top20 第1列直接读取首页近100期回测明细 best100Rows 的结果
2. 所以 /top20 第1列会和首页近100期回测明细完全一致
3. 其它第2-20列仍按首页下拉框对应策略计算
4. 30期盈亏继续保留修复
这次还是替换两个文件：

1. 用 app_page.js 替换 app/page.js
2. 用 app_top20_page.js 替换 app/top20/page.js
部署后操作：

1. 先打开首页
2. 等首页数据加载完成
3. 从绿色按钮进入 /top20
成功标记：

【V10第一列同步近100明细版】
已读取首页V10同步数据



5a522040-4e20-491e-b502-9a33db127b9e.png
不是这个回测昨天不中 今天变中奖了啊 不是说过开奖后就不能变更了吗，固定的前一天是什么号就是什么号码吗

已思考 45s
你说得对：开奖后昨天的号码和中/未中结果不能再变。之前会变，是因为页面每次刷新都会用“最新开奖后的数据”重新计算过去的预测。

真正要解决这个问题，必须做“开奖前冻结”：

开奖前生成的下一期36码，先保存起来
开奖后只用保存的那份号码判断中/未中
已经保存过的期号，永远不覆盖
我已经做了 V11 开奖前冻结版。

下载 V11 开奖前冻结版

这次还是替换两个文件：

1. 用 app_page.js 替换 app/page.js
2. 用 app_top20_page.js 替换 app/top20/page.js
V11 修复内容：

1. 首页生成下一期推荐36码时，会自动冻结保存下一期期号的前20档位36码
2. 已冻结过的期号不会被覆盖
3. 开奖后判断中/未中时，优先用开奖前冻结的36码
4. 从 V11 开始，未来每一期开奖后不会再被新数据改写
重要说明：以前没有提前冻结保存的期号，无法 100% 还原当时页面上的号码。V11 能保证的是：从你替换并部署成功之后，以后的每一期不再变。

以后每天开奖前，你至少打开一次首页，等数据加载完成，让系统把下一期数据冻结保存。 


78e3b5a4-1331-4eec-90be-ca59135d2630.png
为什么修改代码后打不开了呢

已思考 15s
原因找到了：V11 不是接口问题，是前端运行时报错。

我上一版把“冻结下一期数据”的 React.useEffect 放到了 nextExpect 定义之前，页面加载时先引用了还没初始化的 nextExpect，所以首页直接显示：

Application error: a client-side exception has occurred
我已经修成 V11.1 版。

下载 V11.1 运行报错修复版

这次还是替换两个文件：

1. 用 app_page.js 替换 app/page.js
2. 用 app_top20_page.js 替换 app/top20/page.js
修复内容：

1. 修复首页 Application error
2. 保留 V11 的开奖前冻结逻辑
3. 冻结逻辑移动到 nextExpect 生成之后
4. 开奖前打开首页，会冻结下一期20档位36码
5. 开奖后优先用冻结数据判断中/未中，避免历史结果被新开奖改写
部署后先打开首页测试。成功后 /top20 会显示：

【V11.1开奖前冻结修复版】




粘贴的文本 (1)(55).txt
文档


这个是昨天修改固定回测的显示，你刚才给我的100期回测还是显示中的，但是昨天开33是不中奖的第一名

已思考 1m 8s
你这个文件我看了，问题点很明确：你现在这份 app/page.js 里，近100期明细还是用同一个 historicalStrategy 去跑所有历史行，所以今天新增开奖后，旧期结果会被反向改写。你上传的代码里确实还是这个逻辑：detailBacktest100 调用 buildFixedStrategyBacktestResult(history, historicalStrategy, 100)，这会导致昨天未中的 33，今天可能又被重新算成命中。


我给你重新做了 V12 修复版：

下载 V12 近100期历史回测固定版

这版只需要替换：

app/page.js
V12 修复内容：

1. 近100期回测明细：每一行都独立使用该期开奖之前的数据重新生成36码
2. 近50期明细：直接从近100期前50行统计，口径一致
3. 后面新增开奖，不会再反向改变旧期中/未中结果
4. 昨天未中，就不会因为今天新增开奖又变成命中
操作：

1. 下载压缩包
2. 解压
3. 打开里面的 page.js
4. 复制全部内容
5. 替换 GitHub 的 app/page.js
6. Commit changes
7. 等 Vercel 部署完成
8. Ctrl + F5 强制刷新首页
这次先只改首页 app/page.js，不要动 app/top20/page.js，避免把两个问题混在一起。 


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

<span
className={mini-ball ${wave}}
style={
hit
? {
outline: 3px solid ${outlineColor},
boxShadow: 0 0 10px ${outlineColor},
}
: undefined
}
>
{String(num).padStart(2, '0')}

{detail?.zodiac || getZodiac(num)}

)
}

function DetailBacktestTable({ title, rows, limit = 100 }) {
return (

{title}

表格按开奖站样式展示，号码显示波色与生肖。每一行都会使用该期之前的数据重新生成36码；黄色圈 = 特码落入当期筛选36码，绿色圈 = 平码落入36码。金额回测仍只按特码命中计算。


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
return ¥${num.toFixed(2)}
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
<div className={ball-box ${small ? 'small' : ''}}>
<div
className={ball ${wave}}
style={
hit
? {
outline: 4px solid ${outlineColor},
boxShadow: 0 0 18px ${outlineColor},
}
: undefined
}
>
{String(num).padStart(2, '0')}


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

<button
type="button"
className={play-box macau ${currentPlay === 'macau' ? 'active' : ''}}
onClick={() => onChange('macau')}
title="点击进入澳门玩法"
>
澳门玩法


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
id: ${mode.key}-${sampleSize}-${hotCount},
mode: mode.key,
modeLabel: mode.label,
desc: mode.desc,
sampleSize,
hotCount,
coldCount: 36 - hotCount,
label: ${mode.label}｜前${sampleSize}期｜热${hotCount}+冷${36 - hotCount},
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
id: aggregate-top20-${combo.hotCount}-${combo.coldCount},
mode: 'aggregateTop20',
modeLabel: 20档位综合 ${combo.hotCount}热+${combo.coldCount}冷,
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

const strategyRanking = React.useMemo(() => {
if (!history.length) return []
return buildStrategyRanking(history)
}, [history])

const bestStrategy = strategyRanking[0] || null

const currentStrategy =
selectedStrategyId === 'auto'
? bestStrategy
: strategyRanking.find((item) => item.id === selectedStrategyId) || bestStrategy

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
玩法：${playConfig.name},
下一期期号：${nextExpect},
策略：${historicalStrategy?.label || currentStrategy?.label || ''},
下一期36码：${nextRecommendText},
热门号：${nextHotText},
冷门号：${nextColdText},
].join('\n')

const detailBacktest100 = React.useMemo(() => {
if (!history.length || !historicalStrategy) return null
return buildFixedStrategyBacktestResult(history, historicalStrategy, 100)
}, [history, historicalStrategy])

const detailBacktest50 = React.useMemo(() => {
if (!history.length || !historicalStrategy) return null
return buildFixedStrategyBacktestResult(history, historicalStrategy, 50)
}, [history, historicalStrategy])

const best100Rows = detailBacktest100?.rows || []
const best50Rows = detailBacktest50?.rows || []

const recommendNumbers = singleBacktest?.recommendNumbers || []
const hotNumbers = singleBacktest?.hotNumbers || []
const coldNumbers = singleBacktest?.coldNumbers || []

const recommendText = formatNumbers(recommendNumbers)
const hotText = formatNumbers(hotNumbers)
const coldText = formatNumbers(coldNumbers)

const fullCopyText = [
玩法：${playConfig.name},
回测期号：${singleBacktest?.target?.expect || ''},
策略：${currentStrategy?.label || ''},
36码：${recommendText},
热门号：${hotText},
冷门号：${coldText},
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

{`
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
        <a
          href="/top20"
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
          }}
        >
          查看20档位当期开奖统计
        </a>
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
            系统自动测试多种组合，默认选择综合表现最好的策略。历史回测高，不代表下一期一定命中。
          </p>

          <div className="latest-info">
            <div>
              <span>策略名称</span>
              <strong>{historicalStrategy?.label || currentStrategy?.label}</strong>
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
              这里是历史回测，不是下一期推荐。选择某一期，系统只会使用该期之前的数据生成36码，不会把该期开奖号码提前放进去；下方近100期明细会跟当前查看的历史回测策略保持一致，避免同一期上面未中、下面命中的情况。
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
            回测逻辑：上方单期历史回测和下方近100期/50期明细使用同一套历史策略。绿色圈表示前6个平码落入36码；黄色圈表示最后特码落入36码。金额回测只按特码命中计算。
          </div>
        </>
      )}
    </>
  )}
</main>
)
}


关闭
