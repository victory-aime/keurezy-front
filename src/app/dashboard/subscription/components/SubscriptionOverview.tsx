'use client';

import { Skeleton, Stack } from '@chakra-ui/react';
import { useReducedMotion } from 'framer-motion';
import { BaseButton, BaseText, TextVariant } from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { UserRole } from '../../../../types/enum';
import { CurrentPlan } from './CurrentPlan';
import { PlanFeatures } from './PlanFeatures';
import { Section } from './Section';
import { UsageOverview } from './UsageOverview';

/** Squelette de la page pendant le chargement. */
const OverviewSkeleton = () => (
  <Stack gap={4} aria-busy="true" aria-label="Chargement de votre abonnement">
    <Skeleton height="180px" rounded="7px" />
    <Skeleton height="220px" rounded="7px" />
    <Skeleton height="160px" rounded="7px" />
  </Stack>
);

/**
 * Page « Mon abonnement » (owner uniquement, comme l'endpoint) : plan, échéance, consommation
 * et fonctionnalités. Le backend est la source de vérité ; la page ne fait qu'afficher.
 */
export const SubscriptionOverview = () => {
  const { user } = useUserContext();
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === UserRole.OWNER;
  const agencyId = user?.agencyId ?? '';
  const reduceMotion = useReducedMotion() ?? false;

  const { data, isLoading, isError, refetch, isRefetching } =
    AgencyModule.getAgencySubscriptionQueries({
      params: { agencyId },
      queryOptions: { enabled: !!agencyId && isOwner },
    });

  const body = () => {
    if (!isOwner) {
      return (
        <Section title="Accès réservé" reduceMotion={reduceMotion}>
          <BaseText variant={TextVariant.S} color="fg.muted">
            Seul le propriétaire de l’agence peut consulter et gérer l’abonnement.
          </BaseText>
        </Section>
      );
    }
    if (isLoading) return <OverviewSkeleton />;
    if (isError || !data) {
      return (
        <Section title="Impossible de charger votre abonnement" reduceMotion={reduceMotion}>
          <Stack gap={3} alignItems="flex-start" role="alert">
            <BaseText variant={TextVariant.S} color="fg.muted">
              Vérifiez votre connexion puis réessayez.
            </BaseText>
            <BaseButton
              variant="outline"
              colorType="primary"
              isLoading={isRefetching}
              onClick={() => refetch()}
            >
              Réessayer
            </BaseButton>
          </Stack>
        </Section>
      );
    }
    if (!data.subscription) {
      return (
        <Section title="Aucun abonnement" reduceMotion={reduceMotion}>
          <BaseText variant={TextVariant.S} color="fg.muted">
            Aucun abonnement n’est associé à votre agence pour le moment.
          </BaseText>
        </Section>
      );
    }
    return (
      <>
        <Section title="Abonnement actuel" index={0} reduceMotion={reduceMotion}>
          <CurrentPlan subscription={data.subscription} />
        </Section>
        <Section
          title="Votre utilisation"
          description="Ce que vous utilisez sur les limites de votre plan."
          index={1}
          reduceMotion={reduceMotion}
        >
          <UsageOverview usage={data.usage} reduceMotion={reduceMotion} />
        </Section>
        {data.features.length > 0 && (
          <Section title="Fonctionnalités de votre plan" index={2} reduceMotion={reduceMotion}>
            <PlanFeatures features={data.features} />
          </Section>
        )}
      </>
    );
  };

  return (
    <Stack gap={5} width="full" maxW="5xl" mx="auto" pb={8}>
      <Stack gap={1}>
        <BaseText as="h1" variant={TextVariant.H2} fontWeight="semibold">
          Mon abonnement
        </BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          Gérez votre plan, votre consommation et votre facturation.
        </BaseText>
      </Stack>
      {body()}
    </Stack>
  );
};
