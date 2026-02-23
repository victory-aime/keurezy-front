import { HStack } from "@chakra-ui/react";
import { Icons } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { VariablesColors } from "_theme/variables";
import Link from "next/link";

export const GoBackPropertyList = ({
  link = APP_ROUTES.APPARTEMENTS,
  label = "Retour aux propriétés",
}: {
  link?: string;
  label?: string;
}) => {
  return (
    <Link href={link}>
      <HStack
        gap={2}
        color={"gray.400"}
        _hover={{ color: VariablesColors.primary }}
        width={"fit-content"}
        mb={5}
      >
        <Icons.IoIosArrowRoundBack />
        {label}
      </HStack>
    </Link>
  );
};
