'use client';

import { useCallback, useEffect, useState } from 'react';
import { MODELS } from '_types/*';
import { invoicePreviewUrl } from '_utils/invoice-template';

interface PreviewState {
  url: string | null;
  loading: boolean;
  error: boolean;
}

export interface InvoicePreview extends PreviewState {
  /** Relance la génération (après une erreur du backend) */
  retry: () => void;
}

/**
 * Aperçu PDF d'une configuration, rendu par le backend (même moteur que les factures émises).
 * Recalculé 500 ms après la dernière modification ; la requête précédente est annulée et l'URL
 * du PDF précédent libérée. `retry` relance la même configuration après une erreur.
 */
export function useInvoicePreview(
  agencyId: string,
  config: MODELS.IInvoiceTemplateConfig | null,
  enabled = true,
): InvoicePreview {
  const [state, setState] = useState<PreviewState>({ url: null, loading: false, error: false });
  const key = JSON.stringify(config);
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    if (!enabled || !config || !agencyId) return;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: false }));
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(invoicePreviewUrl(agencyId), {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config }),
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
    // `key` résume la configuration : pas de relance à chaque rendu
  }, [agencyId, key, enabled, attempt]);

  // Libère chaque PDF quand il est remplacé, et le dernier à la fermeture
  useEffect(() => () => void (state.url && URL.revokeObjectURL(state.url)), [state.url]);

  return { ...state, retry };
}
