'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { type ReactNode, useState } from 'react';

/**
 * Registre Emotion pour l'App Router. Sans lui, Emotion (utilisé par Chakra) écrit ses styles
 * globaux en ligne pendant le rendu serveur : le client ne les retrouve pas au même endroit et
 * l'hydratation échoue. Ici les styles sont collectés puis injectés dans le <head>
 * (`useServerInsertedHTML`), et `compat` empêche les balises <style> en ligne.
 */
export function EmotionRegistry({ children }: { children: ReactNode }) {
  const [registry] = useState(() => {
    const cache = createCache({ key: 'css' });
    cache.compat = true;
    const insert = cache.insert;
    let inserted: { name: string; global: boolean }[] = [];
    cache.insert = (...args) => {
      const [selector, serialized] = args;
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push({ name: serialized.name, global: !selector });
      }
      return insert(...args);
    };
    const flush = () => {
      const previous = inserted;
      inserted = [];
      return previous;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (!names.length) return null;
    let styles = '';
    let dataEmotion = registry.cache.key;
    const globals: { name: string; style: string }[] = [];
    for (const { name, global } of names) {
      const style = registry.cache.inserted[name];
      if (typeof style !== 'string') continue;
      if (global) globals.push({ name, style });
      else {
        styles += style;
        dataEmotion += ` ${name}`;
      }
    }
    return (
      <>
        {globals.map(({ name, style }) => (
          <style
            key={name}
            data-emotion={`${registry.cache.key}-global ${name}`}
            dangerouslySetInnerHTML={{ __html: style }}
          />
        ))}
        {styles && (
          <style data-emotion={dataEmotion} dangerouslySetInnerHTML={{ __html: styles }} />
        )}
      </>
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
