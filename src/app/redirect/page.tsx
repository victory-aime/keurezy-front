'use client';

import { useEffect, useState } from 'react';
import { KeurezyLogoAnimation } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { roleToDashboardMap } from '_constants/role';
import { authClient } from '../lib/auth-client';
import { useRouter } from 'next/navigation';

export default function RedirectAfterLogin() {
  const { data: session, isPending } = authClient.useSession();
  const [url, setUrl] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      const timer = setTimeout(() => {
        router.replace(APP_ROUTES.AUTH.SIGN_IN);
      }, 1500);
      return () => clearTimeout(timer);
    }
    const dashboardUrl = roleToDashboardMap[session.user.role];
    setUrl(dashboardUrl ?? APP_ROUTES.ROOT);
  }, [session, isPending]);

  return (
    <KeurezyLogoAnimation isExiting={!isPending} onAnimationComplete={() => router.replace(url)} />
  );
}
