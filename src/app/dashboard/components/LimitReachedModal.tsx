'use client';

import { Box, Flex, Progress, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  BaseBadge,
  BaseFormatNumber,
  BaseModal,
  BaseText,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { CommonModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import {
  FEATURE_LABELS,
  type CatalogPlan,
  formatFeatureLimit,
  nextPlanFor,
  toCatalog,
  planDifferences,
  remainingAfterAdd,
} from '_utils/subscription';
import { DASHBOARD_ROUTES } from '../routes';

type Usage = MODELS.ISubscriptionLimits['usage'][number];

interface LimitReachedModalProps extends ModalOpenProps {
  usage: Usage;
  limits: MODELS.ISubscriptionLimits;
  /** Alerte à 80 % : lance l'action demandée (le pop-up ne bloque pas) */
  onContinue?: () => void;
}

/** Jauge de l'alerte à 80 % : usage actuel et ce qu'il restera après l'ajout. */
const NearLimitGauge = ({ usage, noun }: { usage: Usage; noun: string }) => (
  <Stack gap={2} p={4} rounded="7px" bg="bg.subtle">
    <Flex justifyContent="space-between" alignItems="baseline" gap={3}>
      <BaseText variant={TextVariant.S} fontWeight="semibold">
        {usage.used} {noun} sur {usage.limit}
      </BaseText>
      <BaseText variant={TextVariant.S} color="fg.muted">
        {usage.percentage} %
      </BaseText>
    </Flex>
    <Progress.Root
      value={usage.percentage ?? 0}
      size="sm"
      colorPalette="orange"
      aria-label={`${usage.used} ${noun} utilisés sur ${usage.limit}`}
    >
      <Progress.Track rounded="full" bg="bg.muted">
        <Progress.Range rounded="full" />
      </Progress.Track>
    </Progress.Root>
    <BaseText variant={TextVariant.S} color="fg.muted">
      {remainingAfterAdd(usage)}
    </BaseText>
  </Stack>
);

/**
 * Pop-up de limite d'un bouton « Ajouter », aux deux seuils :
 * - **limite atteinte** (100 %) : affiché à la place du formulaire, l'action ne part pas ;
 * - **bientôt atteinte** (80 %, avec `onContinue`) : jauge et reste après l'ajout, puis
 *   « Continuer » lance l'action demandée.
 * Aux agences sans historique de paiement, aperçu du plus petit plan qui lève la limite. L'owner
 * peut changer de plan ; le staff est renvoyé vers le propriétaire.
 */
export const LimitReachedModal = ({
  isOpen,
  onChange,
  usage,
  limits,
  onContinue,
}: LimitReachedModalProps) => {
  const near = !!onContinue;
  const router = useRouter();
  const { user } = useAuthContext();
  const isOwner = user?.role === ENUM.UserRole.OWNER;
  const showPreview = !limits.hasPaymentHistory;

  const { data: plans } = CommonModule.getAllPacksQueries({
    queryOptions: { enabled: isOpen && showPreview },
  });
  const catalog = useMemo(() => toCatalog(plans ?? []), [plans]);
  const currentPlan = catalog.find((p) => p.id === limits.plan?.id);
  const next =
    showPreview && limits.plan ? nextPlanFor(catalog, limits.plan.id, usage.feature) : null;
  const nextRecord = plans?.find((p) => p.id === next?.id);
  const nextPricing = nextRecord?.pricings?.find((pr) => pr.billingCycle === 'MONTHLY');
  const nextLimit = next?.features.find((f) => f.name === usage.feature)?.limit ?? null;
  const extras = next
    ? planDifferences(currentPlan?.features ?? [], next.features)
        .filter((c) => c.tone === 'gain')
        .slice(0, 4)
    : [];

  const noun = FEATURE_LABELS[usage.feature.toUpperCase()]?.plural ?? usage.feature;
  const planName = limits.plan ? t(`SUBSCRIPTION.PLANS.${limits.plan.name}`) : '';

  const goToPlans = () => {
    onChange(false);
    const query = next ? `?action=change&plan=${next.id}&cycle=MONTHLY` : '?action=change';
    router.push(`${DASHBOARD_ROUTES.SUBSCRIPTION}${query}`);
  };
  const cta = !isOwner
    ? ''
    : nextRecord
      ? `Passer au plan ${t(`SUBSCRIPTION.PLANS.${nextRecord.name}`)}`
      : 'Voir les plans';

  const footer = near
    ? {
        onClick: onContinue,
        buttonSaveTitle: 'Continuer',
        buttonCancelTitle: '',
        onReject: isOwner ? goToPlans : undefined,
        buttonRejectTitle: isOwner ? 'Voir les plans' : '',
        colorRejectButton: 'neutral' as const,
      }
    : {
        onClick: isOwner ? goToPlans : undefined,
        // Chaîne vide : pas de bouton d'action pour le staff (undefined afficherait « Valider »)
        buttonSaveTitle: cta,
      };

  return (
    <BaseModal
      title={near ? 'Bientôt à la limite de votre plan' : 'Limite de votre plan atteinte'}
      isOpen={isOpen}
      onChange={onChange}
      size="md"
      icon={near ? <Icons.InfoIcon /> : <Icons.Lock />}
      iconBackgroundColor={near ? 'orange.500' : undefined}
      {...footer}
    >
      <Stack gap={4} py={2}>
        <Stack gap={1}>
          <BaseText variant={TextVariant.M} fontWeight="semibold">
            Vous utilisez {usage.used} {noun} sur {usage.limit} inclus dans votre plan {planName}.
          </BaseText>
          <BaseText variant={TextVariant.S} color="fg.muted">
            {near
              ? isOwner
                ? 'Vous pouvez continuer. Pour ne pas être bloqué ensuite, un plan supérieur offre plus de place.'
                : 'Vous pouvez continuer. Au-delà de la limite, le propriétaire de l’agence devra passer à un plan supérieur.'
              : isOwner
                ? 'Pour en ajouter, passez à un plan supérieur ou désactivez un élément existant.'
                : 'Pour en ajouter, le propriétaire de l’agence doit passer à un plan supérieur.'}
          </BaseText>
        </Stack>

        {near && <NearLimitGauge usage={usage} noun={noun} />}

        {next && nextRecord && (
          <Stack
            gap={3}
            p={4}
            rounded="7px"
            borderWidth="1px"
            borderColor="primary.500"
            bg="primary.500/5"
          >
            <Flex justifyContent="space-between" alignItems="baseline" gap={3} wrap="wrap">
              <Flex alignItems="center" gap={2}>
                <BaseText variant={TextVariant.M} fontWeight="semibold">
                  Avec le plan {t(`SUBSCRIPTION.PLANS.${nextRecord.name}`)}
                </BaseText>
                {nextRecord.popular && <BaseBadge label="Populaire" variant="subtle" size="sm" />}
              </Flex>
              <BaseText variant={TextVariant.S} fontWeight="semibold">
                <BaseFormatNumber
                  value={nextPricing?.price ?? next.monthlyPrice}
                  currencyCode={(nextPricing?.currency ?? 'XOF') as ENUM.COMMON.Currency}
                />{' '}
                <Box as="span" color="fg.muted" fontWeight="normal">
                  / mois
                </Box>
              </BaseText>
            </Flex>
            <Flex alignItems="center" gap={2} color="primary.500">
              <Icons.Check aria-hidden />
              <BaseText variant={TextVariant.S} fontWeight="semibold" color="inherit">
                {formatFeatureLimit(usage.feature, nextLimit)}
              </BaseText>
            </Flex>
            {extras.length > 0 && (
              <Stack as="ul" gap={1} listStyleType="none">
                {extras.map((change) => (
                  <Flex as="li" key={change.label} alignItems="center" gap={2}>
                    <Box color="green.fg" aria-hidden>
                      <Icons.Check />
                    </Box>
                    <BaseText variant={TextVariant.XS} color="fg.muted">
                      {change.label}
                    </BaseText>
                  </Flex>
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </BaseModal>
  );
};
