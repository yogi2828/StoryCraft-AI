import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/app') && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((pathname.startsWith('/login') || pathname.startsWith('/register')) && authToken) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/login', '/register'],
}
