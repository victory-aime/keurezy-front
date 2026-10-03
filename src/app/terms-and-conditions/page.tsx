'use client';

import { Box, Grid, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { BaseText, TextVariant } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { UserLayout } from '../layout/Layout';
import {
  TERMS_DATE,
  TERMS_SECTIONS,
  TERMS_VERSION,
  TermsArticles,
} from '../components/terms/TermsContent';

export default function TermsPage() {
  return (
    <UserLayout>
      <Box width="full" maxW="6xl" mx="auto" px={4} py={{ base: 10, md: 16 }}>
        <Stack gap={2} mb={10}>
          <BaseText as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold">
            Conditions générales d’utilisation
          </BaseText>
          <BaseText color="fg.muted">
            Version {TERMS_VERSION} · en vigueur au {TERMS_DATE}
          </BaseText>
        </Stack>

        <Grid templateColumns={{ base: '1fr', lg: '240px minmax(0, 1fr)' }} gap={10}>
          {/* Sommaire, collant sur grand écran */}
          <Box
            as="nav"
            aria-label="Sommaire"
            position={{ lg: 'sticky' }}
            top={24}
            alignSelf="start"
          >
            <Stack gap={2}>
              <BaseText variant={TextVariant.S} fontWeight="semibold">
                Sommaire
              </BaseText>
              {TERMS_SECTIONS.map((section) => (
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
            <TermsArticles />
            <BaseText variant={TextVariant.S} color="fg.muted">
              Une question sur ces conditions ? Écrivez-nous depuis la page d’accueil, ou{' '}
              <Link href={APP_ROUTES.ROOT} style={{ textDecoration: 'underline' }}>
                retournez à l’accueil
              </Link>
              .
            </BaseText>
          </Stack>
        </Grid>
      </Box>
    </UserLayout>
  );
}
