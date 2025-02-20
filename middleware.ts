import { NextRequest, NextResponse } from 'next/server';
export { default } from "next-auth/middleware";
import { getToken } from 'next-auth/jwt';


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if(token) {
        const hasUsername =  token.username ? true : false;

        if (hasUsername && (url.pathname === "/login" || url.pathname === "/")) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        if (!hasUsername && url.pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
}

export const config = {
    matcher: [
        '/login',
        '/',
        '/dashboard/:path*',
    ]
};
