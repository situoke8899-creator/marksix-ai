import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function parseOpenCode(value) {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
  }

  return String(value)
    .split(/[,，\s|/]+/)
    .map((n) => Number(String(n).trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)
}

function normalizeDate(value) {
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

function normalizeExpect(issue, openTime) {
  const text = String(issue || '').trim()

  const hk = text.match(/^(\d{2})\/(\d{3})$/)
  if (hk) return `${hk[1]}/${hk[2]}`

  const full = text.match(/^20(\d{2})(\d{3})/)
  if (full) return `${full[1]}/${full[2]}`

  const pure = text.match(/(\d{1,3})/)
  if (pure) {
    const yearMatch = String(openTime || '').match(/^20(\d{2})/)
    const yearPart = yearMatch ? yearMatch[1] : String(new Date().getFullYear()).slice(-2)
    const issuePart = String(Number(pure[1])).padStart(3, '0')
    return `${yearPart}/${issuePart}`
  }

  return text
}

function sortHistory(list) {
  return [...list].sort((a, b) => {
    const tb = new Date(b.openTime || 0).getTime()
    const ta = new Date(a.openTime || 0).getTime()

    if (tb !== ta) return tb - ta

    const eb = Number(String(b.expect || '').replace(/\D/g, ''))
    const ea = Number(String(a.expect || '').replace(/\D/g, ''))

    return eb - ea
  })
}

function pick(item, keys) {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== '') {
      return item[key]
    }
  }

  return ''
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

function getOpenTime(item) {
  return normalizeDate(
    pick(item, [
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

function getIssue(item) {
  return pick(item, [
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

function getNumbers(item) {
  const code = pick(item, [
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

  const splitKeyGroups = [
    ['num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7'],
    ['number1', 'number2', 'number3', 'number4', 'number5', 'number6', 'number7'],
    ['code1', 'code2', 'code3', 'code4', 'code5', 'code6', 'code7'],
    ['ball1', 'ball2', 'ball3', 'ball4', 'ball5', 'ball6', 'ball7'],
  ]

  for (const keys of splitKeyGroups) {
    const arr = keys
      .map((key) => Number(item?.[key]))
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= 49)

    if (arr.length >= 7) return arr.slice(0, 7)
  }

  const normal = pick(item, [
    'zm',
    'zhengma',
    'normal',
    'normalCode',
    'normal_code',
    'openCodeList',
    'preDrawCodeList',
  ])

  const normalNumbers = parseOpenCode(normal)

  const special = pick(item, [
    'tm',
    'tema',
    'special',
    'specialCode',
    'special_code',
    'preDrawSpecialCode',
    'pre_draw_special_code',
  ])

  const specialNumber = parseOpenCode(special)[0]

  if (normalNumbers.length >= 6 && specialNumber) {
    return [...normalNumbers.slice(0, 6), specialNumber]
  }

  return []
}

function normalizeHongKongItem(item) {
  const openTime = getOpenTime(item)
  const issue = getIssue(item)
  const numbers = getNumbers(item)

  if (!openTime) return null
  if (!issue) return null
  if (numbers.length < 7) return null

  const expect = normalizeExpect(issue, openTime)

  return {
    expect,
    openTime,
    openCode: numbers.join(','),
    numbers,
  }
}

function buildDebugShape(json) {
  const objects = collectObjectsDeep(json, []).slice(0, 8)

  return objects.map((obj) => {
    const sample = {}

    Object.keys(obj || {})
      .slice(0, 40)
      .forEach((key) => {
        const value = obj[key]

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          sample[key] = value
        } else if (Array.isArray(value)) {
          sample[key] = `Array(${value.length})`
        } else if (value && typeof value === 'object') {
          sample[key] = `Object(${Object.keys(value).slice(0, 10).join(',')})`
        }
      })

    return sample
  })
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

  if (!text || !text.trim()) {
    throw new Error(`接口返回空内容：${url}`)
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`接口返回不是JSON：${text.slice(0, 200)}`)
  }
}

export async function GET() {
  try {
    const now = new Date()
    const currentYear = now.getFullYear()
    const years = [currentYear, currentYear - 1, currentYear - 2]

    const uniqueMap = new Map()
    const sourceStatus = []
    let lastDebugShape = []

    for (const year of years) {
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
        objectCount: objects.length,
        successCount,
      })
    }

    const history = sortHistory(Array.from(uniqueMap.values()))

    if (!history.length) {
      return NextResponse.json(
        {
          ok: false,
          message: '接口请求成功，但字段还没匹配到。请把 debugShape 截图发我。',
          sourceStatus,
          debugShape: lastDebugShape,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      ok: true,
      play: 'hongkong',
      source: '1680660.com/smallSix/findSmallSixHistory.do',
      latest: history[0],
      nextExpect: '等待下期开奖',
      history: history.slice(0, 400),
      recentHistory: history.slice(0, 30),
      sourceStatus,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error.message || '香港接口测试失败',
      },
      {
        status: 500,
      }
    )
  }
}
