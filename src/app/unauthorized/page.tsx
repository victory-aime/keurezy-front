"use client";

import React from "react";
import { Center } from "@chakra-ui/react";
import Image from "next/image";
import {
  BaseButton,
  BaseText,
  TextVariant,
  TextWeight,
} from "_components/custom";
import { IoReturnDownBack } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Center
      alignItems={"center"}
      justifyContent={"center"}
      height={"100vh"}
      flexDirection={"column"}
      padding={"2rem"}
    >
      <Image
        src="/assets/images/unauthorize.png"
        alt="Access Denied"
        width={300}
        height={300}
      />
      <BaseText variant={TextVariant.H1} weight={TextWeight.Medium}>
        {t("COMMON.UNAUTHORIZE")}
      </BaseText>
      <BaseText variant={TextVariant.M} maxW={"550px"} textAlign={"center"}>
        {t("COMMON.UNAUTHORIZE_DESC")}
      </BaseText>
      <BaseButton
        leftIcon={<IoReturnDownBack />}
        variant={"outline"}
        mt={5}
        colorType={"info"}
        onClick={() => router.back()}
      >
        {t("COMMON.BACK")}
      </BaseButton>
    </Center>
  );
}
