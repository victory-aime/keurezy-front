import { Flex, Link, Separator, FlexProps } from "@chakra-ui/react";
import { BaseText, TextVariant } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

export const LinkFooter = ({ ...rest }: FlexProps) => {
  const navigate = useRouter();
  const { t } = useTranslation();
  return (
    <Flex {...rest} gap={4} fontSize="sm">
      <Link href={APP_ROUTES.LEGAL_MENTIONS} variant="plain">
        {t("COMMON.LEGAL_MENTIONS")}
      </Link>
      <Separator orientation="vertical" height="4" />
      <Link href={APP_ROUTES.SECURITY} variant="plain">
        {t("COMMON.SECURITY")}
      </Link>
      <Separator orientation="vertical" height="4" />
      <Link href={APP_ROUTES.PRIVACY_POLICY} variant="plain">
        {t("COMMON.PRIVACY_POLICY")}
      </Link>
      <Separator orientation="vertical" height="4" />
      <Link href={APP_ROUTES.TERMS_OF_USE} variant="plain">
        {t("COMMON.TERMS_OF_USE")}
      </Link>
      <Separator orientation="vertical" height="4" />
      <BaseText
        variant={TextVariant.S}
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={() => console.log("Contact Us")}
      >
        {t("COMMON.CONTACT_US")}
      </BaseText>
    </Flex>
  );
};
