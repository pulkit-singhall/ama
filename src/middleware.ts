import { NextRequest, NextResponse } from 'next/server'

// public paths = [signup, verifyEmail, login, message]
// anyone can access these pages

// private paths = [logout, profile]
// you need token to access these pages
// logout is not a page it is an action event

export async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")
    const refreshToken = req.cookies.get("refreshToken")
    // console.log(req.nextUrl.pathname);
    // console.log(req.url);
    // console.log(req.nextUrl);
    if (!accessToken && !refreshToken) {
        // token is not there on the client side
        // public paths
        const path = req.nextUrl.pathname
        if (path === '/profile') {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }
}

export const config = {
    matcher: [
        '/profile',
    ],
}