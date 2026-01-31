import { NextResponse, NextRequest } from "next/server";
import { APP_ROUTES } from "_config/routes";

const PROTECTED_ROUTES = ["/modules/dashboard", "/modules/dashboard/profile"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("better-auth.session_token");

  if (!sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.AUTH.SIGN_IN;

    return NextResponse.redirect(url);
  }
  /**
   * Ici, le middleware agit comme un proxy :
   * soit tu laisses passer
   * soit tu rediriges / bloques
   */
  return NextResponse.next();
}

export const config = {
  matcher: ["/modules/dashboard/:path*"],
};
