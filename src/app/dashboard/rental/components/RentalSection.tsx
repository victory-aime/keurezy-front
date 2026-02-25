import { VStack, Flex, HStack, Span } from "@chakra-ui/react";
import { BaseText } from "_components/custom";

export const RentalModalSection = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <VStack alignItems="flex-start" width="full">
    <Flex alignItems="center" gap={2} color="primary.500">
      {icon}
      <BaseText fontWeight="semibold">{title}</BaseText>
    </Flex>
    {children}
  </VStack>
);

export const RentalInfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) => (
  <HStack color={"gray.400"}>
    {icon}
    <BaseText>
      {label}: <Span color={"black"}>{value ?? "-"}</Span>
    </BaseText>
  </HStack>
);
