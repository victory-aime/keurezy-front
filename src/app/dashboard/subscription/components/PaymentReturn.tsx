'use client';

import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BaseButton, BaseText, TextVariant } from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { PENDING_ORDER_KEY } from './ChangePlanDrawer';

const POLL_EVERY_MS = 3_000;
/** Au-delà, on arrête d'interroger : le webhook appliquera le paiement de toute façon */
const POLL_FOR_MS = 120_000;

const readPendingOrder = () => {
  try {
    return sessionStorage.getItem(PENDING_ORDER_KEY);
  } catch {
    return null;
  }
};

const MESSAGES = {
  PENDING: 'Confirmation de votre paiement en cours…',
  PAID: 'Paiement confirmé : votre abonnement est à jour.',
  FAILED: 'Le paiement n’a pas abouti. Votre abonnement n’a pas changé.',
  CANCELLED: 'Paiement annulé. Votre abonnement n’a pas changé.',
  TIMEOUT:
    'La confirmation prend plus de temps que prévu. Votre abonnement sera mis à jour dès sa réception.',
} as const;

/**
 * Retour depuis NabooPay (`?payment=success|error`) : suit le paiement jusqu'à son statut final,
 * puis recharge l'abonnement (page et bandeau). Le statut vient du backend, jamais de l'URL.
 */
export const PaymentReturn = ({
  agencyId,
  onSettled,
}: {
  agencyId: string;
  onSettled: () => void;
}) => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  // URL et stockage lus après le montage (pas de rendu serveur divergent, pas de Suspense)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('payment')) setOrderId(readPendingOrder());
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const timer = setTimeout(() => setTimedOut(true), POLL_FOR_MS);
    return () => clearTimeout(timer);
  }, [orderId]);

  const { data } = AgencyModule.getSubscriptionPaymentQueries({
    params: { agencyId, orderId: orderId ?? '' },
    queryOptions: {
      enabled: !!agencyId && !!orderId && !timedOut,
      refetchInterval: (query) =>
        !query.state.data || query.state.data.status === 'PENDING' ? POLL_EVERY_MS : false,
    },
  });
  const { refetch: refetchInfo } = AgencyModule.getAgencySubscriptionInfo({
    params: { agencyId },
    queryOptions: { enabled: false },
  });

  const status = data?.status ?? 'PENDING';
  const settled = status !== 'PENDING';

  useEffect(() => {
    if (!settled) return;
    try {
      sessionStorage.removeItem(PENDING_ORDER_KEY);
    } catch {
      // rien à nettoyer
    }
    onSettled();
    refetchInfo();
  }, [settled, onSettled, refetchInfo]);

  const dismiss = () => {
    window.history.replaceState(null, '', window.location.pathname);
    setOrderId(null);
  };

  if (!orderId) return null;

  const tone = status === 'PAID' ? 'green' : settled ? 'red' : 'gray';
  return (
    <Flex
      role="status"
      aria-live="polite"
      px={4}
      py={3}
      gap={3}
      rounded="7px"
      borderWidth="1px"
      borderColor={`${tone}.muted`}
      bg={`${tone}.subtle`}
      alignItems={{ base: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      direction={{ base: 'column', sm: 'row' }}
    >
      <Flex gap={2} alignItems="center">
        {!settled && !timedOut && <Spinner size="sm" />}
        <BaseText variant={TextVariant.S}>
          {timedOut && !settled ? MESSAGES.TIMEOUT : MESSAGES[status]}
        </BaseText>
      </Flex>
      {(settled || timedOut) && (
        <BaseButton size="sm" variant="outline" colorType="neutral" onClick={dismiss}>
          Fermer
        </BaseButton>
      )}
    </Flex>
  );
};
