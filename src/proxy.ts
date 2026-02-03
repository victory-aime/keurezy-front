import { NextResponse, NextRequest } from "next/server";
import { APP_ROUTES } from "_config/routes";

const PROTECTED_ROUTES = ["/modules/dashboard", "/modules/dashboard/profile"];
const TOTP_ROUTE = "/auth/signin/totp";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const totpCookie = request.cookies.get("better-auth.two_factor");

  if (!sessionCookie && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.PROTECTED;

    return NextResponse.redirect(url);
  }

  if (sessionCookie && totpCookie && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = TOTP_ROUTE;
    return NextResponse.redirect(url);
  }

  if (pathname === TOTP_ROUTE && !totpCookie) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.HOME;
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
  matcher: ["/modules/dashboard/:path*", "/auth/signin/totp"],
};
