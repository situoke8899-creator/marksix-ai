import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

function parseOpenCode(openCode) {
  if (!openCode) return []

  if (Array.isArray(openCode)) {
    return openCode
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
  }

  return String(openCode)
    .split(/[,，\s|/]+/)
    .map((n) => Number(String(n).trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
}

function parseExpectOrder(expect) {
  const text = String(expect || '')
  const onlyNumber = Number(text.replace(/\D/g, ''))
  return Number.isFinite(onlyNumber) ? onlyNumber : 0
}

function parseDateTime(value) {
  if (!value) return 0

  const text = String(value).trim()

  const ymd = text.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/)
  if (ymd) {
    return new Date(`${ymd[1]}-${ymd[2]}-${ymd[3]}T00:00:00`).getTime()
  }

  const dmy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/)
  if (dmy) {
    return new Date(`${dmy[3]}-${dmy[2]}-${dmy[1]}T00:00:00`).getTime()
  }

  const normal = new Date(text).getTime()
  return Number.isFinite(normal) ? normal : 0
}

function sortHistory(list) {
  return [...list].sort((a, b) => {
    const tb = parseDateTime(b.openTime)
    const ta = parseDateTime(a.openTime)

    if (tb !== ta) return tb - ta

    const eb = parseExpectOrder(b.expect)
    const ea = parseExpectOrder(a.expect)

    return eb - ea
  })
}

