import { Flex, HStack, VStack } from "@chakra-ui/react";
import { VALIDATION } from "_types/index";
import { CiCircleCheck } from "react-icons/ci";
import { VariablesColors } from "_theme/variables";
import { RiErrorWarningLine } from "react-icons/ri";
import { BaseText, TextVariant, TextWeight } from "_components/custom";
import { LuInfo } from "react-icons/lu";

export const PasswordIndicator = ({
  password,
}: {
  password: string | null;
}) => {
  return (
    <VStack align="start" width="full" gap={2} mt={2}>
      <Flex gap={1} alignItems={"center"}>
        <LuInfo size={14} color={VariablesColors.gray400} />
        <BaseText color={"gray.400"}>
          Votre mot de passe doit contenir :
        </BaseText>
      </Flex>
      {VALIDATION.AUTH.passwordValidations(password as string)?.map(
        (item, index) => (
          <HStack key={index}>
            {item?.test ? (
              <CiCircleCheck color={VariablesColors.primary} />
            ) : (
              <RiErrorWarningLine color={VariablesColors.gray400} />
            )}
            <BaseText
              color={item.test ? "primary.500" : "gray.400"}
              weight={item.test ? TextWeight.Bold : TextWeight.Regular}
              variant={TextVariant.S}
            >
              {item.label}
            </BaseText>
          </HStack>
        ),
      )}
    </VStack>
  );
};
