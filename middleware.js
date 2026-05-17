import { NextResponse } from 'next/server'

export function middleware(request) {
  const password = process.env.SITE_PASSWORD

  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  if (!password) {
    return new Response('网站密码还没有设置，请先在 Vercel 设置 SITE_PASSWORD', {
      status: 500,
    })
  }

  const authCookie = request.cookies.get('site_auth')?.value

  if (authCookie === 'ok') {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/login'

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
