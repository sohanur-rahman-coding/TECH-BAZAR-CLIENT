import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Check better-auth session token in cookies
  // Better-auth session cookies are typically named "better-auth.session_token" or "__Secure-better-auth.session_token" in prod
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value || 
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const { pathname } = request.nextUrl;

  // Protect listing addition, management, and dashboard
  const isProtectedPath =
    pathname.startsWith("/dashboard/items/add") ||
    pathname.startsWith("/dashboard/items/manage") ||
    pathname.startsWith("/dashboard");

  if (isProtectedPath && !sessionToken) {
    // Redirect to signin page, preserving the original page as an redirect query parameter
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackURL", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Redirect /login to /signin for requirement alignment
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/items/add/:path*", "/dashboard/items/manage/:path*", "/dashboard/:path*", "/login"],
};
