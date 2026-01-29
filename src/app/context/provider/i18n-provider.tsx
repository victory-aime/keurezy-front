"use client";
import { useI18nInit } from "_hooks/i18n";
import React, { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../locales/i18n";

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  useI18nInit();
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
