// _hooks/get-server-session.ts

// ✅ Appel direct backend — serveur à serveur, pas de loopback
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export const safeGetServerSession = async (options?: {
  fetchOptions?: { headers?: ReadonlyHeaders | Headers };
}) => {
  try {
    const requestHeaders = options?.fetchOptions?.headers;
    const cookieHeader = requestHeaders?.get('cookie') ?? '';

    if (!cookieHeader) return { data: null, error: null };

    const res = await fetch(`${process.env.API_BACKEND_URL}/api/auth/get-session`, {
      method: 'GET',
      headers: {
        cookie: cookieHeader,
        'content-type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) return { data: null, error: `HTTP ${res.status}` };

    // ✅ Parse explicitement — res.json() pas res.text()
    const data = await res.json();
    if (!data?.user) return { data: null, error: null };

    return { data, error: null }; // data est maintenant un objet ✅
  } catch (error) {
    return { data: null, error: 'SERVER_UNREACHABLE' };
  }
};
