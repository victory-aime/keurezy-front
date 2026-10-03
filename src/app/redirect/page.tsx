'use client';

import { useEffect, useState } from 'react';
import {
  BaseModal,
  BaseText,
  Icons,
  KeurezyLogoAnimation,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { roleToDashboardMap } from '_constants/role';
import { authClient } from '../lib/auth-client';
import { useRouter } from 'next/navigation';

export default function RedirectAfterLogin() {
  const { data: session, isPending } = authClient.useSession();
  const [url, setUrl] = useState<string>('');
  // Compte sans agence : inscription interrompue, on prévient avant de l'y ramener
  const [unfinished, setUnfinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      const timer = setTimeout(() => {
        router.replace(APP_ROUTES.AUTH.SIGN_IN);
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (session.user.role === 'USER') {
      setUnfinished(true);
      return;
    }
    const dashboardUrl = roleToDashboardMap[session.user.role];
    setUrl(dashboardUrl ?? APP_ROUTES.ROOT);
  }, [session, isPending]);

  const leave = (async (open: boolean) => {
    if (open) return;
    await authClient.signOut();
    router.replace(APP_ROUTES.ROOT);
  }) as ModalOpenProps['onChange'];

  return (
    <>
      <KeurezyLogoAnimation
        isExiting={!isPending && !unfinished}
        onAnimationComplete={() => url && router.replace(url)}
      />
      <BaseModal
        isOpen={unfinished}
        onChange={leave}
        size="md"
        // Seuls les deux boutons ferment : un clic à côté ne déconnecte pas
        showCloseButton={false}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        icon={<Icons.InfoIcon />}
        title="Votre inscription n’est pas terminée"
        buttonCancelTitle="Me déconnecter"
        colorCancelButton="neutral"
        buttonSaveTitle="Poursuivre mon inscription"
        onClick={() => router.replace(APP_ROUTES.AUTH.ONBOARD)}
      >
        <BaseText variant={TextVariant.S}>
          {session?.user?.emailVerified
            ? 'Votre compte est prêt : il reste à renseigner votre agence et à choisir votre plan. Nous vous ramenons à l’étape où vous vous êtes arrêté.'
            : 'Il reste à vérifier votre adresse e-mail, puis à renseigner votre agence et à choisir votre plan. Nous vous ramenons à l’étape où vous vous êtes arrêté.'}
        </BaseText>
      </BaseModal>
    </>
  );
}
