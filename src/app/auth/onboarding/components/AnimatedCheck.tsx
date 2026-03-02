import { Box } from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export const AnimatedCheckmark = () => (
  <MotionBox
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
    position={"relative"}
    mt={5}
    mx={"auto"}
  >
    <MotionBox
      animate={{
        boxShadow: [
          `0 0 0 0px ${hexToRGB("primary", 0.3)}`,
          `0 0 0 20px ${hexToRGB("primary", 0)}`,
          `0 0 0 0px ${hexToRGB("primary", 0.3)}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      h={"24"}
      w={"24"}
      bgGradient={"to-br"}
      gradientFrom={"primary.500"}
      gradientTo={"tertiary.500"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"full"}
    >
      <MotionBox
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Icons.Check size={100} strokeWidth={5} color={VariablesColors.white} />
      </MotionBox>
    </MotionBox>
  </MotionBox>
);
