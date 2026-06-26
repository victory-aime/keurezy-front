// app/api/auth/[...all]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BACKEND_URL = process.env.API_BACKEND_URL!;

async function handler(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname + req.nextUrl.search;
  const backendUrl = `${BACKEND_URL}${path}`;

  const hasBody = !['GET', 'HEAD'].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const forwardHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!['host', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
      forwardHeaders.set(key, value);
    }
  });

  const backendRes = await fetch(backendUrl, {
    method: req.method,
    headers: forwardHeaders,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  backendRes.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (['transfer-encoding', 'connection', 'content-encoding', 'content-length'].includes(k)) {
      return;
    }
    responseHeaders.set(key, value);
  });

  // ✅ Supprime Domain= pour que le cookie soit set sur le domaine frontend
  const setCookies = backendRes.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    responseHeaders.delete('set-cookie');
    setCookies.forEach((cookie) => {
      const cleaned = cookie
        .replace(/;\s*Domain=[^;]+/gi, '') // retire Domain=.onrender.com
        .replace(/;\s*SameSite=None/gi, '; SameSite=Lax'); // same-origin = Lax suffit
      responseHeaders.append('set-cookie', cleaned);
    });
  }

  return new NextResponse(backendRes.status === 204 ? null : backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
