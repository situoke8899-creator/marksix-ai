'use client'

import React from 'react'

export default function LoginPage() {
  React.useEffect(() => {
    window.location.href = '/'
  }, [])

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020617',
      color: '#fff',
      fontSize: 18,
      fontWeight: 700,
    }}>
      正在返回首页...
    </main>
  )
}
