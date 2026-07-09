import { useCallback, useRef } from 'react';

export const useFakeProgress = () => {
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const start = useCallback((id: string, onTick: (progress: number) => void) => {
    let progress = 0;

    intervalsRef.current[id] = setInterval(() => {
      // Incrément qui diminue à mesure qu'on approche de 90%
      // -> rapide au début, lent ensuite, jamais bloquant
      const remaining = 90 - progress;
      const increment = Math.max(remaining * 0.1, 0.5);

      progress = Math.min(progress + increment, 90);
      onTick(Math.round(progress));
    }, 200);
  }, []);

  const complete = useCallback((id: string, onTick: (progress: number) => void) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
    onTick(100); // saut final à 100%
  }, []);

  const stop = useCallback((id: string) => {
    clearInterval(intervalsRef.current[id]);
    delete intervalsRef.current[id];
  }, []);

  return { start, complete, stop };
};
