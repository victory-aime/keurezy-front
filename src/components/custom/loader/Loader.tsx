'use client';

import {
  Spinner,
  Image,
  Text,
  SpinnerProps,
  VStack,
  Flex,
  For,
  Center,
  Span,
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { BaseText } from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { useColorMode, useColorModeValue } from '_components/ui/color-mode';
import { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import {
  motion,
  AnimatePresence,
  useAnimation,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { MotionBox } from '_constants/motion';

const RING_STAGGER = 0.8;
interface LoaderProps extends SpinnerProps {
  loader: boolean;
  showText?: boolean;
  text?: string;
  renderSpinnerContent?: React.ReactNode;
}

export const Loader = ({ loader, showText = false, text, ...rest }: LoaderProps) => {
  const { t } = useTranslation();
  return (
    loader && (
      <VStack gap={1}>
        <Spinner {...rest} animationDuration="0.6s" />
        {showText && (
          <BaseText color={'primary.500'}>{text ? text : t('COMMON.LOADING_TEXT')}</BaseText>
        )}
      </VStack>
    )
  );
};

export const GlobalLoader = ({ loader, renderSpinnerContent }: LoaderProps) => {
  return (
    loader && (
      <Box
        position="fixed"
        top="0"
        left="0"
        w="100vw"
        h="100vh"
        bg="rgba(10,16,16,0.95)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={1000}
      >
        <VStack>
          <Flex gap={3} mb={3}>
            <For each={[0, 1, 2]}>
              {(i, index) => (
                <Box
                  key={i}
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={['cyan.solid', 'orange.solid', 'purple.solid'][index % 3]}
                  animation={`${'dotBounce'} 1s ${i * 0.2}s infinite ease-in-out`}
                />
              )}
            </For>
          </Flex>
          {renderSpinnerContent}
        </VStack>
      </Box>
    )
  );
};

/**
 * KeurezyLogoAnimation
 * Full-screen overlay loader — 3 phases:
 *   ENTER  → backdrop + logo animate in
 *   IDLE   → pulse rings loop, awaits `isExiting` signal
 *   EXIT   → everything animates out → calls onAnimationComplete
 *
 * Used by LoaderProvider. Never render directly unless you control
 * `isExiting` yourself.
 *
 * Deps: framer-motion, @chakra-ui/react
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KeurezyLogoAnimationProps {
  /** Set to true when the underlying work is done → triggers exit sequence */
  isExiting: boolean;
  /** Called after the exit animation fully completes → safe to unmount */
  onAnimationComplete: () => void;
  /** Minimum ms to stay on screen even if isExiting fires immediately */
  minDuration?: number;
}

// ─── Animation variants ───────────────────────────────────────────────────────

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

// ─── Pulse Ring ───────────────────────────────────────────────────────────────

interface PulseRingProps {
  delayMs: number;
  color: string;
  size: number;
  paused: boolean;
}

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
        // gap between loops for this ring
        await new Promise((r) => setTimeout(r, 800));
      }
    };

    run();

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

// ─── Globe / House SVG ────────────────────────────────────────────────────────

