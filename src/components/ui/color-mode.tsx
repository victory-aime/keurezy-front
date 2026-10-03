'use client';

import type { IconButtonProps, SpanProps } from '@chakra-ui/react';
import { ClientOnly, IconButton, Skeleton, Span } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import * as React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      defaultTheme="system"
      enableColorScheme
      enableSystem
      // React 19 avertit quand un <script> est rendu côté client. Le script anti-flash n'est utile
      // qu'au rendu serveur : côté client il devient inerte (le type diffère, mais next-themes
      // pose suppressHydrationWarning sur la balise).
      scriptProps={{ type: typeof window === 'undefined' ? 'text/javascript' : 'text/plain' }}
      {...props}
    />
  );
}

export type ColorMode = 'light' | 'dark' | 'system';

export interface UseColorModeReturn {
  /** Thème réellement appliqué (« light » ou « dark »), jamais « system » */
  colorMode: ColorMode;
  /** Choix de l'utilisateur, « system » compris (sélecteur d'apparence) */
  colorPreference: ColorMode;
  resolvedColorMode: string;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

/** `true` après le premier rendu côté navigateur (le thème appliqué n'est pas connu du serveur). */
const subscribeNoop = () => () => {};
const useHydrated = () =>
  React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  return {
    // Thème réellement appliqué (`theme` vaut « system » quand l'utilisateur suit son appareil).
    // Avant l'hydratation, valeur fixe identique au rendu serveur : pas d'écart d'hydratation.
    // Pour un style, préférer `_dark` / les jetons du thème, appliqués sans attendre le JS.
    colorMode: (hydrated ? (resolvedTheme ?? 'light') : 'light') as ColorMode,
    colorPreference: (hydrated ? (theme ?? 'system') : 'system') as ColorMode,
    resolvedColorMode: resolvedTheme as 'light' | 'dark',
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'dark' ? <LuMoon /> : <LuSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, 'aria-label'> {}

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
      <ClientOnly fallback={<Skeleton boxSize="8" />}>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="sm"
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    );
  },
);

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(function DarkMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      colorPalette="gray"
      colorScheme="dark"
      ref={ref}
      {...props}
    />
  );
});
