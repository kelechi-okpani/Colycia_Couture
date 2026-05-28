import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  console.log(token, "token.....")
  /**
   * Protected Routes
   */
  const protectedRoutes = ['/profile', '/checkout', '/orders'];
  const adminRoutes = ['/admin'];

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    path.startsWith(route)
  );

  /**
   * User Protected Pages
   */
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    );
  }

  /**
   * Admin Protection
   */
  if (isAdminRoute) {
    // Not logged in
    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/login', request.url)
      );
    }

    // Not admin
    if ((token as any).role !== 'admin') {
      return NextResponse.redirect(
        new URL('/profile', request.url)
      );
    }
  }

  /**
   * Prevent logged in users from seeing login page
   */
  if (path.startsWith('/auth/login') && token) {

    // Redirect admins differently
    if ((token as any).role === 'admin') {
      return NextResponse.redirect(
        new URL('/admin', request.url)
      );
    }

    return NextResponse.redirect(
      new URL('/profile', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/admin/:path*',
    '/auth/login',
  ],
};


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   // PUBLIC API ROUTES
//   if (pathname.startsWith("/api")) {
//     const publicApiEndpoints = [
//       "/api/shop",
//       "/api/auth",
//       "/api/signup",
//       "/api/login",
//       "/api/forgot-password",
//       "/api/reset-password",
//       "/api/cart",
//     ];

//     const isPublicApi = publicApiEndpoints.some((api) =>
//       pathname.startsWith(api)
//     );

//     if (!isPublicApi && !token) {
//       return NextResponse.json(
//         { error: "Authentication required" },
//         { status: 401 }
//       );
//     }
//   }

//   // PROTECTED PAGES
//   const protectedRoutes = ["/checkout", "/profile", "/orders", "/admin"];
  

  
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (isProtectedRoute && !token) {
//     const loginUrl = new URL("/auth/login", request.url);

//     loginUrl.searchParams.set("callbackUrl", pathname);

//     return NextResponse.redirect(loginUrl);
//   }

//   // ALREADY LOGGED IN → BLOCK LOGIN PAGE
//   if (pathname === "/auth/login" && token) {
//     return NextResponse.redirect(new URL("/profile", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/api/:path*",
//     "/checkout/:path*",
//     "/profile/:path*",
//     "/orders/:path*",
//     "/auth/login",
//   ],
// };
