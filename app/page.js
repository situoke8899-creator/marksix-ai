'use client'

import React from 'react'

export default function MarkSixFilterApp() {
  const numbers = Array.from({ length: 49 }, (_, i) => i + 1)

  const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
  const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
  const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

  const [selected, setSelected] = React.useState([])
  const [history, setHistory] = React.useState([
    [3, 8, 12, 19, 27, 44],
    [1, 7, 15, 22, 31, 48],
    [5, 11, 18, 26, 33, 40],
    [2, 9, 16, 25, 37, 49],
    [4, 13, 20, 29, 35, 46],
  ])

  const [filter, setFilter] = React.useState('all')

  const toggleNumber = (num) => {
    if (selected.includes(num)) {
      setSelected(selected.filter((n) => n !== num))
    } else {
      setSelected([...selected, num])
    }
  }

  const getColor = (num) => {
    if (redWave.includes(num)) return 'bg-red-500 text-white'
    if (blueWave.includes(num)) return 'bg-blue-500 text-white'
    return 'bg-green-500 text-white'
  }

  const filteredNumbers = numbers.filter((num) => {
    if (filter === 'red') return redWave.includes(num)
    if (filter === 'blue') return blueWave.includes(num)
    if (filter === 'green') return greenWave.includes(num)
    if (filter === 'odd') return num % 2 !== 0
    if (filter === 'even') return num % 2 === 0
    return true
  })

  const randomPick = () => {
    const shuffled = [...numbers].sort(() => 0.5 - Math.random())
    setSelected(shuffled.slice(0, 6).sort((a, b) => a - b))
  }

  const clearAll = () => {
    setSelected([])
  }

  const hotNumbers = () => {
    const count = {}

    history.flat().forEach((num) => {
      count[num] = (count[num] || 0) + 1
    })

    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  }

  const coldNumbers = () => {
    const count = {}

    numbers.forEach((num) => {
      count[num] = 0
    })

    history.flat().forEach((num) => {
      count[num] += 1
    })

    return Object.entries(count)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 10)
  }

  const smartPick = () => {
    const hot = hotNumbers().map((item) => Number(item[0]))

    const mix = [...hot]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6)
      .sort((a, b) => a - b)

    setSelected(mix)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-wide mb-2">
            六肖中特号码筛选系统
          </h1>
          <p className="text-zinc-400 text-lg">
            私人号码分析 · 49号码智能筛选
          </p>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800 mb-6">
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            {[
              { key: 'all', label: '全部' },
              { key: 'red', label: '红波' },
              { key: 'blue', label: '蓝波' },
              { key: 'green', label: '绿波' },
              { key: 'odd', label: '单数' },
              { key: 'even', label: '双数' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-5 py-2 rounded-2xl transition-all ${
                  filter === item.key
                    ? 'bg-white text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-7 md:grid-cols-7 gap-3">
            {filteredNumbers.map((num) => (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                className={`h-14 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105 ${getColor(
                  num
                )} ${
                  selected.includes(num)
                    ? 'ring-4 ring-white scale-105'
                    : 'opacity-85'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">已选号码</h2>

            <div className="flex flex-wrap gap-3 min-h-[80px]">
              {selected.length > 0 ? (
                [...selected]
                  .sort((a, b) => a - b)
                  .map((num) => (
                    <div
                      key={num}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getColor(
                        num
                      )}`}
                    >
                      {num}
                    </div>
                  ))
              ) : (
                <p className="text-zinc-500">暂无选号</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={randomPick}
                className="flex-1 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90"
              >
                随机6码
              </button>

              <button
                onClick={clearAll}
                className="flex-1 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700"
              >
                清空
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">数据分析</h2>

            <div className="space-y-4 text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>已选数量</span>
                <span>{selected.length}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>单数数量</span>
                <span>{selected.filter((n) => n % 2 !== 0).length}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>双数数量</span>
                <span>{selected.filter((n) => n % 2 === 0).length}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>红波数量</span>
                <span>{selected.filter((n) => redWave.includes(n)).length}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>蓝波数量</span>
                <span>{selected.filter((n) => blueWave.includes(n)).length}</span>
              </div>

              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span>绿波数量</span>
                <span>{selected.filter((n) => greenWave.includes(n)).length}</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
            <h2 className="text-2xl font-semibold mb-4">走势分析</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400 font-semibold">热门号码</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {hotNumbers().map(([num]) => (
                  <div
                    key={num}
                    className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center font-bold"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-cyan-400 font-semibold">冷门号码</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {coldNumbers().map(([num]) => (
                  <div
                    key={num}
                    className="w-11 h-11 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={smartPick}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:opacity-90"
            >
              AI智能推荐号码
            </button>
          </div>
        </div>

        <div className="text-center text-zinc-500 mt-10 text-sm">
          私人号码研究系统 · 极简高级版 UI
        </div>
      </div>
    </div>
  )
}
