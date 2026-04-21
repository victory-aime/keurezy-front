'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { buildTheme } from '_theme/theme';
import { generateShades } from '_theme/generate-shades';
import { useUserContext } from './user-context';
import { ColorModeProvider, ColorModeProviderProps } from '_components/ui/color-mode';

type DynamicVariables = {
  primary: string;
  primary50: string;
  primary100: string;
  primary200: string;
  primary600: string;
  primary700: string;
};

type ThemeContextValue = {
  primaryColor: string;
  vars: DynamicVariables;
  setTheme: (hex: string) => Promise<void>;
};

export const DEFAULT_PRIMARY = '#673ab6';

const ThemeCtx = createContext<ThemeContextValue | null>(null);

function buildVars(hex: string): DynamicVariables {
  const shades = generateShades(hex);
  return {
    primary: shades[500].value,
    primary50: shades[50].value,
    primary100: shades[100].value,
    primary200: shades[200].value,
    primary600: shades[600].value,
    primary700: shades[700].value,
  };
}

/**
 * ✅ Cache GLOBAL (persist entre renders)
 */
const themeCache = new Map<string, any>();

function getTheme(hex: string) {
  if (!themeCache.has(hex)) {
    themeCache.set(hex, buildTheme(hex));
  }
  return themeCache.get(hex);
}

export function DynamicThemeProvider(props: ColorModeProviderProps) {
  const { user } = useUserContext();
  const [primaryColor, setPrimaryColor] = useState<string>(DEFAULT_PRIMARY);
  const [system, setSystem] = useState(() => getTheme(DEFAULT_PRIMARY));

  /**
   * ✅ Synchronisation avec user.theme_color
   * - dépendance précise
   * - évite recalcul inutile
   */
  useEffect(() => {
    const color = user?.theme_color;
    if (!color) return;

    setPrimaryColor((prev) => {
      if (prev === color) return prev;

      setSystem(getTheme(color));
      return color;
    });
  }, [user?.theme_color]);

  /**
   * ✅ Memo shades
   */
  const vars = useMemo(() => buildVars(primaryColor), [primaryColor]);

  /**
   * ✅ setTheme optimisé
   */
  const setTheme = async (hex: string) => {
    setPrimaryColor((prev) => {
      if (prev === hex) return prev;

      setSystem(getTheme(hex));
      return hex;
    });
  };

  return (
    <ThemeCtx.Provider value={{ primaryColor, vars, setTheme }}>
      <ChakraProvider value={system}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </ThemeCtx.Provider>
  );
}

export const useAppTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useAppTheme must be used inside DynamicThemeProvider');
  return ctx;
};
