import { useAnimation, useReducedMotion, type Variants } from 'framer-motion';
import { PulseRingProps } from '_components/custom/loader/interface/loader';
import React, { useEffect, useRef } from 'react';
import { MotionBox } from '_constants/motion';
import { VariablesColors } from '_theme/variables';

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.45, ease: 'easeIn', delay: 0.15 } },
};

const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 18, delay: 0.2 },
  },
  exit: {
    scale: 0.7,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const wordmarkVariants: Variants = {
  hidden: { x: -22, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: 0.38 },
  },
  exit: {
    x: 12,
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const taglineVariants: Variants = {
  hidden: { y: 8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut', delay: 0.72 },
  },
  exit: {
    y: -5,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

function PulseRing({ delayMs, color, size, paused }: PulseRingProps) {
  const controls = useAnimation();
  const prefersReduced = useReducedMotion();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (prefersReduced || paused) {
      controls.stop();
      return;
    }

    let cancelled = false;

    const run = async () => {
      while (mounted.current && !cancelled) {
        await controls.start({
          scale: [0.38, 1.88],
          opacity: [1, 0],
          transition: {
            duration: 2.2,
            delay: delayMs / 1000,
            ease: 'easeOut',
          },
        });
        await new Promise((r) => setTimeout(r, 800));
      }
    };
    run().then((r) => r);

    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [controls, delayMs, paused, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <MotionBox
      position="absolute"
      inset={0}
      borderRadius="full"
      border="1.5px solid"
      borderColor={color}
      animate={controls}
      style={{ originX: '50%', originY: '50%' }}
      aria-hidden="true"
    />
  );
}

function GlobeIcon({ isDark, size = 68 }: { isDark: boolean; size?: number }) {
  const outerRing = isDark ? 'rgba(243,156,18,.42)' : 'rgba(243,156,18,.58)';
  const innerRing = isDark ? 'rgba(255,255,255,.13)' : 'rgba(26,79,160,.18)';
  const meridian = isDark ? 'rgba(255,255,255,.10)' : 'rgba(26,79,160,.12)';
  const houseWhite = VariablesColors.white;

  return (
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <circle cx="27" cy="27" r="25" stroke={outerRing} strokeWidth="1.2" />
      <circle cx="27" cy="27" r="18" stroke={innerRing} strokeWidth="0.8" />
      <path
        d="M27 10 Q38 18 38 27 Q38 38 27 44 Q16 38 16 27 Q16 18 27 10Z"
        fill="none"
        stroke={meridian}
        strokeWidth="0.8"
      />
      <path
        d="M10 27 Q18 16 27 16 Q38 16 44 27 Q38 38 27 38 Q16 38 10 27Z"
        fill="none"
        stroke={meridian}
        strokeWidth="0.8"
      />

      <path
        d="M19 22 L27 14 L35 22 L35 34 L27 34 L27 28 L23 28 L23 34 L19 34 Z"
        fill={houseWhite}
        opacity="0.93"
      />

      <circle cx="27" cy="24" r="2.5" fill="#F39C12" />
      <circle cx="22" cy="30" r="1.5" fill="#F39C12" opacity="0.65" />
      <circle cx="32" cy="30" r="1.5" fill="#F39C12" opacity="0.65" />
      <line x1="22" y1="30" x2="27" y2="24" stroke="#F39C12" strokeWidth="0.9" opacity="0.6" />
      <line x1="32" y1="30" x2="27" y2="24" stroke="#F39C12" strokeWidth="0.9" opacity="0.6" />
      <circle cx="27" cy="44" r="2" fill="#F39C12" />
    </svg>
  );
}

export { iconVariants, GlobeIcon, backdropVariants, taglineVariants, PulseRing, wordmarkVariants };