async function fetchText(url) {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.8,*/*;q=0.7',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148 Safari/537.36',
    },
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`接口请求失败：${url}`)
  }

  return text
}

async function fetchJson(url) {
  const text = await fetchText(url)

  if (text.trim().startsWith('<')) {
    throw new Error(`接口返回网页，不是开奖JSON：${url}`)
  }

  return JSON.parse(text)
}

async function postFormJson(url, formData) {
  const body = new URLSearchParams(formData)

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      origin: 'https://6hch.com',
      referer: 'https://6hch.com/',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148 Safari/537.36',
    },
    body,
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(`接口请求失败：${url}`)
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`接口返回不是JSON：${url}，返回内容：${text.slice(0, 200)}`)
  }
}

function getWave(num) {
  const n = Number(num)
  if (redWave.includes(n)) return '红'
  if (blueWave.includes(n)) return '蓝'
  if (greenWave.includes(n)) return '绿'
  return ''
}

function getZodiac(num, openTime) {
  const n = Number(num)
  const date = String(openTime || '')
  const year = Number(date.slice(0, 4)) || new Date().getFullYear()

  // 2026 年：01/13/25/37/49 = 马
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

function enrichLotteryItem(item) {
  const numbers = item.numbers || []
  const specialNumber = numbers[numbers.length - 1]
  const sum = numbers.reduce((total, num) => total + Number(num), 0)

  const numbersDetail = numbers.map((num, index) => {
    const isSpecial = index === numbers.length - 1

    return {
      num,
      zodiac: getZodiac(num, item.openTime),
      wave: getWave(num),
      oddEven: getOddEven(num),
      bigSmall: getBigSmall(num),
      sumOddEven: getSumOddEven(num),
      sumBigSmall: getSumBigSmall(num),
      tailBigSmall: getTailBigSmall(num),
      isSpecial,
    }
  })

  return {
    ...item,
    numbersDetail,
    sum,
    sumOddEven: sum % 2 === 0 ? '双' : '单',
    sumBigSmall: sum >= 175 ? '大' : '小',
    specialNumber,
    specialZodiac: getZodiac(specialNumber, item.openTime),
    specialWave: getWave(specialNumber),
    specialOddEven: getOddEven(specialNumber),
    specialBigSmall: getBigSmall(specialNumber),
    specialSumOddEven: getSumOddEven(specialNumber),
    specialSumBigSmall: getSumBigSmall(specialNumber),
    specialTailBigSmall: getTailBigSmall(specialNumber),
  }
}

function normalizeMacauItem(item) {
  const numbers = parseOpenCode(item.openCode)

  if (numbers.length < 7) return null

  return enrichLotteryItem({
    expect: String(item.expect || ''),
    openTime: item.openTime || '',
    openCode: numbers.slice(0, 7).join(','),
    numbers: numbers.slice(0, 7),
    wave: item.wave || '',
    zodiac: item.zodiac || '',
  })
}

function pickFirstValue(obj, keys) {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key]
    }
  }
  return ''
}

function normalizeDateText(value) {
  const text = String(value || '').trim()

  const ymd = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (ymd) {
    return `${ymd[1]}-${String(ymd[2]).padStart(2, '0')}-${String(ymd[3]).padStart(2, '0')}`
  }

  const dmy = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (dmy) {
    return `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`
  }

  return text
}

function normalizeHongKongExpect(issue, openTime) {
  const issueText = String(issue || '').trim()

  const hk = issueText.match(/^(\d{2})\/(\d{3})$/)
  if (hk) return `${hk[1]}/${hk[2]}`

  const full = issueText.match(/^20(\d{2})(\d{3})/)
  if (full) return `${full[1]}/${full[2]}`

  const pure = issueText.match(/(\d{1,3})/)
  if (pure) {
    const yearMatch = String(openTime || '').match(/^20(\d{2})/)
    const yearPart = yearMatch ? yearMatch[1] : String(new Date().getFullYear()).slice(-2)
    const issuePart = String(Number(pure[1])).padStart(3, '0')
    return `${yearPart}/${issuePart}`
  }

  return issueText
}

function getNumbersFromObject(item) {
  // 1680660 常见字段：preDrawCode / preDrawCodeArr / openCode
  const code = pickFirstValue(item, [
    'preDrawCode',
    'pre_draw_code',
    'openCode',
    'open_code',
    'code',
    'codes',
    'numbers',
    'numberList',
    'number_list',
    'result',
    'openResult',
    'open_result',
    'lotteryDrawResult',
    'drawResult',
  ])

  let numbers = parseOpenCode(code)

  if (numbers.length >= 7) return numbers.slice(0, 7)

  // 有些接口会拆成 n1-n7 / num1-num7 / code1-code7
  const splitKeys = [
    ['num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7'],
    ['number1', 'number2', 'number3', 'number4', 'number5', 'number6', 'number7'],
    ['code1', 'code2', 'code3', 'code4', 'code5', 'code6', 'code7'],
    ['ball1', 'ball2', 'ball3', 'ball4', 'ball5', 'ball6', 'ball7'],
  ]

  for (const keys of splitKeys) {
    const arr = keys.map((key) => Number(item?.[key])).filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
    if (arr.length >= 7) return arr.slice(0, 7)
  }

  // 正码 + 特码分开
  const normal = pickFirstValue(item, [
    'zm',
    'zhengma',
    'normal',
    'normalCode',
    'normal_code',
    'red',
    'openCodeList',
    'preDrawCodeList',
  ])

  const normalNumbers = parseOpenCode(normal)

  const special = pickFirstValue(item, [
    'tm',
    'tema',
    'special',
    'specialCode',
    'special_code',
    'blue',
    'preDrawSpecialCode',
    'pre_draw_special_code',
  ])

  const specialNumber = parseOpenCode(special)[0]

  if (normalNumbers.length >= 6 && specialNumber) {
    return [...normalNumbers.slice(0, 6), specialNumber]
  }

  return []
}

function getOpenTimeFromObject(item) {
  return normalizeDateText(
    pickFirstValue(item, [
      'openTime',
      'open_time',
      'openDate',
      'open_date',
      'date',
      'kjTime',
      'kj_time',
      'time',
      'preDrawTime',
      'pre_draw_time',
      'preDrawDate',
      'pre_draw_date',
      'lotteryTime',
      'lottery_time',
    ])
  )
}

function getIssueFromObject(item) {
  return pickFirstValue(item, [
    'expect',
    'issue',
    'qihao',
    'period',
    'number',
    'yearNo',
    'year_no',
    'kjNo',
    'kj_no',
    'preDrawIssue',
    'pre_draw_issue',
    'preDrawExpect',
    'drawIssue',
    'draw_issue',
  ])
}

function normalizeHongKongItem(item) {
  const openTime = getOpenTimeFromObject(item)
  const rawIssue = getIssueFromObject(item)
  const numbers = getNumbersFromObject(item)

  if (!openTime) return null
  if (!rawIssue) return null
  if (numbers.length < 7) return null

  const expect = normalizeHongKongExpect(rawIssue, openTime)

  return enrichLotteryItem({
    expect,
    openTime,
    openCode: numbers.slice(0, 7).join(','),
    numbers: numbers.slice(0, 7),
    wave: '',
    zodiac: '',
  })
}

function collectObjectsDeep(value, result = []) {
  if (!value) return result

  if (Array.isArray(value)) {
    value.forEach((item) => collectObjectsDeep(item, result))
    return result
  }

  if (typeof value === 'object') {
    result.push(value)
    Object.values(value).forEach((item) => collectObjectsDeep(item, result))
  }

  return result
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

function buildHongKongNextExpect(history) {
  const latest = history?.[0]

  if (!latest?.expect) return '等待下期开奖'

  const expectText = String(latest.expect)
  const hkMatch = expectText.match(/^(\d{2})\/(\d{3})$/)

  if (hkMatch) {
    const yearPart = hkMatch[1]
    const issuePart = String(Number(hkMatch[2]) + 1).padStart(3, '0')
    return `${yearPart}/${issuePart}`
  }

  return '等待下期开奖'
}

function buildDebugShape(json) {
  try {
    const objects = collectObjectsDeep(json, []).slice(0, 5)

    return objects.map((obj) => {
      const keys = Object.keys(obj || {}).slice(0, 30)
      const sample = {}

      keys.forEach((key) => {
        const value = obj[key]
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sample[key] = value
        } else if (Array.isArray(value)) {
          sample[key] = `Array(${value.length})`
        } else if (value && typeof value === 'object') {
          sample[key] = `Object(${Object.keys(value).slice(0, 8).join(',')})`
        }
      })

      return sample
    })
  } catch (error) {
    return []
  }
}

async function getMacauData() {
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
    const normalized = normalizeMacauItem(item)

    if (!normalized?.expect) return

    uniqueMap.set(normalized.expect, normalized)
  })

  let latest = null

  try {
    const latestJson = await fetchJson('https://macaumarksix.com/api/macaujc2.com')

    if (Array.isArray(latestJson) && latestJson[0]?.openCode) {
      const normalizedLatest = normalizeMacauItem(latestJson[0])

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
    throw new Error('没有获取到澳门历史开奖数据，请稍后刷新重试')
  }

  latest = latest || history[0]

  const currentAnalysis = buildAnalysis(history, 100)

  const latestNumber = Number(latest.expect)
  const nextExpect = Number.isFinite(latestNumber)
    ? String(latestNumber + 1)
    : ''

  return {
    ok: true,
    play: 'macau',
    source: 'macaujc.com',
    latest,
    nextExpect,
    history: history.slice(0, 400),
    recentHistory: history.slice(0, 30),
    updatedAt: new Date().toISOString(),
    ...currentAnalysis,
  }
}

async function getHongKongData() {
  const now = new Date()
  const currentYear = now.getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]

  const uniqueMap = new Map()
  const sourceStatus = []
  let lastDebugShape = []

  for (const year of years) {
    try {
      const json = await postFormJson(
        'https://1680660.com/smallSix/findSmallSixHistory.do',
        {
          year: String(year),
          type: '1',
        }
      )

      const objects = collectObjectsDeep(json, [])
      lastDebugShape = buildDebugShape(json)

      let successCount = 0

      objects.forEach((item) => {
        const normalized = normalizeHongKongItem(item)

        if (!normalized?.expect) return

        uniqueMap.set(normalized.expect, normalized)
        successCount += 1
      })

      sourceStatus.push({
        year,
        ok: successCount > 0,
        count: successCount,
        objectCount: objects.length,
      })
    } catch (error) {
      sourceStatus.push({
        year,
        ok: false,
        count: 0,
        error: error.message,
      })

      console.log(`香港接口抓取失败：${year}`, error.message)
    }
  }

  const history = sortHistory(Array.from(uniqueMap.values()))

  if (!history.length) {
    return {
      ok: false,
      play: 'hongkong',
      message: '香港接口已经请求成功，但字段名还没有匹配到。请把这个页面 JSON 里的 debugShape 截图发我。',
      source: '1680660.com/smallSix/findSmallSixHistory.do',
      sourceStatus,
      debugShape: lastDebugShape,
      updatedAt: new Date().toISOString(),
    }
  }

  const latest = history[0]
  const currentAnalysis = buildAnalysis(history, 100)
  const nextExpect = buildHongKongNextExpect(history)

  return {
    ok: true,
    play: 'hongkong',
    source: '1680660.com/smallSix/findSmallSixHistory.do',
    sourceStatus,
    latest,
    nextExpect,
    history: history.slice(0, 400),
    recentHistory: history.slice(0, 30),
    updatedAt: new Date().toISOString(),
    ...currentAnalysis,
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const play = searchParams.get('play') || 'macau'

    if (play === 'hongkong') {
      const data = await getHongKongData()
      return NextResponse.json(data, { status: data.ok === false ? 500 : 200 })
    }

    const data = await getMacauData()
    return NextResponse.json(data)
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
