import { useEffect, useState } from 'react';

/** Secondes restantes avant `until` (horodatage ms, 0 une fois passé), rafraîchies chaque seconde. */
export function useSecondsUntil(until: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (until <= Date.now()) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [until]);
  return Math.max(0, Math.ceil((until - now) / 1000));
}

/** 105 → « 01:45 » */
export const formatCountdown = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
