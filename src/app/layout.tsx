import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "react-day-picker/dist/style.css";
import "react-international-phone/style.css";
import "_components/custom/agenda/index.css";
import GlobalApplicationProvider from "_context/provider/GlobalApplicationProvider";
import { ThemeProvider } from "_components/ui/provider";
import { LoaderProvider } from "_context/loaderContext";
import { Toaster } from "_components/ui/toaster";
import { I18nProvider } from "_context/provider/i18n-provider";
import { AuthContextProvider } from "_context/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://app.myimmo-platform.com"),

  title: {
    default: "MyIMMO Platform",
    template: "%s | MyIMMO Platform",
  },

  description:
    "Plateforme moderne de gestion immobilière. Gérez vos biens, locataires et demandes de location facilement depuis un tableau de bord centralisé.",

  keywords: [
    "gestion immobilière",
    "property management",
    "gestion locative",
    "immobilier SaaS",
    "MyIMMO management",
  ],

  authors: [{ name: "MyIMMO Platform Team" }],

  openGraph: {
    title: "MyIMMO Platform",
    description:
      "Gérez vos biens immobiliers, locataires et demandes de location depuis une plateforme moderne.",
    url: "https://app.MyIMMO-platform.com",
    siteName: "MyIMMO Platform",
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "MyIMMO Platform",
    description:
      "Plateforme moderne pour gérer vos biens immobiliers et vos locataires.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalApplicationProvider>
          <ThemeProvider>
            <LoaderProvider>
              <Toaster />
              <AuthContextProvider>
                <I18nProvider>{children}</I18nProvider>
              </AuthContextProvider>
            </LoaderProvider>
          </ThemeProvider>
        </GlobalApplicationProvider>
      </body>
    </html>
  );
}
