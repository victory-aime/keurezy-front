import { NextResponse, NextRequest } from "next/server";
import { APP_ROUTES } from "_config/routes";
import { UserRole } from "./types/enum";
import { DASHBOARD_ROUTES } from "./app/dashboard/routes";
import { USERS_ROUTES } from "./app/layout/routes";
import { getCookieCache, getSessionCookie } from "better-auth/cookies";

/**
 * Liste des routes protégées et des rôles autorisés pour chacune.
 */
const PROTECTED_ROUTES: Record<string, string[]> = {
  ...Object.fromEntries(
    Object.values(DASHBOARD_ROUTES).map((route) => [
      route,
      [UserRole.IMMO_OWNER],
    ]),
  ),
  ...Object.fromEntries(
    Object.values(USERS_ROUTES).map((route) => [route, [UserRole.USER]]),
  ),
  [`${APP_ROUTES.BO}`]: [UserRole.ADMIN],
};
const RESET_PASSWORD_ROUTE = APP_ROUTES.AUTH.RESET_PASSWORD_VALIDATE;
const CREATE_AGENCY_ROUTE = APP_ROUTES.AUTH.REGISTER_AGENCY;
const TOTP_ROUTE = APP_ROUTES.AUTH._2FA;

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const sessionCookie = getSessionCookie(request);
  const totpCookie = request.cookies.get("better-auth.two_factor");
  const session = await getCookieCache(request);

  // 🔐 RESET PASSWORD
  if (pathname === RESET_PASSWORD_ROUTE && !searchParams.get("token")) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.AUTH.SIGN_IN;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // 🔐 CREATE AGENCY
  if (pathname === CREATE_AGENCY_ROUTE && !searchParams.get("token")) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.AUTH.SIGN_UP;
    url.search = "";
    return NextResponse.redirect(url);
  }

  /**
   * 🔐 PROTECTED ROUTES (session)
   */
  const matchedRoute = Object.keys(PROTECTED_ROUTES).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  if (matchedRoute) {
    const userRole: string = session?.user?.role;

    console.log("session", session?.user?.role);
    console.log("session cookies", sessionCookie);
    console.log(
      "route access",
      PROTECTED_ROUTES[matchedRoute].includes(userRole),
    );

    if (
      !sessionCookie ||
      !session ||
      !userRole ||
      !PROTECTED_ROUTES[matchedRoute].includes(userRole)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = APP_ROUTES.PROTECTED;
      return NextResponse.redirect(url);
    }
  }

  /**
   * 🔐 TOTP FLOW
   */
  if (totpCookie && pathname !== TOTP_ROUTE) {
    const url = request.nextUrl.clone();
    url.pathname = TOTP_ROUTE;
    return NextResponse.redirect(url);
  }
  if (pathname === TOTP_ROUTE && !totpCookie) {
    const url = request.nextUrl.clone();
    url.pathname = APP_ROUTES.REDIRECT;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    `/dashboard/:path*`,
    `/appartements/:path*`,
    `/auth/signin/totp`,
    `/auth/forget-pass/validate`,
    `/auth/register-agency/:path*`,
    `/properties/apply/:path*`,
  ],
};
