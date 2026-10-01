'use client';

import { useEffect, useState } from 'react';
import { MODELS } from '_types/*';
import { invoicePreviewUrl } from '_utils/invoice-template';

interface PreviewState {
  url: string | null;
  loading: boolean;
  error: boolean;
}

/**
 * Aperçu PDF d'une configuration, rendu par le backend (même moteur que les factures émises).
 * Recalculé 500 ms après la dernière modification ; la requête précédente est annulée et l'URL
 * du PDF précédent libérée.
 */
export function useInvoicePreview(
  agencyId: string,
  config: MODELS.IInvoiceTemplateConfig | null,
  enabled = true,
): PreviewState {
  const [state, setState] = useState<PreviewState>({ url: null, loading: false, error: false });
  const key = JSON.stringify(config);

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
  }, [agencyId, key, enabled]);

  // Libère chaque PDF quand il est remplacé, et le dernier à la fermeture
  useEffect(() => () => void (state.url && URL.revokeObjectURL(state.url)), [state.url]);

  return state;
}
