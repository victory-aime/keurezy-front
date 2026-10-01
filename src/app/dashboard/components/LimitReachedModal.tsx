'use client';

import { Box, Flex, Stack } from '@chakra-ui/react';
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
  planDifferences,
} from '_utils/subscription';
import { DASHBOARD_ROUTES } from '../routes';

type Usage = MODELS.ISubscriptionLimits['usage'][number];

/** Catalogue public réduit à ce qui sert à comparer les plans. */
const toCatalog = (plans: MODELS.COMMON.ISubscriptionPlan[]): CatalogPlan[] =>
  plans
    .filter((p) => p.planCategory === 'SUBSCRIPTION_BASED')
    .map((p) => ({
      id: p.id,
      monthlyPrice: Number(p.pricings?.find((pr) => pr.billingCycle === 'MONTHLY')?.price ?? 0),
      features: p.planFeatures
        .filter((pf) => pf.feature?.isCommercial)
        .map((pf) => ({ name: pf.feature.name, limit: pf.limit ?? null })),
    }));

interface LimitReachedModalProps extends ModalOpenProps {
  usage: Usage;
  limits: MODELS.ISubscriptionLimits;
}

/**
 * « Limite atteinte » : affiché à la place du formulaire d'ajout quand la fonctionnalité est
 * utilisée à 100 %. Aux agences sans historique de paiement, aperçu du plus petit plan qui lève
 * la limite. L'owner peut changer de plan ; le staff est renvoyé vers le propriétaire.
 */
export const LimitReachedModal = ({ isOpen, onChange, usage, limits }: LimitReachedModalProps) => {
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

  return (
    <BaseModal
      title="Limite de votre plan atteinte"
      isOpen={isOpen}
      onChange={onChange}
      size="md"
      icon={<Icons.Lock />}
      onClick={isOwner ? goToPlans : undefined}
      // Chaîne vide : pas de bouton d'action pour le staff (undefined afficherait « Valider »)
      buttonSaveTitle={cta}
    >
      <Stack gap={4} py={2}>
        <Stack gap={1}>
          <BaseText variant={TextVariant.M} fontWeight="semibold">
            Vous utilisez {usage.used} {noun} sur {usage.limit} inclus dans votre plan {planName}.
          </BaseText>
          <BaseText variant={TextVariant.S} color="fg.muted">
            {isOwner
              ? 'Pour en ajouter, passez à un plan supérieur ou désactivez un élément existant.'
              : 'Pour en ajouter, le propriétaire de l’agence doit passer à un plan supérieur.'}
          </BaseText>
        </Stack>

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
                  value={next.monthlyPrice}
                  currencyCode={ENUM.COMMON.Currency.XOF}
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
