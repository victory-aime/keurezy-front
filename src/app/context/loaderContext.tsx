'use client';

/**
 * LoaderProvider — Global loader context
 *
 * Lifecycle:
 *   showLoader()  → mounts <KeurezyLogoAnimation>, plays entrance
 *   hideLoader()  → signals exit animation (does NOT unmount immediately)
 *   onDone        → called by animation after exit completes → actual unmount
 *
 * This separation ensures:
 *   • The loader never disappears mid-animation
 *   • Exit plays fully before unmounting
 *   • minDuration prevents flash-of-loader on fast responses
 *
 * Usage:
 *   const { showLoader, hideLoader } = useGlobalLoader();
 *
 *   // Route change / data fetch:
 *   showLoader();
 *   await fetchData();
 *   hideLoader();     ← triggers exit, unmounts after animation
 *
 *   // With async wrapper:
 *   await withLoader(fetchData);
 */

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { KeurezyLogoAnimation } from '_components/custom';

// ─── Types ────────────────────────────────────────────────────────────────────

type LoaderState =
  | 'hidden' // not mounted
  | 'showing' // mounted, animating in / idle
  | 'exiting'; // exit animation in progress

type LoaderContextType = {
  /** Mount the loader and start entrance animation */
  showLoader: () => void;
  /** Trigger exit animation (component unmounts after animation completes) */
  hideLoader: () => void;
  /** True while loader is mounted (showing or exiting) */
  isLoading: boolean;
  /**
   * Convenience wrapper — shows loader, awaits your async fn, then hides.
   *
   * ```ts
   * const data = await withLoader(() => fetchSomething());
   * ```
   */
  withLoader: <T>(fn: () => Promise<T>) => Promise<T>;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

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

  // Guard against race conditions (rapid show/hide calls)
  const stateRef = useRef<LoaderState>('hidden');

  const setPhase = (next: LoaderState) => {
    stateRef.current = next;
    setLoaderState(next);
  };

  // ── showLoader ────────────────────────────────────────────────────────────
  const showLoader = useCallback(() => {
    // Already visible — do nothing (avoids re-mount flicker)
    if (stateRef.current !== 'hidden') return;
    setPhase('showing');
  }, []);

  // ── hideLoader ────────────────────────────────────────────────────────────
  const hideLoader = useCallback(() => {
    if (stateRef.current === 'hidden') return;
    // Signal the animation to start its exit sequence.
    // Actual unmount happens in onAnimationComplete below.
    setPhase('exiting');
  }, []);

  // ── onAnimationComplete (called by KeurezyLogoAnimation after exit) ───────
  const handleDone = useCallback(() => {
    setPhase('hidden');
  }, []);

  // ── withLoader convenience wrapper ───────────────────────────────────────
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

      {/* Mounted while showing OR exiting — exit prop drives the animation phase */}
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGlobalLoader(): LoaderContextType {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a <LoaderProvider>');
  }
  return context;
}

// ─── Usage examples ───────────────────────────────────────────────────────────
//
// 1. Manual control:
//    const { showLoader, hideLoader } = useGlobalLoader();
//    showLoader();
//    const data = await fetchProperties();
//    hideLoader();
//
// 2. Convenience wrapper:
//    const { withLoader } = useGlobalLoader();
//    const properties = await withLoader(() => fetchProperties());
//
// 3. Next.js route change (app router):
//    const { showLoader, hideLoader } = useGlobalLoader();
//    router.push('/properties');   // in a useEffect watching pathname:
//    useEffect(() => { hideLoader(); }, [pathname]);
//
// 4. Wrapping app (layout.tsx):
//    export default function RootLayout({ children }) {
//      return (
//        <ChakraProvider>
//          <LoaderProvider minDuration={900}>
//            {children}
//          </LoaderProvider>
//        </ChakraProvider>
//      );
//    }
