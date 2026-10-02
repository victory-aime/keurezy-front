'use client';

import { Box, Flex, HoverCard, Icon, Portal, Stack, chakra } from '@chakra-ui/react';
import { t } from 'i18next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { ENUM } from '_types/*';
import { DASHBOARD_ROUTES } from '../../../routes';
import { SidebarLink } from '../types';
import { LockedFeaturePreview } from './LockedFeaturePreview';

/**
 * Lien d'un module que le plan n'inclut pas : visible avec un cadenas pour donner envie de
 * passer au plan supérieur. Au survol, au focus clavier ou au toucher, une carte montre un
 * aperçu animé du module, ce qu'il apporte et le plan qui l'inclut. La page reste protégée
 * (`PlanFeatureGate`) : la carte ne mène qu'à l'abonnement.
 */
export const LockedNavLink = ({
  item,
  showLabel,
  mobileCloseDrawer,
}: {
  item: SidebarLink;
  /** Libellé visible (menu déplié) ; sinon l'icône seule */
  showLabel: boolean;
  mobileCloseDrawer?: () => void;
}) => {
  const router = useRouter();
  const { user } = useAuthContext();
  const isOwner = user?.role === ENUM.UserRole.OWNER;
  const [open, setOpen] = useState(false);
  const label = t(item.label);
  const planName = item.unlockPlan ? t(`SUBSCRIPTION.PLANS.${item.unlockPlan.name}`) : null;

  const goToPlans = () => {
    setOpen(false);
    mobileCloseDrawer?.();
    const query = item.unlockPlan
      ? `?action=change&plan=${item.unlockPlan.id}&cycle=MONTHLY`
      : '?action=change';
    router.push(`${DASHBOARD_ROUTES.SUBSCRIPTION}${query}`);
  };

  return (
    <HoverCard.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      openDelay={150}
      closeDelay={120}
      positioning={{ placement: 'right-start', gutter: 14 }}
      lazyMount
      unmountOnExit
    >
      <HoverCard.Trigger asChild>
        <chakra.button
          type="button"
          className="kz-locked"
          // Toucher : pas de survol, le tap ouvre et ferme la carte
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`${label} : ${planName ? `inclus dès le plan ${planName}` : 'non inclus dans votre plan'}, afficher un aperçu`}
          display="flex"
          alignItems="center"
          gap={3}
          width="full"
          px={3}
          py={2}
          borderRadius="md"
          justifyContent={showLabel ? 'flex-start' : 'center'}
          color={open ? 'primary.600' : 'fg.muted'}
          bg={open ? 'primary.500/10' : 'transparent'}
          cursor="pointer"
          transition="background-color 160ms ease, color 160ms ease"
          _hover={{ bg: 'primary.500/10', color: 'primary.600' }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'primary.500',
            outlineOffset: '2px',
          }}
          css={{
            '&:hover .kz-lock, &:focus-visible .kz-lock': {
              animation: 'kz-wiggle 520ms ease',
            },
            '@keyframes kz-wiggle': {
              '0%, 100%': { transform: 'none' },
              '25%': { transform: 'rotate(-14deg)' },
              '55%': { transform: 'rotate(10deg)' },
              '80%': { transform: 'rotate(-4deg)' },
            },
            '@media (prefers-reduced-motion: reduce)': { '& .kz-lock': { animation: 'none' } },
          }}
        >
          <Box position="relative" display="flex" aria-hidden>
            <Icon as={item.icon} size="xs" />
            {!showLabel && (
              <Box
                className="kz-lock"
                position="absolute"
                right="-6px"
                bottom="-5px"
                bg="bg"
                rounded="full"
              >
                <Icons.Lock size={10} />
              </Box>
            )}
          </Box>
          {showLabel && (
            <>
              <BaseText flex="1" fontSize="sm" textAlign="start">
                {label}
              </BaseText>
              <Box className="kz-lock" display="flex" aria-hidden>
                <Icons.Lock size={13} />
              </Box>
            </>
          )}
        </chakra.button>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content width="320px" p={4} rounded="14px" boxShadow="lg">
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            <Stack gap={3}>
              <Flex alignItems="center" gap={2} wrap="wrap">
                <BaseText fontWeight="bold">{label}</BaseText>
                {planName && (
                  <Box
                    fontSize="11px"
                    fontWeight="bold"
                    color="primary.700"
                    bg="primary.500/10"
                    rounded="full"
                    px={2}
                    py="3px"
                  >
                    Plan {planName}
                  </Box>
                )}
              </Flex>
              {item.preview && <LockedFeaturePreview preview={item.preview} />}
              {item.pitch && (
                <BaseText variant={TextVariant.S} color="fg.muted">
                  {item.pitch}
                </BaseText>
              )}
              {isOwner ? (
                <Flex alignItems="center" gap={3} wrap="wrap">
                  <BaseButton colorType="primary" size="sm" onClick={goToPlans}>
                    Voir les plans
                  </BaseButton>
                  {planName && (
                    <BaseText variant={TextVariant.XS} color="fg.muted">
                      Inclus dès le plan {planName}
                    </BaseText>
                  )}
                </Flex>
              ) : (
                <BaseText variant={TextVariant.XS} color="fg.muted">
                  Demandez au propriétaire de l’agence de passer
                  {planName ? ` au plan ${planName}` : ' à un plan supérieur'}.
                </BaseText>
              )}
            </Stack>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
};
