import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { onGlobalError } from "_utils/auth";

export const useSessionRefresh = () => {
  const { update } = useSession();

  useEffect(() => {
    const maybeCleanup = onGlobalError(async (code) => {
      if (code === 102) {
        console.log("⚠️ Token expired (code 102) → forcing session update");
        await update();
      }
    });

    return () => {
      if (typeof maybeCleanup === "function") {
        void maybeCleanup();
      }
    };
  }, [update]);
};
