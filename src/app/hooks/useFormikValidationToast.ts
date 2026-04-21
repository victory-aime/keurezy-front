import { useFormikContext } from 'formik';
import { useCallback } from 'react';
import { flattenErrors } from '../helpers/flatten-errors';
import { BaseToast, ToastStatus } from '_components/custom';

/**
 * Hook réutilisable qui valide le formulaire Formik
 * et affiche un toast détaillé listant les champs manquants/invalides.
 *
 * @example
 * const { validateAndSubmit } = useFormikValidationToast();
 *
 * <button onClick={() => validateAndSubmit(handleSubmit)}>
 *   Soumettre
 * </button>
 */
export const useFormikValidationToast = () => {
  const { validateForm, setTouched, errors, values } = useFormikContext();
  const TOAST_ID = 'formik-validation-toast';

  const validateAndSubmit = useCallback(
    async (handleSubmit: () => void) => {
      // 1. Déclenche la validation complète du formulaire
      const validationErrors = await validateForm(values);

      // 2. Marque tous les champs comme touchés pour afficher les erreurs inline
      const touchedFields = Object.keys(validationErrors).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {},
      );
      await setTouched(touchedFields, false);

      // 3. S'il n'y a pas d'erreurs → soumet le formulaire
      if (Object.keys(validationErrors).length === 0) {
        handleSubmit();
        return;
      }

      // 4. Construit la liste des messages d'erreur
      const errorMessages = flattenErrors(validationErrors as Record<string, unknown>);

      // 5. Affiche le toast d'erreur
      BaseToast({
        id: TOAST_ID,
        title: `${errorMessages.length} champ${errorMessages.length > 1 ? 's' : ''} requis`,
        description: errorMessages.join('\n'),
        type: ToastStatus.WARNING,
      });
    },
    [validateForm, setTouched, values, errors],
  );

  return { validateAndSubmit };
};
