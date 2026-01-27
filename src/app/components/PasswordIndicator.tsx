import { HStack, VStack } from "@chakra-ui/react";
import { VALIDATION } from "_types/index";
import { CiCircleCheck } from "react-icons/ci";
import { VariablesColors } from "_theme/variables";
import { RiErrorWarningLine } from "react-icons/ri";
import { BaseText, TextVariant, TextWeight } from "_components/custom";

export const PasswordIndicator = ({
  password,
}: {
  password: string | null;
}) => {
  if (!password) return null;
  return (
    <VStack align="start" width="full" gap={2} mt={2}>
      {VALIDATION.USER_VALIDATION.passwordValidations(password)?.map(
        (item, index) => (
          <HStack key={index}>
            {item?.test ? (
              <CiCircleCheck color={VariablesColors.primary} />
            ) : (
              <RiErrorWarningLine color={VariablesColors.secondary} />
            )}
            <BaseText
              color={item.test ? "priamry.500" : "secondary.500"}
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