function GlobeIcon({ isDark, size = 68 }: { isDark: boolean; size?: number }) {
  const outerRing = isDark ? 'rgba(243,156,18,.42)' : 'rgba(243,156,18,.58)';
  const innerRing = isDark ? 'rgba(255,255,255,.13)' : 'rgba(26,79,160,.18)';
  const meridian = isDark ? 'rgba(255,255,255,.10)' : 'rgba(26,79,160,.12)';
  const houseWhite = '#FFFFFF';

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
      {/* House */}
      <path
        d="M19 22 L27 14 L35 22 L35 34 L27 34 L27 28 L23 28 L23 34 L19 34 Z"
        fill={houseWhite}
        opacity="0.93"
      />
      {/* IoT hub */}
      <circle cx="27" cy="24" r="2.5" fill="#F39C12" />
      <circle cx="22" cy="30" r="1.5" fill="#F39C12" opacity="0.65" />
      <circle cx="32" cy="30" r="1.5" fill="#F39C12" opacity="0.65" />
      <line x1="22" y1="30" x2="27" y2="24" stroke="#F39C12" strokeWidth="0.9" opacity="0.6" />
      <line x1="32" y1="30" x2="27" y2="24" stroke="#F39C12" strokeWidth="0.9" opacity="0.6" />
      <circle cx="27" cy="44" r="2" fill="#F39C12" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function KeurezyLogoAnimation({
  isExiting,
  onAnimationComplete,
  minDuration = 1800,
}: KeurezyLogoAnimationProps) {
  const prefersReduced = useReducedMotion();
  const controls = useAnimation();
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const minPassed = useRef(false);
  const exitPending = useRef(false);

  // ── Theme tokens ─────────────────────────────────────────────────────────
  const isDark = useColorModeValue(false, true);

  const backdropBg = useColorModeValue('rgba(8, 8, 10, 0.97)', 'rgba(248, 249, 252, 0.97)');

  // ── Entrance sequence ─────────────────────────────────────────────────────
  useEffect(() => {
    controls.start('visible');

    const minTimer = setTimeout(() => {
      minPassed.current = true;
      // If exit was requested before min time elapsed, trigger it now
      if (exitPending.current) triggerExit();
    }, minDuration);

    return () => clearTimeout(minTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── React to isExiting prop ───────────────────────────────────────────────
  useEffect(() => {
    if (!isExiting) return;

    if (minPassed.current) {
      triggerExit();
    } else {
      // Wait until min duration has passed
      exitPending.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExiting]);

  const triggerExit = () => {
    setPhase('exit');
    controls.start('exit');
  };

  const handleExitComplete = () => {
    onAnimationComplete();
  };

  // ── Reduced motion: skip straight to done ────────────────────────────────
  useEffect(() => {
    if (prefersReduced && isExiting) {
      onAnimationComplete();
    }
  }, [prefersReduced, isExiting, onAnimationComplete]);

  if (prefersReduced && !isExiting) {
    // Just a simple spinner overlay — no animation
    return (
      <Box
        position="fixed"
        inset={0}
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        role="status"
        aria-label="Chargement…"
      >
        <Box display="flex" alignItems="center" gap={4}>
          <GlobeIcon isDark={isDark} size={68} />
          <Box>
            <Span
              fontWeight={'extrabold'}
              fontSize="36px"
              color={'primary.500'}
              lineHeight={1}
              letterSpacing="-0.01em"
            >
              Keure
              <Box as="span" color="#F39C12">
                zy
              </Box>
            </Span>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {phase !== 'exit' && (
        <MotionBox
          key="keurezy-loader"
          position="fixed"
          inset={0}
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg={backdropBg}
          variants={backdropVariants}
          initial="hidden"
          animate={controls}
          exit="exit"
          role="status"
          aria-label="Chargement…"
          aria-live="polite"
        >
          {/* ── Subtle grid lines (decorative) ── */}
          <Box
            position="absolute"
            inset={0}
            opacity={isDark ? 0.03 : 0.025}
            backgroundImage={`
              linear-gradient(${isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 1px, transparent 1px)
            `}
            backgroundSize="48px 48px"
            pointerEvents="none"
            aria-hidden="true"
          />

          {/* ── Logo group ── */}
          <Box display="flex" alignItems="center" gap="22px" userSelect="none">
            {/* Icon + rings */}
            <Box
              position="relative"
              w="92px"
              h="92px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              {[0, 800, 1600].map((delay, i) => (
                <PulseRing
                  key={i}
                  delayMs={delay}
                  color={'secondary.500'}
                  size={92}
                  paused={phase === 'idle'}
                />
              ))}

              <MotionBox
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                variants={iconVariants}
                initial="hidden"
                animate={controls}
                exit="exit"
              >
                <GlobeIcon isDark={isDark} size={68} />
              </MotionBox>
            </Box>

            {/* Text */}
            <Box display="flex" flexDirection="column" gap="4px">
              {/* Wordmark */}
              <MotionBox
                variants={wordmarkVariants}
                initial="hidden"
                animate={controls}
                exit="exit"
              >
                <Span
                  as="span"
                  fontWeight={'extrabold'}
                  fontSize="38px"
                  color={'primary.500'}
                  lineHeight={1}
                  letterSpacing="-0.01em"
                  display="block"
                >
                  Keure
                  <Span color={'secondary.500'}>zy</Span>
                </Span>
              </MotionBox>

              {/* Tagline */}
              <MotionBox variants={taglineVariants} initial="hidden" animate={controls} exit="exit">
                <Span fontSize="14px" letterSpacing="0.05em" display="block">
                  Trouvez, achetez, louez en toute sérénité
                </Span>
              </MotionBox>
            </Box>
          </Box>
        </MotionBox>
      )}
    </AnimatePresence>
  );
}
