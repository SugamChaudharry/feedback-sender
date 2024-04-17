import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"

export async function middleware(request: NextRequest) {

  const token = await getToken({req: request})
  const url = request.nextUrl

  if (token && 
    (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/') ||
      url.pathname.startsWith('/verify')
    )
  ) {
    return NextResponse.redirect(new URL('/dashbord', request.url))
  }
  if (!token && url.pathname.startsWith('/deshboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/deshboard/:path*',
    '/verify/:path*',
  ],
}