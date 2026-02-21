import { Box, VStack } from "@chakra-ui/react";
import {
  BaseText,
  CustomSkeletonLoader,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { ReactNode } from "react";

export const FormCard = ({
  title = "Card title",
  description,
  children,
  isLoading,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  isLoading?: boolean;
}) => {
  return isLoading ? (
    <VStack gap={3} width={"full"}>
      <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
      <CustomSkeletonLoader type="FORM" width={"full"} />
    </VStack>
  ) : (
    <Box
      p={5}
      mt={5}
      border={"1px solid"}
      borderColor={"border"}
      width={"full"}
      rounded={"lg"}
    >
      <BaseText weight={TextWeight.Medium}>{title}</BaseText>
      <BaseText variant={TextVariant.XS}>{description}</BaseText>
      <VStack width={"full"} mt={4} gap={4}>
        {children}
      </VStack>
    </Box>
  );
};
