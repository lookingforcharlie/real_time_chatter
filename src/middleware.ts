// The user makes a request to login page, middleware will check if the user already login or not.
// If user already login, user will see /dashboard as opposed to /login

// Next gives us the method we can use for creating a middleware
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Manage route protection
    // To see if the user is authenticated
    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith('/login');

    // make is extendable
    const sensitiveRoutes = ['/dashboard'];
    // isAccessingSensitiveRoute is a boolean
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // if the user is accessing the /login page
    if (isLoginPage) {
      if (isAuth) {
        // req.url is localhost:3000 here
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      // If no auth, Pass the middleware, go to /login page
      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      // if user is not trying to access login page, but sensitive page, and the user is not authenticated, it should go to the login page directly
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  },
  {
    // this is a workaround for handling redirects on off Pages
    // it returns true so that the middleware function above is always called
    // Without callbacks here, we would get an infinite redirect ?????
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  // any path under /dashboard
  matcher: ['/', '/login', '/dashboard/:path*'],
};
