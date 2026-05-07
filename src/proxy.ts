import { NextResponse, NextRequest } from 'next/server';
import { APP_ROUTES } from '_config/routes';
import { UserRole } from './types/enum';
import { DASHBOARD_ROUTES } from './app/dashboard/routes';

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

// ─────────────────────────────────────────
// Cookie names — Better-Auth préfixe avec __Secure- en HTTPS
// ─────────────────────────────────────────
const SESSION_COOKIE_NAMES = [
  '__Secure-better-auth.session_token',
  'better-auth.session_token',
];

const TOTP_COOKIE_NAMES = [
  '__Secure-better-auth.two_factor',
  'better-auth.two_factor',
];

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function redirectTo(request: NextRequest, pathname: string, clearSearch = false) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  if (clearSearch) url.search = '';
  return NextResponse.redirect(url);
}

/**
 * Récupère le token de session brut depuis les cookies parsés (décodés).
 * Gère les deux variantes : __Secure- (HTTPS) et plain (HTTP).
 */
function getSessionToken(request: NextRequest): string | null {
  for (const name of SESSION_COOKIE_NAMES) {
    const value = request.cookies.get(name)?.value;
    if (value) return value;
  }
  return null;
}

function getTotpCookie(request: NextRequest) {
  for (const name of TOTP_COOKIE_NAMES) {
    const value = request.cookies.get(name);
    if (value) return value;
  }
  return null;
}

/**
 * Reconstruit le header Cookie depuis les valeurs décodées par Next.js.
 *
 * ⚠️ NE PAS utiliser request.headers.get('cookie') :
 *    → les valeurs sont percent-encodées (%2F, %3D)
 *    → Better-Auth rejette le token silencieusement (data: null, error: null)
 *
 * request.cookies.getAll() retourne les valeurs déjà décodées ✅
 */
function buildCookieHeader(request: NextRequest): string {
  return request.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');
}

/**
 * Résout l'URL du backend selon l'environnement.
 * En Edge middleware, seules les variables sans NEXT_PUBLIC_ définies
 * dans next.config sont garanties disponibles.
 */
function resolveBackendUrl(): string {
  const url =
      process.env.API_BACKEND_URL ??        // ← variable serveur (recommandé)
      process.env.NEXT_PUBLIC_API_URL ?? // ← fallback public
      '';

  if (!url) {
    throw new Error("[proxy] BACKEND_URL non défini — vérifie tes variables d'environnement");
  }

  return url.replace(/\/$/, ''); // supprime le slash final si présent
}

// ─────────────────────────────────────────
// SESSION — fetch direct vers Better-Auth
// ─────────────────────────────────────────
interface BetterAuthSession {
  user: {
    id: string;
    role: string;
    email: string;
    emailVerified: boolean;
    [key: string]: unknown;
  };
  session: {
    id: string;
    token: string;
    expiresAt: string;
    permissions: unknown[];
    [key: string]: unknown;
  };
}

async function getSession(request: NextRequest): Promise<BetterAuthSession | null> {
  const token = getSessionToken(request);

  // Pas de token → pas la peine d'appeler le backend
  if (!token) {
    //console.log('[proxy] Aucun session token trouvé dans les cookies');
    return null;
  }

  const cookieHeader = buildCookieHeader(request);
  const backendUrl = resolveBackendUrl();
  const endpoint = `${backendUrl}/api/auth/get-session`;

  //console.log('[proxy] token:', token.substring(0, 20) + '...');
  //console.log('[proxy] endpoint:', endpoint);

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
        'content-type': 'application/json',
      },
      cache: 'no-store', // indispensable en middleware — jamais de cache
    });

    //console.log('[proxy] status:', res.status);

    if (!res.ok) {
      //console.error('[proxy] Réponse non-ok:', res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    //console.log('[proxy] session user:', json?.user?.email ?? 'null');

    // Better-Auth retourne null directement si session invalide
    if (!json || !json.user) return null;

    return json as BetterAuthSession;
  } catch (e) {
    console.error('[proxy] Erreur fetch session:', e);
    return null;
  }
}

// ─────────────────────────────────────────
// MIDDLEWARE PRINCIPAL
// ─────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  // console.log('[env] BACKEND_URL:', process.env.API_BACKEND_URL);
  // console.log('[env] NODE_ENV:', process.env.NODE_ENV);

  // 🔐 Reset password sans token → signin
  if (pathname === RESET_PASSWORD_ROUTE && !searchParams.get('token')) {
    return redirectTo(request, APP_ROUTES.AUTH.SIGN_IN, true);
  }

  // 🔐 TOTP — lecture cookie uniquement, pas de fetch réseau
  const totpCookie = getTotpCookie(request);

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
    const session = await getSession(request);

    if (!session?.user) {
      console.log('[proxy] Session invalide → redirection not-authenticated');
      return redirectTo(request, APP_ROUTES.PROTECTED);
    }

    const userRole = session.user.role as UserRole;

    if (!PROTECTED_ROUTES[matchedRoute].includes(userRole)) {
      console.log('[proxy] Rôle non autorisé:', userRole);
      return redirectTo(request, APP_ROUTES.PROTECTED);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin/totp', '/auth/forget-pass/validate'],
};