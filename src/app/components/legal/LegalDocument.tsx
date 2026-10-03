'use client';

import { Box, Grid, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BaseText, TextVariant } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { UserLayout } from '../../layout/Layout';
import { type LegalSection, TermsArticles } from '../terms/TermsContent';

/** Page d'un document légal (CGU, confidentialité) : titre, version, sommaire collant et articles. */
export const LegalDocument = ({
  title,
  version,
  date,
  sections,
  footer,
}: {
  title: string;
  version: string;
  date: string;
  sections: LegalSection[];
  footer?: ReactNode;
}) => (
  <UserLayout>
    <Box width="full" maxW="6xl" mx="auto" px={4} py={{ base: 10, md: 16 }}>
      <Stack gap={2} mb={10}>
        <BaseText as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold">
          {title}
        </BaseText>
        <BaseText color="fg.muted">
          Version {version} · en vigueur au {date}
        </BaseText>
      </Stack>

      <Grid templateColumns={{ base: '1fr', lg: '240px minmax(0, 1fr)' }} gap={10}>
        {/* Sommaire, collant sur grand écran */}
        <Box as="nav" aria-label="Sommaire" position={{ lg: 'sticky' }} top={24} alignSelf="start">
          <Stack gap={2}>
            <BaseText variant={TextVariant.S} fontWeight="semibold">
              Sommaire
            </BaseText>
            {sections.map((section) => (
              <Link key={section.id} href={`#${section.id}`}>
                <BaseText
                  variant={TextVariant.S}
                  color="fg.muted"
                  _hover={{ color: 'primary.fg' }}
                  transition="color 0.15s"
                >
                  {section.title}
                </BaseText>
              </Link>
            ))}
          </Stack>
        </Box>

        <Stack gap={10} minW={0}>
          <TermsArticles sections={sections} />
          <BaseText variant={TextVariant.S} color="fg.muted">
            {footer ?? (
              <>
                Une question ?{' '}
                <Link href={APP_ROUTES.ROOT} style={{ textDecoration: 'underline' }}>
                  Retournez à l’accueil
                </Link>
                .
              </>
            )}
          </BaseText>
        </Stack>
      </Grid>
    </Box>
  </UserLayout>
);
