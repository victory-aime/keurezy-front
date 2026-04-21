import { useEffect, useState } from 'react';

/**
 * Hook pour gérer un décompte en secondes.
 * @param initialSeconds Le temps initial en secondes (ex: 300)
 * @returns Le temps restant (en secondes) et une valeur formatée mm:ss
 */

export const useCountdown = (initialSeconds: number) => {
  const [remainingTime, setRemainingTime] = useState(initialSeconds);

  useEffect(() => {
    setRemainingTime(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return { remainingTime, formatted: formatTime(remainingTime) };
};
