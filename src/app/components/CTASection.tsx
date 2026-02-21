import { Box, Container, HStack, VStack } from "@chakra-ui/react";
import {
  BaseButton,
  BaseText,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export const CTASection = () => {
  return (
    <Box py={10} width={"full"}>
      <Container mx="auto" px={{ base: 6, sm: 8 }}>
        <MotionBox
          position={"relative"}
          bgColor={"primary.500"}
          overflow={"hidden"}
          rounded={"2xl"}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Gradient background */}
          <Box
            position="absolute"
            inset={0}
            bg={`linear-gradient(to-br, ${VariablesColors.primary}, ${VariablesColors.primary}, 0.8)`}
          />

          <Box
            position="absolute"
            top="0"
            right="0"
            w="24rem"
            h="24rem"
            rounded="full"
            bg={hexToRGB("secondary", 0.1)}
            filter="blur(96px)"
          />

          {/* Full Overlay Glass Effect */}
          <Box
            position="absolute"
            inset={0}
            backdropFilter="blur(80px)"
            bg={hexToRGB("secondary", 0.08)}
          />

          {/* Bottom Left Big Blur Blob */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            w="16rem"
            h="16rem"
            rounded="full"
            bg={hexToRGB("tertiary", 0.1)}
            filter="blur(96px)"
          />

          <VStack
            position={"relative"}
            zIndex={10}
            px={{ sm: 8, base: 4 }}
            py={{ sm: 10, base: 8 }}
            textAlign={"center"}
          >
            <BaseText
              mb={2}
              weight={TextWeight.Bold}
              fontSize={{ sm: "4xl", base: "3xl" }}
              lineHeight={"1.2"}
              color={"white"}
            >
              Prêt à simplifier votre gestion locative ?
            </BaseText>
            <BaseText
              maxW={"xl"}
              mx={"auto"}
              mb={4}
              variant={TextVariant.XL}
              color={"white"}
            >
              Rejoignez des milliers de propriétaires qui font confiance à
              RentFlow pour gérer leurs biens.
            </BaseText>
            <HStack
              gap={2}
              justifyContent={"center"}
              flexDirection={{ base: "column", md: "row" }}
            >
              <BaseButton
                width={{ base: "full", md: "fit-content" }}
                colorType="secondary"
                className="gap-2 font-semibold"
              >
                Commencer maintenant
                <Icons.ArrowRight />
              </BaseButton>

              <BaseButton
                width={{ base: "full", md: "fit-content" }}
                variant="outline"
                colorType="neutral"
              >
                Voir les propriétés
              </BaseButton>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};
