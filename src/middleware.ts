import { NextRequest, NextResponse } from 'next/server'

// public paths = [signup, verifyEmail, login, message, home]
// anyone can access these pages

// private paths = [logout, profile]
// you need token to access these pages
// logout is not a page it is an action event

// console.log(req.url); this is a string
// console.log(req.nextUrl); this is an object

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")
    const refreshToken = req.cookies.get("refreshToken")
    
    const path = req.nextUrl.pathname

    const isToken = accessToken || refreshToken; 
    const privatePath = path === '/profile'; 
    
    if (privatePath && !isToken) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (!privatePath && isToken) {
        return NextResponse.redirect(new URL('/profile', req.nextUrl))
    }

}

export const config = {
    matcher: [
        '/',
        '/signup/:path*',
        '/login/:path*',
        '/verifyEmail/:path*',
        '/profile/:path*',
        '/emailCollect:path*'
    ],
}