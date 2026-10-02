'use client';

import { Flex, Stack } from '@chakra-ui/react';
import { useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { BaseButton, BaseText, TextVariant, CustomSkeletonLoader } from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { UserRole } from '../../../../types/enum';
import { BillingHistory } from './BillingHistory';
import { CancelSubscription } from './CancelSubscription';
import { ChangePlanDialog, type ChangePlanTarget } from './ChangePlanDialog';
import { PaymentReturn } from './PaymentReturn';
import { ScheduledChangeBanner } from './ScheduledChangeBanner';
import { CurrentPlan } from './CurrentPlan';
import { PlanFeatures } from './PlanFeatures';
import { Section } from './Section';
import { UsageOverview } from './UsageOverview';

/** Squelette de la page pendant le chargement. */
const OverviewSkeleton = () => (
  <Stack gap={4} aria-busy="true" aria-label="Chargement de votre abonnement">
    <CustomSkeletonLoader type="DEFAULT" height="180px" />
    <CustomSkeletonLoader type="DEFAULT" height="220px" />
    <CustomSkeletonLoader type="DEFAULT" height="160px" />
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
  const subscription = data?.subscription;

  // Modale « Changer de plan » ; avec une cible, il s'ouvre directement sur « Vérifier »
  const [drawer, setDrawer] = useState<{
    open: boolean;
    target?: ChangePlanTarget;
    keep?: MODELS.SubscriptionKeep;
  }>({ open: false });
  const openRenewal = useCallback(() => {
    if (!subscription) return;
    setDrawer({
      open: true,
      target: {
        planId: subscription.plan.id,
        billingCycle: subscription.billingCycle ?? 'MONTHLY',
      },
    });
  }, [subscription]);
  const reload = useCallback(() => {
    refetch();
  }, [refetch]);

  // Liens entrants : bandeau d'expiration (« Réactiver ») et pop-up « limite atteinte »
  // (« Changer de plan », avec ou sans plan proposé)
  useEffect(() => {
    if (!subscription) return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action !== 'reactivate' && action !== 'change') return;
    window.history.replaceState(null, '', window.location.pathname);
    if (action === 'reactivate') {
      if (subscription.status === 'INACTIVE') openRenewal();
      return;
    }
    const planId = params.get('plan');
    const cycle = params.get('cycle') === 'YEARLY' ? 'YEARLY' : 'MONTHLY';
    setDrawer(planId ? { open: true, target: { planId, billingCycle: cycle } } : { open: true });
  }, [subscription, openRenewal]);

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
        {data.subscription.scheduledChange && (
          <ScheduledChangeBanner
            agencyId={agencyId}
            change={data.subscription.scheduledChange}
            onEdit={() =>
              setDrawer({
                open: true,
                target: {
                  planId: data.subscription!.scheduledChange!.plan.id,
                  billingCycle: data.subscription!.scheduledChange!.billingCycle,
                },
                keep: data.subscription!.scheduledChange!.keep,
              })
            }
            onChanged={reload}
          />
        )}
        <Section title="Abonnement actuel" index={0} reduceMotion={reduceMotion}>
          <CurrentPlan subscription={data.subscription} onRenew={openRenewal} />
          <CancelSubscription
            agencyId={agencyId}
            subscription={data.subscription}
            onChanged={refetch}
          />
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
        <Section
          title="Historique de facturation"
          description="Vos paiements, du plus récent au plus ancien."
          index={3}
          reduceMotion={reduceMotion}
        >
          <BillingHistory agencyId={agencyId} />
        </Section>
      </>
    );
  };

  return (
    <Stack gap={5} width="full" maxW="5xl" mx="auto" pb={8}>
      <Flex
        gap={3}
        justifyContent="space-between"
        alignItems={{ base: 'stretch', sm: 'flex-end' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Stack gap={1}>
          <BaseText as="h1" variant={TextVariant.H2} fontWeight="semibold">
            Mon abonnement
          </BaseText>
          <BaseText variant={TextVariant.S} color="fg.muted">
            Gérez votre plan, votre consommation et votre facturation.
          </BaseText>
        </Stack>
        {subscription && (
          <BaseButton colorType="primary" onClick={() => setDrawer({ open: true })}>
            Changer de plan
          </BaseButton>
        )}
      </Flex>
      {isOwner && agencyId && <PaymentReturn agencyId={agencyId} onSettled={reload} />}
      {body()}
      {subscription && (
        <ChangePlanDialog
          agencyId={agencyId}
          subscription={subscription}
          currentLimits={(data?.features ?? [])
            .filter((f) => f.included)
            .map((f) => ({ name: f.name, limit: f.limit }))}
          open={drawer.open}
          onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
          initialTarget={drawer.target}
          initialKeep={drawer.keep}
          onScheduled={reload}
        />
      )}
    </Stack>
  );
};
