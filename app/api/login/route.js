import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { password } = await request.json()

    const sitePassword = process.env.SITE_PASSWORD

    if (!sitePassword) {
      return NextResponse.json(
        {
          ok: false,
          message: '网站密码还没有设置',
        },
        {
          status: 500,
        }
      )
    }

    if (password !== sitePassword) {
      return NextResponse.json(
        {
          ok: false,
          message: '密码错误',
        },
        {
          status: 401,
        }
      )
    }

    const response = NextResponse.json({
      ok: true,
      message: '登录成功',
    })

    response.cookies.set('site_auth', 'ok', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: '登录失败',
      },
      {
        status: 500,
      }
    )
  }
}
