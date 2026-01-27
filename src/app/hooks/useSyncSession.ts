import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { applicationContext } from "_context/global-state";

export const useSyncTokensWithContext = () => {
  const { data: session } = useSession();
  const lastAccessTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session?.access_token || !session?.refresh_token) return;

    if (session?.access_token !== lastAccessTokenRef.current) {
      applicationContext.setToken(session.access_token);
      applicationContext.setRefreshToken(session.refresh_token);
      lastAccessTokenRef.current = session?.access_token;
    }
  }, [session]);
};
