import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Export the middleware function as default
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // For admin routes, we'll let the client-side handle role verification
    // since we need to make API calls to verify admin status
    return NextResponse.next();
  }
  
  // For auth routes, allow access
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

// Export the config
export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
  ],
}; 