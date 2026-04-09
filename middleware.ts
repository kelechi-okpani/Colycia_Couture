import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. Get the token
  // Use secureCookie: true on production to ensure it finds the __Secure- token
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production", 
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

  // If page is protected and no token exists, redirect to login
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    // Optional: Add callbackUrl so user returns here after login
    loginUrl.searchParams.set('callbackUrl', path); 
    return NextResponse.redirect(loginUrl);
  }

  // 4. AUTH PAGE PROTECTION (Optional but recommended)
  // If user is ALREADY logged in, don't let them see the login page
  if (path.startsWith('/auth/login') && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/api/:path*', 
    '/checkout/:path*', 
    '/profile/:path*',
    '/orders/:path*',
    '/auth/login' // Added this to handle the "already logged in" check
  ],
};

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;
  
//   // 1. Get the token using NextAuth helper
//   // This automatically handles __Secure- prefix in production
//   const token = await getToken({ 
//     req: request, 
//     secret: process.env.NEXTAUTH_SECRET 
//   });

//   // 2. PROTECT API ROUTES
//   if (path.startsWith('/api')) {
//     const publicApiEndpoints = [
//       '/api/shop', 
//       '/api/auth', 
//       '/api/signup', 
//       '/api/login', 
//       '/api/forgot-password', 
//       '/api/reset-password', 
//       '/api/cart'
//     ];
    
//     const isPublicApi = publicApiEndpoints.some(api => path.startsWith(api));

//     if (!isPublicApi && !token) {
//       return NextResponse.json(
//         { error: "Authentication required" }, 
//         { status: 401 }
//       );
//     }
//   }

//   // 3. PROTECT FRONTEND PAGES
//   const protectedPages = ['/checkout', '/profile', '/orders'];
//   const isProtectedPage = protectedPages.some(page => path.startsWith(page));

//   if (isProtectedPage && !token) {
//     const loginUrl = new URL('/auth/login', request.url);
//     // loginUrl.searchParams.set('callbackUrl', path); 
//     return NextResponse.redirect(loginUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/api/:path*', 
//     '/checkout/:path*', 
//     '/profile/:path*',
//     '/orders/:path*'
//   ],
// };