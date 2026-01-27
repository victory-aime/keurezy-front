import { Flex, For, VStack } from "@chakra-ui/react";
import {
  BaseModal,
  BaseText,
  ModalOpenProps,
  TextVariant,
} from "_components/custom";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StorageKey } from "_constants/StorageKeys";
import { ImFlag } from "react-icons/im";
import { VariablesColors } from "_theme/variables";
import { FlagImagesIcon } from "./flag/FlagImages";
import { FlagKeys } from "_assets/images/flag";
import { hexToRGB } from "_theme/colors";
import { listLanguages } from "_constants/languages";
import { useSession } from "next-auth/react";

interface IProps extends ModalOpenProps {
  language: string;
}

export const SelectLanguages: FC<IProps> = ({ onChange, isOpen, language }) => {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [selectLanguage, setSelectLanguage] = useState<string>(i18n.language);
  const [fallbackLoad, setFallbackLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const onSubmitValues = async (newLanguage: string) => {
    const currentLanguage = i18n.language;
    if (newLanguage === currentLanguage || loading) return;

    setFallbackLoad(true);
    setSelectLanguage(newLanguage);
    setLoading(true);

    try {
      await i18n.changeLanguage(newLanguage);
      localStorage.setItem(StorageKey.LANGUAGE, newLanguage);

      onChange?.(!isOpen);
    } catch (error) {
      await i18n.changeLanguage(currentLanguage);
      localStorage.setItem(StorageKey.LANGUAGE, currentLanguage);
      setSelectLanguage(currentLanguage);
      console.error("Language change failed:", error);
    } finally {
      setLoading(false);
      setFallbackLoad(false);
    }
  };

  useEffect(() => {
    if (language) {
      i18n
        .changeLanguage(language)
        .then(() => localStorage.setItem(StorageKey.LANGUAGE, language));
      setSelectLanguage(language);
    }
  }, [language]);

  return (
    <BaseModal
      iconBackgroundColor={"secondary.500"}
      icon={<ImFlag />}
      isOpen={isOpen}
      title={"SELECT_LANGUAGES"}
      onChange={onChange}
      ignoreFooter
    >
      <VStack gap={5} alignItems={"flex-start"}>
        <BaseText variant={TextVariant.XS}>
          {t("SELECT_LANGUAGES_DESC")}
        </BaseText>
        <Flex
          gap={6}
          mt={6}
          width="full"
          alignItems="center"
          justifyContent="center"
          pointerEvents={loading ? "none" : "auto"}
          opacity={loading ? 0.6 : 1}
        >
          <For each={listLanguages}>
            {(language, i) => (
              <Flex
                key={i}
                alignItems="center"
                justifyContent="center"
                padding={4}
                borderWidth={2}
                borderColor={
                  selectLanguage === language
                    ? VariablesColors.secondary
                    : hexToRGB("lighter", 0.6)
                }
                boxShadow={selectLanguage === language ? "lg" : "none"}
                borderTopRightRadius="20px"
                borderBottomLeftRadius="20px"
                cursor="pointer"
                onClick={() => onSubmitValues(language)}
              >
                <FlagImagesIcon
                  isLoading={fallbackLoad && selectLanguage === language}
                  countryImage={language?.toUpperCase() as FlagKeys}
                  style={{ width: "30px", height: "30px" }}
                />
              </Flex>
            )}
          </For>
        </Flex>
      </VStack>
    </BaseModal>
  );
};
