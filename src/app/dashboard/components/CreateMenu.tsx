'use client';

import { Box, Button, Menu, Portal } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Icons } from '_components/custom';
import { usePermissions } from '_hooks/usePermissions';
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
  if (!actions.length) return null;

  return (
    <Menu.Root positioning={{ placement: 'bottom-end' }}>
      <Menu.Trigger asChild>
        <Button
          data-tour="quick-actions"
          // Nuances du thème (pas de tokens sémantiques `primary.solid` dans ce projet)
          bg="primary.500"
          color="white"
          _hover={{ bg: 'primary.600' }}
          size={{ base: 'sm', md: 'md' }}
          aria-label="Créer"
          px={{ base: 2, md: 4 }}
        >
          <Icons.PlusMinus size={20} />
          <Box as="span" display={{ base: 'none', md: 'inline' }}>
            Créer
          </Box>
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="220px">
            {actions.map((action) => (
              <Menu.Item
                key={action.route}
                value={action.route}
                onSelect={() => push(action.route)}
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
  );
};
