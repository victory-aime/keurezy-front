'use client';

import { Center, Skeleton, Stack } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useMemo } from 'react';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { useAccessControl } from '_hooks/useAccessControl';
import { ENUM } from '_types/*';
import { planFeatureForPath } from '_utils/permissions';
import { DASHBOARD_ROUTES } from '../../routes';
import { ALL_CSA_ROUTES } from '../sidebar/routes/routes';

/** Pages sans lien dans le menu, mais réservées à un plan. */
const EXTRA_GATED = [{ path: DASHBOARD_ROUTES.STATS, feature: 'view_reports' }];

/**
 * Protège les pages d'un module absent du plan, même quand l'URL est saisie directement : la
 * page n'est pas affichée, un écran explique pourquoi. Même règle que le menu (le backend refuse
 * aussi ces données) ; une limite à 0 vaut « non inclus ».
 */
export const PlanFeatureGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const { user } = useAuthContext();
  const isOwner = user?.role === ENUM.UserRole.OWNER;
  const { hasFeature, isLoading } = useAccessControl();
  const feature = useMemo(
    () => planFeatureForPath(pathname, [...ALL_CSA_ROUTES.flatMap((g) => g.links), ...EXTRA_GATED]),
    [pathname],
  );

  if (!feature) return <>{children}</>;
  if (isLoading) return <Skeleton height="320px" rounded="7px" aria-busy="true" />;
  if (hasFeature(feature)) return <>{children}</>;

  return (
    <Center py={{ base: 12, md: 20 }} px={4}>
      <Stack gap={4} alignItems="center" textAlign="center" maxW="28rem" role="status">
        <Center boxSize="56px" rounded="full" bg="bg.muted" color="fg.muted" aria-hidden>
          <Icons.Lock size={24} />
        </Center>
        <BaseText fontWeight="semibold" variant={TextVariant.L}>
          Cette fonctionnalité n’est pas incluse dans votre plan
        </BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          {isOwner
            ? 'Changez de plan pour y accéder : votre page Abonnement compare ce que chaque plan inclut.'
            : 'Elle fait partie d’un plan supérieur. Contactez le propriétaire de votre agence pour en savoir plus.'}
        </BaseText>
        <Stack direction={{ base: 'column', sm: 'row' }} gap={2}>
          {isOwner && (
            <BaseButton
              colorType="primary"
              onClick={() => router.push(DASHBOARD_ROUTES.SUBSCRIPTION)}
            >
              Voir les plans
            </BaseButton>
          )}
          <BaseButton
            variant="outline"
            colorType="neutral"
            onClick={() => router.push(DASHBOARD_ROUTES.HOME)}
          >
            Retour au tableau de bord
          </BaseButton>
        </Stack>
      </Stack>
    </Center>
  );
};
