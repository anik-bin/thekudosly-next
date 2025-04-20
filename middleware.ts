import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req: req });
    const url = req.nextUrl;

    // Allow public access to the root route "/"
    if (url.pathname === "/" && !token) {
        return NextResponse.next();
    }

    // Handle login page
    if (url.pathname === "/login") {
        if (token) {
            const hasUsername = token.username ? true : false;

            if (hasUsername) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }
        return NextResponse.next();
    }

    // Protected routes
    if (url.pathname.startsWith("/recommend") || url.pathname.startsWith("/contact")) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const hasUsername = token.username ? true : false;
        if (!hasUsername) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/recommend/:path*',
        '/contact/:path*',
    ]
};