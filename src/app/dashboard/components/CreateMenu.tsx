'use client';

import { Box, Menu, Portal } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Icons, BaseButton } from '_components/custom';
import { usePermissions } from '_hooks/usePermissions';
import { useFeatureGuard } from '_hooks/useFeatureGuard';
import { createActions, CreateActionIcon } from './create-actions';

const ICONS: Record<CreateActionIcon, ReactNode> = {
  property: <Icons.Home />,
  annonce: <Icons.Megaphone />,
  visit: <Icons.Calendar />,
  invite: <Icons.SendMail />,
};

/**
 * Bouton « Créer » de l'accueil : un seul point d'entrée vers les créations autorisées.
 * Masqué quand la session n'en permet aucune ; icône seule sur mobile.
 */
export const CreateMenu = () => {
  const { push } = useRouter();
  const { hasPermission } = usePermissions();
  const actions = createActions(hasPermission);
  // Créations soumises à une limite du plan : pop-up « limite atteinte » quand elle est pleine
  const property = useFeatureGuard('manage_properties');
  const annonce = useFeatureGuard('publish_properties');
  const invite = useFeatureGuard('manage_users');
  const guards: Partial<Record<CreateActionIcon, typeof property>> = { property, annonce, invite };
  if (!actions.length) return null;

  const open = (icon: CreateActionIcon, route: string) => {
    const guarded = guards[icon];
    if (guarded) guarded.guard(() => push(route));
    else push(route);
  };

  return (
    <>
      <Menu.Root positioning={{ placement: 'bottom-end' }}>
        <Menu.Trigger asChild>
          <BaseButton
            data-tour="quick-actions"
            size={{ base: 'sm', md: 'md' }}
            aria-label="Créer"
            px={{ base: 2, md: 4 }}
          >
            <Icons.PlusMinus size={20} />
            <Box as="span" display={{ base: 'none', md: 'inline' }}>
              Créer
            </Box>
          </BaseButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content minW="220px">
              {actions.map((action) => (
                <Menu.Item
                  key={action.route}
                  value={action.route}
                  onSelect={() => open(action.icon, action.route)}
                  cursor="pointer"
                >
                  {ICONS[action.icon]}
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      {property.limitModal}
      {annonce.limitModal}
      {invite.limitModal}
    </>
  );
};
