'use client';

import { Box, Flex, Stack } from '@chakra-ui/react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { t } from 'i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BaseButton,
  BaseFormatNumber,
  BaseText,
  TextVariant,
  CustomSkeletonLoader,
} from '_components/custom';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '_components/ui/dialog';
import { MotionBox } from '_constants/motion';
import { AgencyModule, CommonModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { canRenew, isFreePlan, keepFitsLimits, type PlanFeatureLimit } from '_utils/subscription';
import { PlanChangeStepper, PLAN_CHANGE_STEPS } from './PlanChangeStepper';
import { PlanChangeSummary } from './PlanChangeSummary';
import { limitsOf, PlanChooser, priceOn } from './PlanChooser';
import { QuoteReview } from './QuoteReview';

type Subscription = NonNullable<MODELS.IAgencySubscriptionOverview['subscription']>;

/** Commande NabooPay en cours, relue au retour sur la page (`PaymentReturn`). */
export const PENDING_ORDER_KEY = 'keurezy.subscription.orderId';

export interface ChangePlanTarget {
  planId: string;
  billingCycle: ENUM.BillingCycle;
}

const STEP_TITLES = [
  'Choisissez votre plan',
  'Vérifiez le montant',
  'Récapitulatif avant confirmation',
] as const;

const cycleSuffix = (cycle: ENUM.BillingCycle | null) => (cycle === 'YEARLY' ? ' / an' : ' / mois');

interface ChangePlanDialogProps {
  agencyId: string;
  subscription: Subscription;
  /** Limites du plan actuel (page abonnement), pour la colonne « Aujourd'hui » */
  currentLimits: PlanFeatureLimit[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Plan déjà choisi (renouvellement, réactivation, modification d'un downgrade) : étape 2 */
  initialTarget?: ChangePlanTarget;
  /** Choix déjà enregistré (modification d'un downgrade programmé) */
  initialKeep?: MODELS.SubscriptionKeep;
  /** Après un downgrade programmé : recharger la page */
  onScheduled: () => void;
}

/**
 * Changer de plan, renouveler ou réactiver, en plein écran : Choisir → Vérifier → Récapitulatif.
 * La confirmation n'existe qu'à l'étape 3. Montants et dates : devis du backend uniquement.
 *
 * Idempotence : une clé par intention (plan, cycle, choix) ; un double clic ou une nouvelle
 * tentative après une erreur réseau renvoie la même clé, donc le même checkout.
 */
export const ChangePlanDialog = ({
  agencyId,
  subscription,
  currentLimits,
  open,
  onOpenChange,
  initialTarget,
  initialKeep,
  onScheduled,
}: ChangePlanDialogProps) => {
  const reduceMotion = useReducedMotion() ?? false;
  const [cycle, setCycle] = useState<ENUM.BillingCycle>(subscription.billingCycle ?? 'MONTHLY');
  const [planId, setPlanId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [keep, setKeep] = useState<Record<string, string[]>>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Chaque ouverture repart de zéro (ou du plan déjà choisi)
  useEffect(() => {
    if (!open) return;
    setCycle(initialTarget?.billingCycle ?? subscription.billingCycle ?? 'MONTHLY');
    setPlanId(initialTarget?.planId ?? null);
    setStep(initialTarget ? 1 : 0);
    setKeep(Object.fromEntries((initialKeep ?? []).map(({ feature, ids }) => [feature, ids])));
  }, [open, initialTarget, initialKeep, subscription.billingCycle]);

  // Focus sur le titre de l'étape à chaque changement (l'ouverture passe par initialFocusEl)
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const { data: allPlans, isLoading: plansLoading } = CommonModule.getAllPacksQueries({
    queryOptions: { enabled: open },
  });
  const plans = useMemo(() => allPlans ?? [], [allPlans]);
  const selectedPlan = plans.find((p) => p.id === planId);

  const quoteQuery = AgencyModule.getSubscriptionQuoteQueries({
    params: { agencyId, planId: planId ?? '', billingCycle: cycle },
    queryOptions: { enabled: open && step >= 1 && !!planId },
  });
  const quote = quoteQuery.data;

  // Surplus : on présélectionne les premiers éléments dans la limite (l'owner ajuste ensuite).
  // Sans ça, « rien gardé » passerait sans que l'owner ait choisi.
  useEffect(() => {
    if (!quote?.excess.length) return;
    setKeep((previous) => {
      const next = { ...previous };
      for (const { feature, limit, items } of quote.excess) {
        const known = (next[feature] ?? []).filter((id) => items.some((i) => i.id === id));
        next[feature] = known.length ? known : items.slice(0, limit).map((i) => i.id);
      }
      return next;
    });
  }, [quote]);

  // On désélectionne un plan qui disparaît sur le nouveau cycle (pas de prix) ou qui y devient le
  // plan actuel, non sélectionnable (ex. Standard annuel choisi, retour au mensuel actuel)
  const changeCycle = (next: ENUM.BillingCycle) => {
    const selected = plans.find((p) => p.id === planId);
    const becomesCurrent =
      selected?.id === subscription.plan.id &&
      (isFreePlan(subscription.plan) || next === subscription.billingCycle);
    if (selected && (!priceOn(selected, next) || becomesCurrent)) setPlanId(null);
    setCycle(next);
  };

  const idempotencyKey = useMemo(
    () => crypto.randomUUID(),
    // Nouvelle intention dès que la demande change ; identique pour une nouvelle tentative
    [planId, cycle, JSON.stringify(keep), open],
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

  const busy = paying || scheduling;
  const fromFree = isFreePlan(subscription.plan);
  const targetFree = isFreePlan(selectedPlan);
  // Le Gratuit n'a pas de cycle : le rechoisir n'est jamais un changement
  const isSameAsCurrent =
    planId === subscription.plan.id && (fromFree || cycle === subscription.billingCycle);
  const canLeaveChoose = !!planId && (!isSameAsCurrent || canRenew(subscription, new Date()));
  const canLeaveReview = !!quote && keepFitsLimits(quote.excess, keep);
  const firstStep = initialTarget ? 1 : 0;

  // Pourquoi « Continuer » est grisé : annoncé (région live toujours présente) et affiché
  const blockedReason =
    step === 0 && isSameAsCurrent && !canLeaveChoose
      ? fromFree
        ? 'C’est votre plan actuel.'
        : 'C’est votre plan actuel. Le renouvellement est proposé à partir de 7 jours avant l’échéance.'
      : step === 1 && quote && !canLeaveReview
        ? 'Votre choix dépasse la limite du nouveau plan : retirez des éléments.'
        : '';

  const confirm = () => {
    if (!quote || !planId) return;
    const target: MODELS.ISubscriptionTarget = {
      agencyId,
      planId,
      billingCycle: cycle,
      keep: quote.excess.map(({ feature }) => ({ feature, ids: keep[feature] ?? [] })),
    };
    // Downgrade, ou passage immédiat au Gratuit après expiration : rien à payer
    if (quote.kind === 'DOWNGRADE' || quote.amount === 0) schedule({ payload: target });
    else checkout({ payload: { target, idempotencyKey } });
  };

  const targetPricing = selectedPlan ? priceOn(selectedPlan, cycle) : undefined;
  const planName = selectedPlan ? t(`SUBSCRIPTION.PLANS.${selectedPlan.name}`) : '';

  const content = () => {
    if (step === 0) {
      if (plansLoading) {
        return (
          <Flex gap={4} direction={{ base: 'column', lg: 'row' }} aria-busy="true">
            {[0, 1, 2].map((i) => (
              <Box key={i} flex="1">
                <CustomSkeletonLoader type="DEFAULT" height="320px" />
              </Box>
            ))}
          </Flex>
        );
      }
      return (
        <Stack gap={3}>
          <PlanChooser
            plans={plans}
            currentPlanId={subscription.plan.id}
            currentCycle={subscription.billingCycle}
            billingCycle={cycle}
            onCycleChange={changeCycle}
            selectedPlanId={planId}
            onSelect={setPlanId}
          />
        </Stack>
      );
    }
    if (step === 1) {
      return (
        <QuoteReview
          quote={quote}
          isLoading={quoteQuery.isLoading}
          isError={quoteQuery.isError}
          isRetrying={quoteQuery.isFetching}
          onRetry={() => quoteQuery.refetch()}
          planName={planName}
          currentPeriodEnd={subscription.currentPeriodEnd}
          keep={keep}
          onKeepChange={setKeep}
          targetFree={targetFree}
          fromFree={fromFree}
        />
      );
    }
    if (!quote || !selectedPlan) return null;
    return (
      <PlanChangeSummary
        quote={quote}
        keep={keep}
        current={{
          name: t(`SUBSCRIPTION.PLANS.${subscription.plan.name}`),
          price: fromFree ? (
            'Gratuit'
          ) : subscription.price === null ? (
            '—'
          ) : (
            <>
              <BaseFormatNumber
                value={subscription.price}
                currencyCode={(subscription.currency ?? 'XOF') as ENUM.COMMON.Currency}
              />
              {cycleSuffix(subscription.billingCycle)}
            </>
          ),
          limits: currentLimits,
        }}
        target={{
          name: planName,
          price: targetFree ? (
            'Gratuit'
          ) : targetPricing ? (
            <>
              <BaseFormatNumber
                value={targetPricing.price}
                currencyCode={targetPricing.currency as ENUM.COMMON.Currency}
              />
              {cycleSuffix(cycle)}
            </>
          ) : (
            '—'
          ),
          limits: limitsOf(selectedPlan),
        }}
        targetFree={targetFree}
      />
    );
  };

  const primary = () => {
    if (step === 0) {
      return (
        <BaseButton colorType="primary" disabled={!canLeaveChoose} onClick={() => setStep(1)}>
          Continuer
        </BaseButton>
      );
    }
    if (step === 1) {
      return (
        <BaseButton colorType="primary" disabled={!canLeaveReview} onClick={() => setStep(2)}>
          Voir le récapitulatif
        </BaseButton>
      );
    }
    return (
      <BaseButton colorType="primary" isLoading={busy} disabled={!quote || busy} onClick={confirm}>
        {quote?.kind === 'DOWNGRADE' ? (
          'Programmer le changement'
        ) : quote && targetFree ? (
          'Passer au plan Gratuit'
        ) : quote ? (
          <>
            Confirmer et payer{' '}
            <BaseFormatNumber
              value={quote.amount}
              currencyCode={quote.currency as ENUM.COMMON.Currency}
            />
          </>
        ) : (
          'Confirmer'
        )}
      </BaseButton>
    );
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => !busy && onOpenChange(e.open)}
      size="full"
      motionPreset={reduceMotion ? 'none' : 'slide-in-bottom'}
      closeOnEscape={!busy}
      initialFocusEl={() => headingRef.current}
      lazyMount
      unmountOnExit
    >
      <DialogContent rounded="none" bg="bg">
        <DialogHeader borderBottomWidth="1px" borderColor="border" py={4}>
          <Stack gap={0} width="full" maxW="72rem" mx="auto" pr={10}>
            <PlanChangeStepper current={step} />
          </Stack>
          <DialogCloseTrigger disabled={busy} top="4" insetEnd="4" aria-label="Fermer" />
        </DialogHeader>

        <DialogBody py={{ base: 6, md: 10 }}>
          <Stack gap={6} width="full" maxW="72rem" mx="auto">
            <Stack gap={1}>
              <BaseText variant={TextVariant.XS} color="fg.muted">
                Changer de plan · étape {step + 1} sur {PLAN_CHANGE_STEPS.length}
              </BaseText>
              <DialogTitle asChild>
                <BaseText
                  as="h2"
                  ref={headingRef}
                  tabIndex={-1}
                  fontSize={{ base: 'lg', md: 'xl' }}
                  fontWeight="semibold"
                  outline="none"
                >
                  {STEP_TITLES[step]}
                </BaseText>
              </DialogTitle>
              {blockedReason && (
                <BaseText variant={TextVariant.S} color="fg.muted" display={{ md: 'none' }}>
                  {blockedReason}
                </BaseText>
              )}
            </Stack>
            <AnimatePresence mode="wait" initial={false}>
              <MotionBox
                key={step}
                initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -16 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {content()}
              </MotionBox>
            </AnimatePresence>
          </Stack>
        </DialogBody>

        <DialogFooter
          borderTopWidth="1px"
          borderColor="border"
          bg="bg"
          position="sticky"
          bottom={0}
          py={3}
        >
          <Flex
            width="full"
            maxW="72rem"
            mx="auto"
            gap={3}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              {step > firstStep && (
                <BaseButton
                  variant="outline"
                  colorType="neutral"
                  disabled={busy}
                  onClick={() => setStep(step - 1)}
                >
                  Retour
                </BaseButton>
              )}
            </Box>
            <Flex alignItems="center" gap={3} minW={0}>
              <BaseText
                role="status"
                aria-live="polite"
                variant={TextVariant.XS}
                color="fg.muted"
                textAlign="right"
                display={{ base: 'none', md: 'block' }}
              >
                {blockedReason}
              </BaseText>
              {primary()}
            </Flex>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
