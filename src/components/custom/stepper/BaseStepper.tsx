"use client";

import { Box, Steps } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { BaseStepperProps } from "./interface/stepper";
import { LuCheck } from "react-icons/lu";

export const BaseStepper: FC<BaseStepperProps> = ({
  steps,
  goNextSteps,
  linear = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleStepChange = (step: number) => {
    const index = steps.findIndex((item) => item.stepNumber === step);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    goNextSteps(currentIndex);
  }, [currentIndex]);

  return (
    <Steps.Root
      w={"100%"}
      linear={linear}
      count={steps?.length}
      defaultStep={currentIndex}
      defaultValue={steps[currentIndex]?.stepNumber}
      variant={"solid"}
      colorPalette={"purple"}
      onStepChange={({ step }) => {
        handleStepChange(step);
      }}
      p={{ base: 2, md: 0 }}
    >
      <Steps.List>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index}>
            <Steps.Indicator>
              <Steps.Status incomplete={step.icon} complete={<LuCheck />} />
            </Steps.Indicator>
            <Steps.Title>{step.label}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>

      {steps.map((step, index) => (
        <Steps.Content
          key={index}
          index={index}
          _open={{
            animationName: "fade-in, scale-in",
            animationDuration: "300ms",
          }}
          _closed={{
            animationName: "fade-out, scale-out",
            animationDuration: "120ms",
          }}
        >
          {step.content({
            NextTrigger: ({ children }) => (
              <Steps.NextTrigger asChild>{children}</Steps.NextTrigger>
            ),
            PrevTrigger: ({ children }) => (
              <Steps.PrevTrigger asChild>{children}</Steps.PrevTrigger>
            ),
          })}
        </Steps.Content>
      ))}
    </Steps.Root>
  );
};
