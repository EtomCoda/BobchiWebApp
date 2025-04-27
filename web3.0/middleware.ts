import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  const protectedRoutes = ['/order', '/profile'];
  const isProtectedRoute = protectedRoutes.some(
    (path) => req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to profile if already logged in and trying to access auth page
  if (session && req.nextUrl.pathname === '/auth') {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/profile';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/auth', '/order/:path*', '/profile/:path*'],
};