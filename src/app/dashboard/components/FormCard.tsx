import { Box, VStack } from "@chakra-ui/react";
import {
  BaseContainer,
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
    <BaseContainer
      mt={4}
      title={title}
      description={description}
      textVariant={TextVariant.M}
    >
      {children}
    </BaseContainer>
  );
};
