'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { KeurezyLogoAnimation } from '_components/custom';

type LoaderState = 'hidden' | 'showing' | 'exiting';

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
  isLoading: boolean;
  withLoader: <T>(fn: () => Promise<T>) => Promise<T>;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

interface LoaderProviderProps {
  children: ReactNode;
  /**
   * Minimum ms the loader stays visible.
   * Prevents jarring flash on fast responses.
   * @default 1800
   */
  minDuration?: number;
}

export function LoaderProvider({ children, minDuration = 2000 }: LoaderProviderProps) {
  const [loaderState, setLoaderState] = useState<LoaderState>('hidden');

  const stateRef = useRef<LoaderState>('hidden');

  const setPhase = (next: LoaderState) => {
    stateRef.current = next;
    setLoaderState(next);
  };

  const showLoader = useCallback(() => {
    if (stateRef.current !== 'hidden') return;
    setPhase('showing');
  }, []);

  const hideLoader = useCallback(() => {
    if (stateRef.current === 'hidden') return;
    setPhase('exiting');
  }, []);

  const handleDone = useCallback(() => {
    setPhase('hidden');
  }, []);

  const withLoader = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      showLoader();
      try {
        return await fn();
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader],
  );

  const isLoading = loaderState !== 'hidden';

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading, withLoader }}>
      {children}
      {loaderState !== 'hidden' && (
        <KeurezyLogoAnimation
          isExiting={loaderState === 'exiting'}
          onAnimationComplete={handleDone}
          minDuration={minDuration}
        />
      )}
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
