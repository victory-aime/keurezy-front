import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import React from 'react';
import 'react-international-phone/style.css';
import GlobalApplicationProvider from './provider/GlobalApplicationProvider';
import { ThemeProvider } from '_components/ui/provider';
import { LoaderProvider } from '_context/loaderContext';
import { Toaster } from '_components/ui/toaster';
import { I18nProvider } from './provider/i18n-provider';
import { AgencyCheckProvider } from '_context/agency-context';

const lato = Lato({
  variable: '--font-lato',
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin-ext'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://keurezy.onrender.com'),
  title: {
    default: 'Keurezy',
    template: '%s | Keurezy',
  },
  description:
    'Plateforme moderne de gestion immobilière. Gérez vos biens, locataires et demandes de location facilement depuis un tableau de bord centralisé.',
  icons: {
    icon: [{ url: '/assets/favicon-96x96.png', sizes: '96x96', type: 'image/png' }],
    apple: [{ url: '/assets/apple-touch-icon.png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },

  keywords: [
    'gestion immobilière',
    'property management',
    'gestion locative',
    'immobilier SaaS',
    'Keurezy management',
  ],
  authors: [{ name: 'Keurezy Team' }],
  openGraph: {
    title: 'Keurezy',
    description:
      'Gérez vos biens immobiliers, locataires et demandes de location depuis une plateforme moderne.',
    url: 'https://keurezy.onrender.com',
    siteName: 'Keurezy',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keurezy',
    description: 'Plateforme moderne pour gérer vos biens immobiliers et vos locataires.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
      <body className={`${lato.variable}`}>
        <GlobalApplicationProvider>
          <ThemeProvider>
            <LoaderProvider>
              <Toaster />
              <I18nProvider>
                <AgencyCheckProvider>{children}</AgencyCheckProvider>
              </I18nProvider>
            </LoaderProvider>
          </ThemeProvider>
        </GlobalApplicationProvider>
      </body>
    </html>
  );
}
