import { NextResponse, NextRequest } from "next/server";
import { APP_ROUTES, ROOT_URL } from "_config/routes";

const PROTECTED_ROUTES = [ROOT_URL.DASHBOARD, `${ROOT_URL.DASHBOARD}/profile`];
const RESET_PASSWORD_ROUTE = APP_ROUTES.AUTH.RESET_PASSWORD_VALIDATE;
const TOTP_ROUTE = APP_ROUTES.AUTH._2FA;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const totpCookie = request.cookies.get("better-auth.two_factor");

  /**
   * 🔐 PROTECTION RESET PASSWORD (token dans l'URL)
   */
  if (pathname === RESET_PASSWORD_ROUTE) {
    const token = searchParams.get("token");

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = APP_ROUTES.AUTH.SIGN_IN;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  /**
   * 🔐 PROTECTED ROUTES (session)
   */
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!sessionCookie && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.PROTECTED;
    return NextResponse.redirect(url);
  }

  /**
   * 🔐 TOTP FLOW
   */
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
  matcher: [
    `/modules/dashboard/:path*`,
    `/auth/signin/totp`,
    `/auth/forget-pass/validate`,
  ],
};
