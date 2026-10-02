'use client';

import { Box, Flex, Skeleton, Stack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { Document, Page } from 'react-pdf';
import '../../../../lib/pdf-worker';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import type { InvoicePreview } from './useInvoicePreview';

/**
 * Aperçu d'une facture : première page du PDF rendu par le backend, à la largeur du conteneur.
 * Pendant un recalcul, l'aperçu précédent reste affiché (atténué) pour éviter les sauts.
 * En cas d'échec du backend, « Réessayer » relance la génération.
 */
export const InvoicePreviewPane = ({ url, loading, error, retry }: InvoicePreview) => {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!box.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Stack gap={2} width="full">
      <Flex justifyContent="space-between" alignItems="center">
        <BaseText variant={TextVariant.XS} color="fg.muted">
          Aperçu avec des données d’exemple
        </BaseText>
        <Flex alignItems="center" gap={2}>
          <BaseText variant={TextVariant.XS} color="fg.muted" role="status" aria-live="polite">
            {loading ? 'Mise à jour…' : error ? 'Aperçu indisponible' : ''}
          </BaseText>
          {error && url && !loading && (
            <BaseButton size="xs" variant="ghost" colorType="primary" onClick={retry}>
              <Icons.Refresh aria-hidden />
              Réessayer
            </BaseButton>
          )}
        </Flex>
      </Flex>
      <Box
        ref={box}
        rounded="7px"
        borderWidth="1px"
        borderColor="border"
        overflow="hidden"
        bg="white"
        opacity={loading && url ? 0.6 : 1}
        transition="opacity 200ms ease"
        aspectRatio={210 / 297}
      >
        {url && width > 0 ? (
          <Document file={url} loading={<Skeleton height="full" />} error=" ">
            <Page
              pageNumber={1}
              width={width}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        ) : error ? (
          <Stack height="full" alignItems="center" justifyContent="center" gap={3} p={6}>
            <BaseText variant={TextVariant.S} color="fg.muted" textAlign="center">
              L’aperçu n’a pas pu être généré. Le service est peut-être momentanément indisponible.
            </BaseText>
            <BaseButton size="sm" variant="outline" colorType="primary" onClick={retry}>
              <Icons.Refresh aria-hidden />
              Réessayer
            </BaseButton>
          </Stack>
        ) : (
          <Skeleton height="full" aria-label="Chargement de l’aperçu" />
        )}
      </Box>
    </Stack>
  );
};
