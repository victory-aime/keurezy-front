'use client';

import { createListCollection, Stack } from '@chakra-ui/react';
import { FormSelect, FormTextArea } from '_components/custom';
import { useFormikContext } from 'formik';
import { MODELS } from '_types/*';

/** Raisons proposées (décisions du 2026-10-01). */
export const EXIT_FEEDBACK_REASONS: { value: MODELS.ExitFeedbackReason; label: string }[] = [
  { value: 'TOO_EXPENSIVE', label: 'Trop cher' },
  { value: 'MISSING_FEATURES', label: 'Il manque des fonctionnalités' },
  { value: 'LOW_USAGE', label: 'Je n’utilise pas assez la plateforme' },
  { value: 'SWITCHING_TOOL', label: 'Je passe à un autre outil' },
  { value: 'TECHNICAL_ISSUE', label: 'Problème technique' },
  { value: 'BUSINESS_CLOSING', label: 'Fermeture de l’activité' },
  { value: 'OTHER', label: 'Autre' },
];
const REASON_LIST = createListCollection({ items: EXIT_FEEDBACK_REASONS });

/** Champs du questionnaire dans le formulaire Formik parent. */
export interface ExitFeedbackValues {
  reason: string[];
  comment: string;
}
export const EXIT_FEEDBACK_INITIAL: ExitFeedbackValues = { reason: [], comment: '' };

/** Réponses à envoyer ; questionnaire laissé vide : rien (`undefined`). */
export const toExitFeedback = ({
  reason,
  comment,
}: ExitFeedbackValues): MODELS.IExitFeedback | undefined => {
  const feedback = {
    reason: reason[0] as MODELS.ExitFeedbackReason | undefined,
    comment: comment.trim() || undefined,
  };
  return feedback.reason || feedback.comment ? feedback : undefined;
};

/**
 * Questionnaire de départ **facultatif**, sous l'impact d'une résiliation ou d'une fermeture,
 * dans un formulaire Formik (`reason`, `comment`). Ne conditionne jamais la confirmation : le
 * laisser vide revient à le passer.
 */
export const ExitFeedbackFields = () => {
  const { setFieldValue } = useFormikContext<ExitFeedbackValues>();
  return (
    <Stack gap={3} width="full" pt={2} borderTopWidth="1px" borderColor="border">
      <FormSelect
        name="reason"
        label="Pourquoi partez-vous ? (facultatif)"
        placeholder="Choisir une raison"
        listItems={REASON_LIST}
        setFieldValue={setFieldValue}
      />
      <FormTextArea
        name="comment"
        label="Un mot pour nous aider à nous améliorer ? (facultatif)"
        helperMessage="Vos réponses ne changent rien à la suite."
        maxCharacters={1000}
      />
    </Stack>
  );
};
