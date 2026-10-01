'use client';

import { Field, NativeSelect, Stack, Textarea } from '@chakra-ui/react';
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

/** Questionnaire de départ vide : laissé tel quel, rien n'est envoyé. */
export const hasExitFeedback = (feedback: MODELS.IExitFeedback) =>
  !!feedback.reason || !!feedback.comment?.trim();

/**
 * Questionnaire de départ **facultatif**, sous l'impact d'une résiliation ou d'une fermeture.
 * Ne conditionne jamais la confirmation : le laisser vide revient à le passer.
 */
export const ExitFeedbackFields = ({
  value,
  onChange,
}: {
  value: MODELS.IExitFeedback;
  onChange: (value: MODELS.IExitFeedback) => void;
}) => (
  <Stack gap={3} width="full" pt={2} borderTopWidth="1px" borderColor="border">
    <Field.Root>
      <Field.Label>Pourquoi partez-vous ? (facultatif)</Field.Label>
      <NativeSelect.Root size="sm">
        <NativeSelect.Field
          value={value.reason ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              reason: (e.target.value || undefined) as MODELS.ExitFeedbackReason | undefined,
            })
          }
        >
          <option value="">Choisir une raison</option>
          {EXIT_FEEDBACK_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Field.Root>
    <Field.Root>
      <Field.Label>Un mot pour nous aider à nous améliorer ? (facultatif)</Field.Label>
      <Textarea
        size="sm"
        rows={3}
        maxLength={1000}
        value={value.comment ?? ''}
        onChange={(e) => onChange({ ...value, comment: e.target.value })}
      />
      <Field.HelperText>Vos réponses ne changent rien à la suite.</Field.HelperText>
    </Field.Root>
  </Stack>
);
