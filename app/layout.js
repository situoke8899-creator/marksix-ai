import './globals.css'

export const metadata = {
  title: '六合彩号码筛选系统',
  description: '私人号码分析 · 49号码智能筛选',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
