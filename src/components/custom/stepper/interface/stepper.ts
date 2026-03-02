import { StepsRootProps } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface BaseStepperProps extends StepsRootProps {
  steps: {
    icon?: ReactNode;
    label: string;
    stepNumber: number;
    content: (props: {
      NextTrigger: React.FC<{ children: ReactNode }>;
      PrevTrigger: React.FC<{ children: ReactNode }>;
    }) => ReactNode;
  }[];
  linear?: boolean;
  goNextSteps: (step: number) => void;
}

export type { BaseStepperProps };
