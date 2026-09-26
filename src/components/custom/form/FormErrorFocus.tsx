'use client';

import { useEffect } from 'react';
import { useFormikContext } from 'formik';

/**
 * À placer dans un <Formik> : après une soumission invalide, fait défiler la page
 * jusqu'au premier champ en erreur (les champs Chakra invalides portent `data-invalid`).
 */
export const FormErrorFocus = () => {
  const { submitCount, isSubmitting, isValid } = useFormikContext();

  useEffect(() => {
    if (!submitCount || isSubmitting || isValid) return;

    // Attend le rendu des messages d'erreur avant de chercher le premier champ invalide
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('[data-invalid]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(frame);
    // Uniquement à la fin de chaque tentative de soumission
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, isSubmitting]);

  return null;
};
