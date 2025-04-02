import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.SECRET_KEY || " ";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;
    if (!token) {
        if (pathname !== '/auth/login' && pathname !== '/auth/signup') {
            console.log("No token found, redirecting to login...");
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
        return NextResponse.next();
    }

    try {
        const secretKey = new TextEncoder().encode(SECRET_KEY);
        const { payload } = await jwtVerify(token, secretKey);
        console.log("Decoded Token:", payload);
    if (pathname === '/auth/login' || pathname === '/auth/signup') {
            return NextResponse.redirect(new URL('/', req.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.log("Invalid token, redirecting to login...");
        const response = NextResponse.redirect(new URL('/auth/login', req.url));
        response.cookies.delete("token"); 
        return response;
    }
}

export const config = {
    matcher: ['/', '/auth/signup', '/auth/login','/books','/members','/reports','/transactions'], // Updated matcher paths
};
