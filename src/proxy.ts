import { NextResponse, NextRequest } from 'next/server';
import { APP_ROUTES } from '_config/routes';
import { UserRole } from './types/enum';
import { DASHBOARD_ROUTES } from './app/dashboard/routes';
import { getCookieCache, getSessionCookie } from 'better-auth/cookies';

const PROTECTED_ROUTES: Record<string, string[]> = {
  ...Object.fromEntries(
    Object.values(DASHBOARD_ROUTES).map((route) => [
      route,
      [UserRole.OWNER, UserRole.AGENCY_ADMIN, UserRole.AGENT],
    ]),
  ),
};

const PROTECTED_PREFIXES = Object.keys(PROTECTED_ROUTES);
const RESET_PASSWORD_ROUTE = APP_ROUTES.AUTH.RESET_PASSWORD_VALIDATE;
const TOTP_ROUTE = APP_ROUTES.AUTH._2FA;

/**
 * Tente de lire le rôle depuis le cookie cache (compact).
 * Retourne null si le cache est absent ou expiré.
 * Aucun appel réseau.
 */
async function getRoleFromCookieCache(request: NextRequest): Promise<string | null> {
  try {
    const cached = await getCookieCache(request);
    return (cached?.user?.role as string) ?? null;
  } catch {
    return null;
  }
}

/**
 * Fallback : appel réseau vers better-auth.
 * Utilisé uniquement si le cookie cache est absent/invalide.
 */
async function getRoleFromSession(): Promise<string | null> {
  try {
    const { authClient } = await import('./app/lib/auth-client');
    const { headers } = await import('next/headers');

    // Timeout de sécurité : évite de bloquer le middleware indéfiniment
    const sessionPromise = authClient.getSession({
      fetchOptions: { headers: await headers() },
    });

    const timeoutPromise = new Promise<null>(
      (resolve) => setTimeout(() => resolve(null), 3000), // 3s max
    );

    const session = await Promise.race([sessionPromise, timeoutPromise]);

    console.log('session callback', session);
    return (session?.data?.user?.role as string) ?? null;
  } catch {
    return null;
  }
}

function redirectTo(request: NextRequest, pathname: string, clearSearch = false) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  if (clearSearch) url.search = '';
  return NextResponse.redirect(url);
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 🔐 Reset password sans token
  if (pathname === RESET_PASSWORD_ROUTE && !searchParams.get('token')) {
    return redirectTo(request, APP_ROUTES.AUTH.SIGN_IN, true);
  }

  const sessionCookie = getSessionCookie(request);

  console.log('sessionCookies', sessionCookie);

  const totpCookie =
    request.cookies.get('__Secure-better-auth.two_factor') ??
    request.cookies.get('better-auth.two_factor');

  // 🔐 TOTP — lecture cookie uniquement, pas de réseau
  if (totpCookie && pathname !== TOTP_ROUTE) {
    return redirectTo(request, TOTP_ROUTE);
  }
  if (pathname === TOTP_ROUTE && !totpCookie) {
    return redirectTo(request, APP_ROUTES.REDIRECT);
  }

  // 🔐 Routes protégées
  const matchedRoute = PROTECTED_PREFIXES.find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (matchedRoute) {
    // Pas de cookie de session = redirect immédiat, pas d'appel réseau
    if (!sessionCookie) {
      return redirectTo(request, APP_ROUTES.PROTECTED);
    }

    // ✅ Étape 1 : lire le rôle depuis le cookie cache (compact, sans réseau)
    let userRole = await getRoleFromCookieCache(request);

    console.log('user role', userRole);

    // ✅ Étape 2 : fallback réseau si le cache est absent ou a crashé
    if (!userRole) {
      userRole = await getRoleFromSession();
    }

    if (!userRole || !PROTECTED_ROUTES[matchedRoute].includes(userRole)) {
      return redirectTo(request, APP_ROUTES.PROTECTED);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin/totp', '/auth/forget-pass/validate'],
};
