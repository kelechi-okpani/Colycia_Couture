import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. Get the token using NextAuth helper
  // This automatically handles __Secure- prefix in production
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 2. PROTECT API ROUTES
  if (path.startsWith('/api')) {
    const publicApiEndpoints = [
      '/api/shop', 
      '/api/auth', 
      '/api/signup', 
      '/api/login', 
      '/api/forgot-password', 
      '/api/reset-password', 
      '/api/cart'
    ];
    
    const isPublicApi = publicApiEndpoints.some(api => path.startsWith(api));

    if (!isPublicApi && !token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      );
    }
  }

  // 3. PROTECT FRONTEND PAGES
  const protectedPages = ['/checkout', '/profile', '/orders'];
  const isProtectedPage = protectedPages.some(page => path.startsWith(page));

  if (isProtectedPage && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // loginUrl.searchParams.set('callbackUrl', path); 
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*', 
    '/checkout/:path*', 
    '/profile/:path*',
    '/orders/:path*'
  ],
};