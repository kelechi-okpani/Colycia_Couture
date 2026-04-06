import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('next-auth.session-token');

  // 1. PROTECT API ROUTES (Return JSON)
  const isAdminApi = path.startsWith('/api/admin');
  if (isAdminApi && !token) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  // 2. PROTECT FRONTEND PAGES (Redirect to Login)
  // Add '/checkout' and '/profile' or any other restricted pages here
  const protectedPages = ['/checkout', '/profile'];
  const isProtectedPage = protectedPages.some(page => path.startsWith(page));

  if (isProtectedPage && !token) {
    // Redirect them to login, and add a 'callbackUrl' so they return to checkout after logging in
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path); 
    
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Ensure the matcher includes your frontend pages
export const config = {
  matcher: [
    '/api/admin/:path*', 
    '/api/user/:path*', 
    '/checkout', 
    '/profile/:path*'
  ],
};