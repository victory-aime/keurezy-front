import { Stack } from '@chakra-ui/react';
import { BaseText, TextVariant } from '_components/custom';
import { Checkbox } from '_components/ui/checkbox';
import { MODELS } from '_types/*';
import { FEATURE_LABELS } from '_utils/subscription';

type Excess = MODELS.ISubscriptionQuote['excess'][number];

/** « 1 collaborateur », « 3 biens immobiliers » */
const countLabel = (feature: string, count: number) => {
  const config = FEATURE_LABELS[feature.toUpperCase()];
  const noun = count === 1 ? config?.singular : config?.plural;
  return `${count} ${noun ?? feature}`;
};

interface KeepSelectionProps {
  excess: Excess[];
  keep: Record<string, string[]>;
  onChange: (keep: Record<string, string[]>) => void;
  /** « le 30 octobre 2026 » ou « au paiement » */
  effectiveLabel: string;
}

/**
 * Choix de ce qui reste actif quand le plan visé est plus petit que l'usage. Une liste à cocher
 * par fonctionnalité en surplus, avec compteur en direct ; une fois la limite atteinte, les autres
 * cases sont désactivées. Le backend revérifie le choix.
 */
export const KeepSelection = ({ excess, keep, onChange, effectiveLabel }: KeepSelectionProps) => (
  <Stack gap={5}>
    <BaseText variant={TextVariant.S} color="fg.muted">
      Votre usage dépasse les limites de ce plan. Choisissez ce qui reste actif : le reste sera
      désactivé {effectiveLabel}. Rien n’est supprimé, et vous pourrez réactiver un élément plus
      tard dans la limite de votre plan.
    </BaseText>
    {excess.map(({ feature, limit, used, items }) => {
      const chosen = keep[feature] ?? [];
      const full = chosen.length >= limit;
      const toggle = (id: string, checked: boolean) =>
        onChange({
          ...keep,
          [feature]: checked ? [...chosen, id] : chosen.filter((value) => value !== id),
        });
      return (
        <Stack key={feature} gap={2} as="fieldset">
          <BaseText as="legend" variant={TextVariant.M} fontWeight="semibold">
            Gardez {countLabel(feature, limit)} sur {used}
          </BaseText>
          <BaseText variant={TextVariant.XS} color="fg.muted" aria-live="polite">
            {chosen.length} / {limit} sélectionné{chosen.length > 1 ? 's' : ''}
          </BaseText>
          {chosen.length > limit && (
            <BaseText role="alert" variant={TextVariant.XS} color="fg.error">
              Retirez {chosen.length - limit} élément{chosen.length - limit > 1 ? 's' : ''} pour
              rester dans la limite.
            </BaseText>
          )}
          <Stack gap={2} pl={1}>
            {items.map((item) => {
              const checked = chosen.includes(item.id);
              return (
                <Checkbox
                  key={item.id}
                  checked={checked}
                  disabled={!checked && full}
                  onCheckedChange={(e) => toggle(item.id, !!e.checked)}
                >
                  {item.label}
                </Checkbox>
              );
            })}
          </Stack>
        </Stack>
      );
    })}
  </Stack>
);
