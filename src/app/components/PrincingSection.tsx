import { motion } from "framer-motion";
import {
  BaseBadge,
  BaseButton,
  BaseFormatNumber,
  BaseText,
  Icons,
  TextVariant,
  TextWeight,
} from "_components/custom";
import {
  Box,
  Container,
  Float,
  HStack,
  List,
  SimpleGrid,
} from "@chakra-ui/react";
import { VariablesColors } from "_theme/variables";

const pricingPlans = [
  {
    name: "Starter",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Up to 3 properties",
      "Basic tenant management",
      "Online rent collection",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Professional",
    price: 29,
    description: "For growing portfolios",
    features: [
      "Up to 25 properties",
      "Advanced analytics",
      "Maintenance tracking",
      "Automated reminders",
      "Priority support",
      "Document storage",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: 79,
    description: "For large-scale management",
    features: [
      "Unlimited properties",
      "Custom reporting",
      "API access",
      "Dedicated account manager",
      "Multi-user access",
      "White-label option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const MotionBox = motion.create(Box);

export const PricingSection = () => {
  return (
    <Box py={10}>
      <Container mx="auto" px={{ base: 6, sm: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          maxW={"2xl"}
          mx={"auto"}
          mb={16}
          textAlign={"center"}
        >
          <BaseText
            color={"primary.500"}
            textTransform={"uppercase"}
            fontWeight={"semibold"}
          >
            Tarifs
          </BaseText>

          <BaseText
            fontWeight={"bold"}
            variant={TextVariant.H2}
            lineHeight={1.2}
          >
            Des prix simples et transparents
          </BaseText>
          <BaseText variant={TextVariant.L} mb={2} mt={1} color={"gray.400"}>
            Commencez gratuitement, évoluez quand vous êtes prêt.
          </BaseText>
        </MotionBox>

        <SimpleGrid
          columns={{ base: 1, sm: 3 }}
          gap={6}
          mx={"auto"}
          maxW={"5xl"}
        >
          {pricingPlans.map((plan, i) => (
            <MotionBox
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              border={"1px solid"}
              p={8}
              position={"relative"}
              rounded={"xl"}
              borderColor={plan.popular ? "primary.500" : "bg.muted"}
              shadow={plan.popular ? "2xl" : "xs"}
              scale={plan.popular ? "1.1" : "none"}
            >
              {plan.popular && (
                <Float placement={"top-center"}>
                  <BaseBadge
                    label="Populaire"
                    borderRadius={"full"}
                    color="primary"
                  />
                </Float>
              )}
              <BaseText variant={TextVariant.L} weight={TextWeight.SemiBold}>
                {plan.name}
              </BaseText>

              <BaseText variant={TextVariant.S}>{plan.description}</BaseText>

              <HStack mt={2} mb={3} fontSize={"x-large"}>
                <BaseFormatNumber value={plan.price} />
                <BaseText color={"gray.500"} variant={TextVariant.S}>
                  /mois
                </BaseText>
              </HStack>

              <BaseButton
                width={"full"}
                variant={plan.popular ? "solid" : "outline"}
                colorType={plan.popular ? "primary" : "neutral"}
                onClick={() => {}}
              >
                <BaseText color={plan.popular ? "inherit" : "black"}>
                  {plan.cta}
                </BaseText>
              </BaseButton>

              <List.Root
                gap="2"
                variant="plain"
                align="center"
                mt={4}
                spaceY={1}
              >
                {plan.features.map((f) => (
                  <List.Item
                    key={f}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <List.Indicator asChild color="tertiary.500">
                      <Icons.Check size={20} />
                    </List.Indicator>
                    {f}
                  </List.Item>
                ))}
              </List.Root>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
