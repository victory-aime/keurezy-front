"use client";

import { Flex, Image, useBreakpointValue } from "@chakra-ui/react";
import React, { useState } from "react";
import { SideBarProps } from "../sidebar/types";
import {
  BaseText,
  CustomSkeletonLoader,
  TextVariant,
  Icons,
} from "_components/custom";
import { useTranslation } from "react-i18next";
import { SelectLanguages } from "_component/SelectLanguages";
import { FlagImagesIcon } from "_component/flag/FlagImages";
import { UserModule } from "_store/state-management";
import { RxHamburgerMenu } from "react-icons/rx";

export const Header = ({ onShowSidebar, data }: SideBarProps) => {
  const { t } = useTranslation();
  const [openSelectLanguage, setOpenSelectLanguage] = useState(false);

  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: false,
    lg: false,
  });

  /**
   * ⚠️ IMPORTANT
   * Le hook DOIT être appelé à chaque rendu
   * → jamais undefined
   */

  const { data: user, isLoading } = UserModule.getUserInfo({
    params: { userId: data?.session?.userId },
    queryOptions: {
      enabled: !!data?.session?.userId,
    },
  });

  return (
    <Flex
      p={4}
      justify="space-between"
      alignItems="center"
      h={{ base: "100px", md: "auto" }}
    >
      {isLoading ? (
        <CustomSkeletonLoader
          numberOfLines={1}
          type="TEXT_IMAGE"
          height="45px"
          width="200px"
          direction={{ base: "row-reverse", md: "row" } as any}
        />
      ) : (
        <Flex width="full" gap={5}>
          <Flex
            width={"full"}
            ms="2px"
            alignItems="center"
            justifyContent="flex-start"
            gap={3}
          >
            {isMobile ? <Icons.Menu onClick={onShowSidebar} /> : null}
            <Image
              alt={"user-image"}
              src={user?.image! ?? "https://avatar.iran.liara.run/public"}
              boxSize={"60px"}
              borderRadius={"7px"}
            />

            <BaseText variant={TextVariant.S}>
              {t("WELCOME", {
                username: user ? `${user.name}` : "",
              })}
            </BaseText>
          </Flex>
        </Flex>
      )}
      <FlagImagesIcon countryImage="FR" boxSize="20px" />
      <SelectLanguages
        isOpen={openSelectLanguage}
        onChange={() => setOpenSelectLanguage(false)}
        language="fr"
      />
    </Flex>
  );
};
