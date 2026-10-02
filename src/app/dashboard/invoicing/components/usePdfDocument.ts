'use client';

import { useCallback, useEffect, useState } from 'react';

interface PdfState {
  url: string | null;
  loading: boolean;
  error: boolean;
}

export interface PdfDocument extends PdfState {
  /** Relance la génération (après une erreur du backend) */
  retry: () => void;
}

/**
 * PDF rendu par le backend, chargé en blob (même origine : le cookie de session part avec).
 * `body` présent : POST JSON, sinon GET. Rechargé 500 ms après le dernier changement de la
 * requête ; la précédente est annulée et l'URL du PDF précédent libérée. Pendant un
 * rechargement, le PDF précédent reste disponible.
 */
export function usePdfDocument(
  request: { url: string; body?: unknown } | null,
  enabled = true,
): PdfDocument {
  const [state, setState] = useState<PdfState>({ url: null, loading: false, error: false });
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const key = request ? `${request.url}|${JSON.stringify(request.body ?? null)}` : '';

  useEffect(() => {
    if (!enabled || !request) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: false }));
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(request.url, {
          method: request.body === undefined ? 'GET' : 'POST',
          credentials: 'same-origin',
          headers: request.body === undefined ? undefined : { 'Content-Type': 'application/json' },
          body: request.body === undefined ? undefined : JSON.stringify(request.body),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(String(response.status));
        const url = URL.createObjectURL(await response.blob());
        setState({ url, loading: false, error: false });
      } catch {
        if (!controller.signal.aborted) setState((s) => ({ ...s, loading: false, error: true }));
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // `key` résume la requête : pas de relance à chaque rendu
  }, [key, enabled, attempt]);

  // Libère chaque PDF quand il est remplacé, et le dernier au démontage
  useEffect(() => () => void (state.url && URL.revokeObjectURL(state.url)), [state.url]);

  return { ...state, retry };
}
