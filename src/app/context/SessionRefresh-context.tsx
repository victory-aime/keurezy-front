"use client";

import {
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { BaseToast, ToastStatus } from "_components/custom";
import { toaster } from "_components/ui/toaster";
import { retrySessionRequest } from "_utils/retrySessionRequest";
import { authClient } from "../lib/auth-client";

const SessionContext = createContext<
  | {
      dismissToast?: (() => void) | undefined;
    }
  | undefined
>(undefined);

export function SessionRefreshProvider({ children }: { children: ReactNode }) {
  const { error, refetch: refetchSession } = authClient.useSession();
  const isRetryingRef = useRef(false);
  const toastId = "session-error-toast";

  const isServerError =
    error?.status === 500 || error?.statusText === "Internal Server Error";

  const startRetry = useCallback(async () => {
    if (!navigator.onLine) return;
    if (!isServerError || isRetryingRef.current) return;

    isRetryingRef.current = true;

    BaseToast({
      id: toastId,
      showStatus: { error: false, success: false },
      asPromise: {
        promise: retrySessionRequest()
          .then(async () => {
            await refetchSession();
            BaseToast({
              id: `${toastId}-final`,
              title: "Connexion rétablie",
              description: "Votre session est active.",
              type: ToastStatus.SUCCESS,
            });
          })
          .catch(() =>
            BaseToast({
              id: `${toastId}-error`,
              title: "Connexion impossible",
              description:
                "Le serveur ne répond toujours pas. Vérifiez votre connexion.",
              type: ToastStatus.ERROR,
              persist: true,
              action: {
                label: "Réessayer",
                onClick: () => {
                  toaster.dismiss(`${toastId}-error`);
                  isRetryingRef.current = false;
                  startRetry();
                },
              },
            }),
          ),
        config: {
          loading: {
            title: "Tentative de reconnexion...",
            description: "Nous essayons de restaurer votre session.",
          },
        },
      },
    });
  }, [isServerError]);

  useEffect(() => {
    if (isServerError && !isRetryingRef.current) {
      startRetry();
    }
  }, [isServerError, startRetry]);

  return (
    <SessionContext.Provider
      value={{ dismissToast: () => toaster.dismiss(`${toastId}-error`) }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionRefreshContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error(
      "useSessionRefreshContext must be used within an SessionRefreshProvider",
    );
  }
  return context;
}
