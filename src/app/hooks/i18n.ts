"use client";
import { StorageKey } from "_constants/StorageKeys";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useI18nInit = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const langToUse = (() => {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem(StorageKey.LANGUAGE);
        if (!savedLang) {
          localStorage.setItem(StorageKey.LANGUAGE, i18n.language);
          return i18n.language;
        }
        return savedLang;
      }
      return i18n.language;
    })();

    if (i18n.language !== langToUse) {
      i18n.changeLanguage(langToUse).finally();
    }
  }, []);
};
