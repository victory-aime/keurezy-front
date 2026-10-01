'use client';

import { Flex, Skeleton, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { BaseButton, BaseFormatNumber, BaseText, TextVariant } from '_components/custom';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from '_components/ui/drawer';
import { AgencyModule, CommonModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { canRenew, keepFitsLimits } from '_utils/subscription';
import { PlanChooser } from './PlanChooser';
import { QuoteReview } from './QuoteReview';

type Subscription = NonNullable<MODELS.IAgencySubscriptionOverview['subscription']>;

/** Commande NabooPay en cours, relue au retour sur la page (`PaymentReturn`). */
export const PENDING_ORDER_KEY = 'keurezy.subscription.orderId';

export interface ChangePlanTarget {
  planId: string;
  billingCycle: ENUM.BillingCycle;
}

interface ChangePlanDrawerProps {
  agencyId: string;
  subscription: Subscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Plan déjà choisi (renouvellement, modification d'un downgrade) : on passe à « Vérifier » */
  initialTarget?: ChangePlanTarget;
  /** Choix déjà enregistré (modification d'un downgrade programmé) */
  initialKeep?: MODELS.SubscriptionKeep;
  /** Après un downgrade programmé : recharger la page */
  onScheduled: () => void;
}

/**
 * Changer de plan, renouveler ou réactiver : « Choisir → Vérifier → Confirmer ». Le montant et
 * les dates viennent du devis backend. Paiement : redirection NabooPay ; downgrade : programmé.
 *
 * Idempotence : une clé par intention (plan, cycle, choix). Un double clic ou une nouvelle
 * tentative après une erreur réseau renvoie la même clé, donc le même checkout.
 */
export const ChangePlanDrawer = ({
  agencyId,
  subscription,
  open,
  onOpenChange,
  initialTarget,
  initialKeep,
  onScheduled,
}: ChangePlanDrawerProps) => {
  const [cycle, setCycle] = useState<ENUM.BillingCycle>(subscription.billingCycle ?? 'MONTHLY');
  const [planId, setPlanId] = useState<string | null>(null);
  const [step, setStep] = useState<'choose' | 'review'>('choose');
  const [keep, setKeep] = useState<Record<string, string[]>>({});

  // Chaque ouverture repart de zéro (ou du plan déjà choisi)
  useEffect(() => {
    if (!open) return;
    setCycle(initialTarget?.billingCycle ?? subscription.billingCycle ?? 'MONTHLY');
    setPlanId(initialTarget?.planId ?? null);
    setStep(initialTarget ? 'review' : 'choose');
    setKeep(Object.fromEntries((initialKeep ?? []).map(({ feature, ids }) => [feature, ids])));
  }, [open, initialTarget, initialKeep, subscription.billingCycle]);

  const { data: allPlans, isLoading: plansLoading } = CommonModule.getAllPacksQueries({
    queryOptions: { enabled: open },
  });
  const plans = useMemo(
    () => (allPlans ?? []).filter((p) => p.planCategory === 'SUBSCRIPTION_BASED'),
    [allPlans],
  );
  const selectedPlan = plans.find((p) => p.id === planId);

  const quoteQuery = AgencyModule.getSubscriptionQuoteQueries({
    params: { agencyId, planId: planId ?? '', billingCycle: cycle },
    queryOptions: { enabled: open && step === 'review' && !!planId },
  });
  const quote = quoteQuery.data;

  const idempotencyKey = useMemo(
    () => crypto.randomUUID(),
    // Nouvelle intention dès que la demande change ; identique pour une nouvelle tentative
    [planId, cycle, JSON.stringify(keep), step, open],
  );

  const { mutate: checkout, isPending: paying } = AgencyModule.subscriptionCheckoutMutation({
    mutationOptions: {
      onSuccess: ({ checkoutUrl, orderId }) => {
        try {
          sessionStorage.setItem(PENDING_ORDER_KEY, orderId);
        } catch {
          // Stockage indisponible : le webhook applique quand même le paiement
        }
        window.location.assign(checkoutUrl);
      },
    },
  });
  const { mutate: schedule, isPending: scheduling } =
    AgencyModule.scheduleSubscriptionChangeMutation({
      mutationOptions: {
        onSuccess: () => {
          onOpenChange(false);
          onScheduled();
        },
      },
    });

  const isSameAsCurrent = planId === subscription.plan.id && cycle === subscription.billingCycle;
  const renewalAllowed = canRenew(subscription, new Date());
  const canContinue = !!planId && (!isSameAsCurrent || renewalAllowed);
  const keepOk = !quote || keepFitsLimits(quote.excess, keep);
  const busy = paying || scheduling;

  const target: MODELS.ISubscriptionTarget = {
    agencyId,
    planId: planId ?? '',
    billingCycle: cycle,
    keep: quote?.excess.map(({ feature }) => ({ feature, ids: keep[feature] ?? [] })),
  };
  const confirm = () => {
    if (!quote) return;
    if (quote.kind === 'DOWNGRADE') schedule({ payload: target });
    else checkout({ payload: { target, idempotencyKey } });
  };

  return (
    <DrawerRoot
      open={open}
      onOpenChange={(e) => !busy && onOpenChange(e.open)}
      placement="end"
      size={{ base: 'full', md: 'md' }}
      closeOnEscape
      lazyMount
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <Stack gap={0.5}>
            <DrawerTitle>
              {step === 'choose' ? 'Changer de plan' : 'Vérifier avant de confirmer'}
            </DrawerTitle>
            {!initialTarget && (
              <BaseText variant={TextVariant.XS} color="fg.muted">
                Étape {step === 'choose' ? 1 : 2} sur 2
              </BaseText>
            )}
          </Stack>
          <DrawerCloseTrigger disabled={busy} />
        </DrawerHeader>

        <DrawerBody>
          {step === 'choose' ? (
            plansLoading ? (
              <Stack gap={3} aria-busy="true" aria-label="Chargement des plans">
                <Skeleton height="96px" rounded="7px" />
                <Skeleton height="96px" rounded="7px" />
              </Stack>
            ) : (
              <Stack gap={3}>
                <PlanChooser
                  plans={plans}
                  currentPlanId={subscription.plan.id}
                  currentCycle={subscription.billingCycle}
                  billingCycle={cycle}
                  onCycleChange={setCycle}
                  selectedPlanId={planId}
                  onSelect={setPlanId}
                />
                {isSameAsCurrent && !renewalAllowed && (
                  <BaseText variant={TextVariant.XS} color="fg.muted" role="status">
                    C’est votre plan actuel. Le renouvellement est proposé à partir de 7 jours avant
                    l’échéance.
                  </BaseText>
                )}
              </Stack>
            )
          ) : (
            <QuoteReview
              quote={quote}
              isLoading={quoteQuery.isLoading}
              isError={quoteQuery.isError}
              onRetry={() => quoteQuery.refetch()}
              planName={selectedPlan ? t(`SUBSCRIPTION.PLANS.${selectedPlan.name}`) : ''}
              currentPeriodEnd={subscription.currentPeriodEnd}
              keep={keep}
              onKeepChange={setKeep}
            />
          )}
        </DrawerBody>

        <DrawerFooter>
          <Flex gap={3} width="full" justifyContent="flex-end">
            {step === 'review' && !initialTarget && (
              <BaseButton
                variant="outline"
                colorType="neutral"
                disabled={busy}
                onClick={() => {
                  setStep('choose');
                  setKeep({});
                }}
              >
                Retour
              </BaseButton>
            )}
            {step === 'choose' ? (
              <BaseButton
                colorType="primary"
                disabled={!canContinue}
                onClick={() => setStep('review')}
              >
                Continuer
              </BaseButton>
            ) : (
              <BaseButton
                colorType="primary"
                isLoading={busy}
                disabled={!quote || !keepOk || busy}
                onClick={confirm}
              >
                {quote?.kind === 'DOWNGRADE' ? (
                  'Programmer le changement'
                ) : quote ? (
                  <>
                    Payer{' '}
                    <BaseFormatNumber
                      value={quote.amount}
                      currencyCode={quote.currency as ENUM.COMMON.Currency}
                    />
                  </>
                ) : (
                  'Payer'
                )}
              </BaseButton>
            )}
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};
