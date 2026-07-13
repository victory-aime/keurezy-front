'use client';

import { Spinner, VStack, Flex, For, Span } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';
import { BaseText } from '_components/custom';
import { useColorMode } from '_components/ui/color-mode';
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { AnimatePresence, useAnimation, useReducedMotion } from 'framer-motion';
import { MotionBox } from '_constants/motion';
import { KeurezyLogoAnimationProps, LoaderProps } from './interface/loader';
import {
  iconVariants,
  GlobeIcon,
  wordmarkVariants,
  taglineVariants,
  backdropVariants,
  PulseRing,
} from './constants/loader';

export const Loader = ({ loader, showText = false, text, ...rest }: LoaderProps) => {
  const { t } = useTranslation();
  return (
    loader && (
      <VStack gap={1}>
        <Spinner {...rest} color={'purple.focusRing'} animationDuration="0.6s" />
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
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const backdropBg =
    colorMode === 'light'
      ? 'rgba(8, 8, 10, 0.97)'
      : colorMode === 'dark'
        ? 'rgba(248, 249, 252, 0.97)'
        : 'inherit';

  useEffect(() => {
    controls.start('visible');

    const minTimer = setTimeout(() => {
      minPassed.current = true;
      if (exitPending.current) triggerExit();
    }, minDuration);

    return () => clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (!isExiting) return;

    if (minPassed.current) {
      triggerExit();
    } else {
      exitPending.current = true;
    }
  }, [isExiting]);

  const triggerExit = () => {
    setPhase('exit');
    controls.start('exit');
  };

  const handleExitComplete = () => {
    onAnimationComplete();
  };

  useEffect(() => {
    if (prefersReduced && isExiting) {
      onAnimationComplete();
    }
  }, [prefersReduced, isExiting, onAnimationComplete]);

  if (prefersReduced && !isExiting) {
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
              Keur
              <Box as="span" color="secondary.500">
                ezy
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

          <Box display="flex" alignItems="center" gap="22px" userSelect="none">
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

            <Box display="flex" flexDirection="column" gap="4px">
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
                  Keur
                  <Span color={'secondary.500'}>ezy</Span>
                </Span>
              </MotionBox>
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
