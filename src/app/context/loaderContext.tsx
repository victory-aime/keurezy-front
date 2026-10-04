'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { KeurezyLoader, type KeurezyLoaderMessage } from '_components/custom';

type LoaderContextType = {
  /** Affiche le loader Keurezy, avec un message facultatif (« Connexion en cours… ») */
  showLoader: (message?: KeurezyLoaderMessage) => void;
  hideLoader: () => void;
  isLoading: boolean;
  withLoader: <T>(fn: () => Promise<T>, message?: KeurezyLoaderMessage) => Promise<T>;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
  children: ReactNode;
  /**
   * Durée minimale d'affichage (ms) une fois le loader visible : évite un clignotement quand la
   * réponse est très rapide, sans faire attendre l'utilisateur.
   * @default 500
   */
  minDuration?: number;
}

export function LoaderProvider({ children, minDuration = 500 }: LoaderProviderProps) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<KeurezyLoaderMessage | null>(null);
  const shownAt = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showLoader = useCallback((next?: KeurezyLoaderMessage) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = null;
    setMessage(next ?? null);
    setVisible((current) => {
      if (!current) shownAt.current = Date.now();
      return true;
    });
  }, []);

  const hideLoader = useCallback(() => {
    const remaining = Math.max(0, minDuration - (Date.now() - shownAt.current));
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      hideTimer.current = null;
      setVisible(false);
    }, remaining);
  }, [minDuration]);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  const withLoader = useCallback(
    async <T,>(fn: () => Promise<T>, next?: KeurezyLoaderMessage): Promise<T> => {
      showLoader(next);
      try {
        return await fn();
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader],
  );

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading: visible, withLoader }}>
      {children}
      <KeurezyLoader visible={visible} message={message} onExited={() => setMessage(null)} />
    </LoaderContext.Provider>
  );
}

export function useGlobalLoader(): LoaderContextType {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a <LoaderProvider>');
  }
  return context;
}
