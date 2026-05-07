'use client';

import { useEffect } from 'react';
import { Loader } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { roleToDashboardMap } from '_constants/role';
import { Center } from '@chakra-ui/react';
import { authClient } from '../lib/auth-client';

export default function RedirectAfterLogin() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return; // ✅ attend

    if (!session?.user) {
      // ✅ Attend un tick supplémentaire avant de conclure
      // le cookie peut ne pas encore être lu au premier render
      const timer = setTimeout(() => {
        window.location.href = APP_ROUTES.AUTH.SIGN_IN;
      }, 900);
      return () => clearTimeout(timer);
    }

    const dashboardUrl = roleToDashboardMap[session.user.role];
    window.location.href = dashboardUrl ?? APP_ROUTES.ROOT;

  }, [session, isPending]);

  return (
      <Center h={'100vh'}>
        <Loader loader showText />
      </Center>
  );
}