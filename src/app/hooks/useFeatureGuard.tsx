'use client';

import { useCallback, useState } from 'react';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { LimitReachedModal } from '../dashboard/components/LimitReachedModal';

/** Fonctionnalités limitées qui ont un bouton « Ajouter ». */
export type LimitedFeature = 'manage_properties' | 'publish_properties' | 'manage_users';

/**
 * Garde d'un bouton « Ajouter » : si la fonctionnalité est utilisée à 100 % du plan, `guard`
 * ouvre le pop-up « limite atteinte » au lieu de lancer l'action. Tant que les limites ne sont
 * pas chargées, l'action passe : le backend refuse de toute façon une création au-delà.
 *
 * Usage : `const { guard, limitModal } = useFeatureGuard('manage_users');`
 * puis `onClick={() => guard(() => push(ROUTE))}` et `{limitModal}` dans le rendu.
 */
export const useFeatureGuard = (feature: LimitedFeature) => {
  const { user } = useUserContext();
  const agencyId = user?.agencyId ?? '';
  const [open, setOpen] = useState(false);

  const { data: limits } = AgencyModule.getSubscriptionLimitsQueries({
    params: { agencyId },
    // Recompté à chaque montage : une création ou une désactivation change l'usage
    queryOptions: { enabled: !!agencyId, refetchOnMount: 'always' },
  });
  const usage = limits?.usage.find((u) => u.feature === feature);
  const reached = usage?.state === 'REACHED';

  const guard = useCallback(
    (proceed: () => void) => {
      if (reached) setOpen(true);
      else proceed();
    },
    [reached],
  );

  const limitModal =
    limits && usage ? (
      <LimitReachedModal isOpen={open} onChange={setOpen} usage={usage} limits={limits} />
    ) : null;

  return { guard, reached, limitModal };
};
