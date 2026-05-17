'use client'

import React from 'react'

export default function LoginPage() {
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      })

      const json = await res.json()

      if (!json.ok) {
        throw new Error(json.message || '密码错误')
      }

      window.location.href = '/'
    } catch (err) {
      setError(err.message || '密码错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#06070a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Arial, Microsoft YaHei, sans-serif',
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#18181b',
          border: '1px solid #3f3f46',
          borderRadius: '28px',
          padding: '32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px',
            fontSize: '30px',
          }}
        >
          请输入访问密码
        </h1>

        <p
          style={{
            margin: '0 0 24px',
            color: '#a1a1aa',
            fontSize: '14px',
          }}
        >
          这个网站已开启密码保护，输入密码后才能进入。
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="请输入密码"
          autoFocus
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: '16px',
            border: '1px solid #52525b',
            background: '#09090b',
            color: '#fff',
            fontSize: '16px',
            outline: 'none',
            marginBottom: '16px',
          }}
        />

        {error && (
          <div
            style={{
              color: '#fecaca',
              background: 'rgba(127,29,29,0.45)',
              border: '1px solid rgba(248,113,113,0.4)',
              padding: '12px',
              borderRadius: '14px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: '16px',
            padding: '15px',
            background: 'linear-gradient(135deg, #facc15, #f97316)',
            color: '#111827',
            fontWeight: '800',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '验证中...' : '进入网站'}
        </button>
      </form>
    </main>
  )
}
