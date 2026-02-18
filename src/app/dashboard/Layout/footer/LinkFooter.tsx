import { Flex, Separator, FlexProps } from "@chakra-ui/react";
import { BaseText, TextVariant } from "_components/custom";
import { APP_ROUTES } from "_config/routes";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export const LinkFooter = ({ ...rest }: FlexProps) => {
  const { t } = useTranslation();
  return (
    <Flex {...rest} gap={4}>
      <Link href={APP_ROUTES.PRIVACY_POLICY}>
        <BaseText variant={TextVariant.XS}>
          {t("COMMON.PRIVACY_POLICY")}
        </BaseText>
      </Link>
      <Separator orientation="vertical" height="4" />
      <Link href={APP_ROUTES.TERMS_OF_USE}>
        <BaseText variant={TextVariant.XS}>{t("COMMON.TERMS_OF_USE")}</BaseText>
      </Link>
      <Separator orientation="vertical" height="4" />
      <Link href={APP_ROUTES.TERMS_OF_USE}>
        <BaseText variant={TextVariant.XS}>{t("COMMON.CONTACT_US")}</BaseText>
      </Link>
    </Flex>
  );
};
