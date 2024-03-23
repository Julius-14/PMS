import { NextResponse } from 'next/server'
 
export function middleware(request) {
    const path = request.nextUrl.pathname

    const isPublicPath = path == '/login'

    const token = request.cookies.get('uid')?.value || ''

    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if(!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }
}
 
export const config = {
  matcher: ['/', '/login'],
}