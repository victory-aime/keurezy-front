import { Box, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import type { ReactNode } from 'react';
import { BaseFormatNumber, BaseText, Icons, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import {
  FEATURE_LABELS,
  formatFeatureLimit,
  formatLongDate,
  planDifferences,
  type PlanFeatureLimit,
} from '_utils/subscription';
import { DifferenceChip } from './PlanChooser';

/** Une colonne « aujourd'hui » ou « après » : plan, prix, limites. */
const PlanColumn = ({
  eyebrow,
  name,
  price,
  limits,
  highlight,
}: {
  eyebrow: string;
  name: string;
  price: ReactNode;
  limits: PlanFeatureLimit[];
  highlight?: boolean;
}) => (
  <Stack
    gap={3}
    p={5}
    rounded="7px"
    borderWidth="1px"
    borderColor={highlight ? 'primary.500' : 'border'}
    bg={highlight ? 'primary.500/5' : 'bg.subtle'}
    height="full"
  >
    <BaseText
      variant={TextVariant.XS}
      color="fg.muted"
      textTransform="uppercase"
      letterSpacing="wide"
    >
      {eyebrow}
    </BaseText>
    <BaseText variant={TextVariant.L} fontWeight="semibold">
      {name}
    </BaseText>
    <BaseText variant={TextVariant.M} fontWeight="semibold">
      {price}
    </BaseText>
    <Stack as="ul" gap={1.5} listStyleType="none">
      {limits
        .map((f) => formatFeatureLimit(f.name, f.limit))
        .filter(Boolean)
        .map((label) => (
          <BaseText as="li" key={label} variant={TextVariant.S} color="fg.muted">
            {label}
          </BaseText>
        ))}
    </Stack>
  </Stack>
);

/** Bloc titré du récapitulatif. */
const Block = ({ title, children }: { title: string; children: ReactNode }) => (
  <Stack gap={2}>
    <BaseText as="h3" variant={TextVariant.M} fontWeight="semibold">
      {title}
    </BaseText>
    {children}
  </Stack>
);

/** « 3 collaborateurs », « 1 bien immobilier » */
const countOf = (feature: string, count: number) => {
  const config = FEATURE_LABELS[feature.toUpperCase()];
  return `${count} ${(count === 1 ? config?.singular : config?.plural) ?? feature}`;
};

interface PlanChangeSummaryProps {
  quote: MODELS.ISubscriptionQuote;
  current: { name: string; price: ReactNode; limits: PlanFeatureLimit[] };
  target: { name: string; price: ReactNode; limits: PlanFeatureLimit[] };
  keep: Record<string, string[]>;
}

/**
 * Étape 3 « Récapitulatif » : avant / après, gains, pertes, éléments désactivés, montant et dates.
 * Tout vient du devis et du catalogue : rien n'est recalculé ici. La confirmation se fait depuis
 * le pied de page de cette étape.
 */
export const PlanChangeSummary = ({ quote, current, target, keep }: PlanChangeSummaryProps) => {
  const changes = planDifferences(current.limits, target.limits);
  const gains = changes.filter((c) => c.tone === 'gain');
  const losses = changes.filter((c) => c.tone === 'loss');
  const start = formatLongDate(quote.effectiveAt);
  const end = formatLongDate(quote.newPeriodEnd);
  const immediate = quote.kind !== 'DOWNGRADE';
  const deactivated = quote.excess
    .map((e) => ({ feature: e.feature, count: e.used - (keep[e.feature]?.length ?? 0) }))
    .filter((d) => d.count > 0);

  return (
    <Stack gap={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 3, md: 6 }} position="relative">
        <PlanColumn eyebrow="Aujourd’hui" {...current} />
        <Flex
          display={{ base: 'none', md: 'flex' }}
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          boxSize="36px"
          rounded="full"
          bg="bg"
          borderWidth="1px"
          borderColor="border"
          alignItems="center"
          justifyContent="center"
          color="primary.500"
          aria-hidden
          zIndex={1}
        >
          <Icons.ArrowRight />
        </Flex>
        <PlanColumn
          eyebrow={immediate ? 'Dès le paiement' : `À partir du ${start}`}
          {...target}
          highlight
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Block title="Ce que vous gagnez">
          {gains.length ? (
            <Flex as="ul" gap={1.5} wrap="wrap" listStyleType="none">
              {gains.map((c) => (
                <DifferenceChip key={c.label} change={c} />
              ))}
            </Flex>
          ) : (
            <BaseText variant={TextVariant.S} color="fg.muted">
              Vous gardez les mêmes fonctionnalités, pour une nouvelle période.
            </BaseText>
          )}
        </Block>
        <Block title="Ce qui change">
          {losses.length || deactivated.length ? (
            <Stack gap={2}>
              {losses.length > 0 && (
                <Flex as="ul" gap={1.5} wrap="wrap" listStyleType="none">
                  {losses.map((c) => (
                    <DifferenceChip key={c.label} change={c} />
                  ))}
                </Flex>
              )}
              {deactivated.map((d) => (
                <BaseText key={d.feature} variant={TextVariant.S}>
                  {countOf(d.feature, d.count)}{' '}
                  {d.count > 1 ? 'seront désactivés' : 'sera désactivé'}{' '}
                  {immediate ? 'dès le paiement' : `le ${start}`}. Rien n’est supprimé.
                </BaseText>
              ))}
            </Stack>
          ) : (
            <BaseText variant={TextVariant.S} color="fg.muted">
              Rien n’est retiré de votre plan.
            </BaseText>
          )}
        </Block>
      </SimpleGrid>

      <Stack gap={3} p={5} rounded="7px" borderWidth="1px" borderColor="border">
        <Flex justifyContent="space-between" alignItems="baseline" gap={4} wrap="wrap">
          <BaseText variant={TextVariant.M} fontWeight="semibold">
            {immediate ? 'À payer aujourd’hui' : 'Rien à payer aujourd’hui'}
          </BaseText>
          {immediate && (
            <BaseText variant={TextVariant.XL} fontWeight="bold">
              <BaseFormatNumber
                value={quote.amount}
                currencyCode={quote.currency as ENUM.COMMON.Currency}
              />
            </BaseText>
          )}
        </Flex>
        <Stack gap={1}>
          <BaseText variant={TextVariant.S} color="fg.muted">
            {immediate
              ? `Prise d’effet dès la confirmation du paiement. Prochaine échéance : ${end}.`
              : `Votre plan actuel reste en place jusqu’au ${start}. Le nouveau plan sera à renouveler à cette date.`}
          </BaseText>
          {immediate && (
            <Flex alignItems="center" gap={2} color="fg.muted">
              <Box aria-hidden>
                <Icons.Lock />
              </Box>
              <BaseText variant={TextVariant.XS} color="inherit">
                Paiement sécurisé par NabooPay : Wave ou Orange Money. Vous serez redirigé, puis
                ramené ici.
              </BaseText>
            </Flex>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

/** Libellé de plan traduit. */
export const planLabel = (name: string) => t(`SUBSCRIPTION.PLANS.${name}`);
