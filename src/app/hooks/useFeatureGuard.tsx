'use client';

import { useCallback, useRef, useState } from 'react';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { markNearLimitSeen, nearLimitAlreadySeen } from '_utils/subscription';
import { LimitReachedModal } from '../dashboard/components/LimitReachedModal';

/** Fonctionnalités limitées qui ont un bouton « Ajouter ». */
export type LimitedFeature = 'manage_properties' | 'publish_properties' | 'manage_users';

/**
 * Garde d'un bouton « Ajouter » :
 * - à 100 % du plan, `guard` ouvre le pop-up « limite atteinte » au lieu de lancer l'action ;
 * - à partir de 80 %, une fois par session et par fonctionnalité, il ouvre l'alerte « bientôt à
 *   la limite » : « Continuer » lance alors l'action demandée.
 * Tant que les limites ne sont pas chargées, l'action passe : le backend refuse de toute façon
 * une création au-delà.
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
  const near = usage?.state === 'NEAR_LIMIT';
  // Action mise en attente par l'alerte à 80 %, lancée par « Continuer »
  const pending = useRef<(() => void) | null>(null);

  const guard = useCallback(
    (proceed: () => void) => {
      if (reached) {
        pending.current = null;
        setOpen(true);
      } else if (near && !nearLimitAlreadySeen(feature)) {
        markNearLimitSeen(feature);
        pending.current = proceed;
        setOpen(true);
      } else proceed();
    },
    [reached, near, feature],
  );

  const onContinue = useCallback(() => {
    const proceed = pending.current;
    pending.current = null;
    setOpen(false);
    proceed?.();
  }, []);

  const limitModal =
    limits && usage ? (
      <LimitReachedModal
        isOpen={open}
        onChange={setOpen}
        usage={usage}
        limits={limits}
        onContinue={near ? onContinue : undefined}
      />
    ) : null;

  return { guard, reached, limitModal };
};
