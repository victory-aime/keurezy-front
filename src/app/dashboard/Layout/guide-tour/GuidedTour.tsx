"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BaseButton, Icons } from "_components/custom";
import { Box, Flex } from "@chakra-ui/react";
import { hexToRGB } from "_theme/colors";
import { IGuidedTourProps, ITourStep } from "../interface/types";
import { StorageKey } from "_constants/StorageKeys";
import { MotionBox } from "_constants/motion";

const CARD_WIDTH = 350;
const CARD_HEIGHT = 240;
const GAP = 24;
const VIEWPORT_PADDING = 20;

export const GuidedTour = ({ onComplete, tourStep }: IGuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(true);

  const computeTooltipPosition = useCallback(
    (rect: DOMRect, preferred: ITourStep["position"]) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let finalPosition = preferred;

      if (
        preferred === "bottom" &&
        rect.bottom + GAP + CARD_HEIGHT > viewportHeight
      )
        finalPosition = "top";

      if (preferred === "top" && rect.top - GAP - CARD_HEIGHT < 0)
        finalPosition = "bottom";

      if (
        preferred === "right" &&
        rect.right + GAP + CARD_WIDTH > viewportWidth
      )
        finalPosition = "left";

      if (preferred === "left" && rect.left - GAP - CARD_WIDTH < 0)
        finalPosition = "right";

      let top = 0;
      let left = 0;

      switch (finalPosition) {
        case "bottom":
          top = rect.bottom + GAP;
          left = centerX - CARD_WIDTH / 2;
          break;
        case "top":
          top = rect.top - GAP - CARD_HEIGHT;
          left = centerX - CARD_WIDTH / 2;
          break;
        case "right":
          top = centerY - CARD_HEIGHT / 2;
          left = rect.right + GAP;
          break;
        case "left":
          top = centerY - CARD_HEIGHT / 2;
          left = rect.left - GAP - CARD_WIDTH;
          break;
      }

      return {
        top: Math.max(
          VIEWPORT_PADDING,
          Math.min(top, viewportHeight - CARD_HEIGHT - VIEWPORT_PADDING),
        ),
        left: Math.max(
          VIEWPORT_PADDING,
          Math.min(left, viewportWidth - CARD_WIDTH - VIEWPORT_PADDING),
        ),
      };
    },
    [],
  );

  const updatePosition = useCallback(() => {
    const step = tourStep?.[currentStep];
    const el = document.querySelector(step?.target);

    if (!el) return;

    const rect = el.getBoundingClientRect();
    setTargetRect(rect);

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    const position = computeTooltipPosition(rect, step?.position);
    setTooltipPos(position);
  }, [currentStep, computeTooltipPosition]);

  useEffect(() => {
    const timer = setTimeout(updatePosition, 200);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [updatePosition]);

  const next = () => {
    if (currentStep === tourStep?.length - 1) finish();
    else setCurrentStep((s) => s + 1);
  };

  const prev = () => setCurrentStep((s) => Math.max(0, s - 1));

  const finish = () => {
    setVisible(false);
    localStorage.setItem(StorageKey.COMPLETED_GUIDED_TOUR, "true");
    localStorage.removeItem(StorageKey.ENABLED_GUIDED_TOUR);
    onComplete();
  };

  if (!visible) return null;

  const step = tourStep?.[currentStep];
  const padding = 8;

  return (
    <Box position="fixed" inset={0} zIndex={100}>
      {/* BACKDROP */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        position="absolute"
        inset={0}
        onClick={finish}
      >
        <svg width="100%" height="100%">
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {targetRect && (
                <motion.rect
                  layout
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  x={targetRect.left - padding}
                  y={targetRect.top - padding}
                  width={targetRect.width + padding * 2}
                  height={targetRect.height + padding * 2}
                  rx="14"
                  fill="black"
                />
              )}
            </mask>
          </defs>

          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.65)"
            mask="url(#tour-mask)"
          />
        </svg>
      </MotionBox>

      {/* FOCUS RING */}
      {targetRect && (
        <MotionBox
          layout
          position="absolute"
          zIndex={102}
          pointerEvents="none"
          style={{
            top: targetRect.top - padding,
            left: targetRect.left - padding,
            width: targetRect.width + padding * 2,
            height: targetRect.height + padding * 2,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          border="2px solid"
          borderColor="primary.500"
          borderRadius="xl"
          boxShadow={`0 0 0 4px ${hexToRGB("primary", 0.15)}`}
        />
      )}

      {/* TOOLTIP */}
      <MotionBox
        position="absolute"
        zIndex={101}
        animate={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          opacity: 1,
          scale: 1,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 18,
        }}
        style={{ willChange: "top, left, transform" }}
      >
        <Box
          w={`${CARD_WIDTH}px`}
          maxW="calc(100vw - 2rem)"
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderRadius="2xl"
          boxShadow="2xl"
          p={6}
        >
          {/* HEADER */}
          <Flex justifyContent="space-between" mb={4}>
            <Flex align="center" gap={2}>
              <Box
                h="28px"
                w="28px"
                borderRadius="lg"
                bg="primary.100"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icons.TbSparkles size={14} />
              </Box>

              <Box fontSize="xs" color="gray.500">
                Étape {currentStep + 1} / {tourStep?.length}
              </Box>
            </Flex>

            <BaseButton variant="outline" onClick={finish}>
              Passer
            </BaseButton>
          </Flex>

          {/* CONTENT */}
          <Box mb={5}>
            <Box fontSize="md" fontWeight="semibold" mb={2}>
              {step?.title}
            </Box>
            <Box fontSize="sm" color="gray.500">
              {step?.description}
            </Box>
          </Box>

          {/* ACTIONS */}
          <Flex justify="space-between">
            <BaseButton
              variant="outline"
              onClick={prev}
              isDisabled={currentStep === 0}
              leftIcon={<Icons.IoIosArrowRoundBack size={16} />}
            >
              Précédent
            </BaseButton>

            <BaseButton
              onClick={next}
              rightIcon={<Icons.ArrowRight size={16} />}
            >
              {currentStep === tourStep?.length - 1 ? "Commencer" : "Suivant"}
            </BaseButton>
          </Flex>
        </Box>
      </MotionBox>
    </Box>
  );
};
