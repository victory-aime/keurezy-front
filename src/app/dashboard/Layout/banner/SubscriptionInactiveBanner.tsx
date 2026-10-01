'use client';

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import { useColorMode } from '_components/ui/color-mode';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { ENUM } from '_types/*';
import { DASHBOARD_ROUTES } from '../../routes';

/**
 * Bandeau affiché à toute l'équipe quand l'abonnement de l'agence a expiré : le backend refuse
 * alors les écritures (`SUBSCRIPTION_INACTIVE`). Même requête (et même cache) que le contrôle
 * d'accès de la sidebar. L'owner est envoyé directement au paiement de la réactivation.
 */
export const SubscriptionInactiveBanner = () => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const { user } = useUserContext();
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === ENUM.UserRole.OWNER;

  const { data } = AgencyModule.getAgencySubscriptionInfo({
    params: { agencyId: user?.agencyId! },
    queryOptions: { enabled: !!user?.agencyId },
  });

  if (data?.status !== 'INACTIVE') return null;

  return (
    <Flex
      role="status"
      mb={4}
      px={4}
      py={3}
      gap={3}
      rounded="7px"
      borderWidth="1px"
      borderColor={colorMode === 'light' ? 'orange.200' : 'orange.700'}
      bg={colorMode === 'light' ? 'orange.50' : 'orange.950'}
      alignItems={{ base: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      direction={{ base: 'column', sm: 'row' }}
    >
      <Flex gap={2} alignItems="center" color={colorMode === 'light' ? 'orange.700' : 'orange.200'}>
        <Icons.Lock aria-hidden />
        <BaseText variant={TextVariant.S} color="inherit">
          {isOwner
            ? 'Votre abonnement a expiré : le tableau de bord est en lecture seule et vos annonces sont masquées.'
            : 'L’abonnement de l’agence a expiré : le tableau de bord est en lecture seule. Contactez le propriétaire.'}
        </BaseText>
      </Flex>
      {isOwner && (
        <BaseButton
          size="sm"
          variant="outline"
          colorType="warning"
          onClick={() => router.push(`${DASHBOARD_ROUTES.SUBSCRIPTION}?action=reactivate`)}
        >
          Réactiver mon abonnement
        </BaseButton>
      )}
    </Flex>
  );
};
