import { Box, Container, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { BaseText, Icons, TextVariant } from '_components/custom';
import { APP_ROUTES } from '_config/routes';
import { ANCHORS } from './landing/content';

const COLUMNS = [
  {
    title: 'Produit',
    links: [
      { href: `/#${ANCHORS.features}`, label: 'Fonctionnalités' },
      { href: `/#${ANCHORS.pricing}`, label: 'Tarifs' },
      { href: `/#${ANCHORS.faq}`, label: 'FAQ' },
    ],
  },
  {
    title: 'Compte',
    links: [
      { href: APP_ROUTES.AUTH.ONBOARD, label: 'Créer mon agence' },
      { href: APP_ROUTES.AUTH.SIGN_IN, label: 'Se connecter' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { href: APP_ROUTES.TERMS_OF_USE, label: 'Conditions d’utilisation' },
      { href: APP_ROUTES.PRIVACY_POLICY, label: 'Politique de confidentialité' },
    ],
  },
];

/** Pied de page public : toujours sombre, quel que soit le thème. */
export const Footer = () => (
  <Box as="footer" bg="gray.950" color="gray.300" py={{ base: 12, md: 16 }}>
    <Container maxW="7xl" px={{ base: 4, sm: 8 }}>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={10}>
        <Stack gap={3}>
          <Flex alignItems="center" gap={2}>
            <Box color="primary.400">
              <Icons.Home size={28} aria-hidden />
            </Box>
            <BaseText fontWeight="bold" fontSize="lg" color="white">
              Keurezy
            </BaseText>
          </Flex>
          <BaseText variant={TextVariant.S} color="gray.400" maxW="xs">
            Le logiciel des agences immobilières : biens, réservations, prospects et factures au
            même endroit.
          </BaseText>
        </Stack>
        {COLUMNS.map((column) => (
          <Stack key={column.title} as="nav" aria-label={column.title} gap={3}>
            <BaseText variant={TextVariant.S} fontWeight="semibold" color="white">
              {column.title}
            </BaseText>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href}>
                <BaseText
                  variant={TextVariant.S}
                  color="gray.400"
                  _hover={{ color: 'white' }}
                  transition="color 0.15s"
                >
                  {link.label}
                </BaseText>
              </Link>
            ))}
          </Stack>
        ))}
      </SimpleGrid>
      <Flex
        mt={12}
        pt={6}
        borderTopWidth="1px"
        borderColor="whiteAlpha.200"
        justifyContent="space-between"
        gap={2}
        direction={{ base: 'column', sm: 'row' }}
      >
        <BaseText variant={TextVariant.S} color="gray.500">
          © {new Date().getFullYear()} Keurezy. Tous droits réservés.
        </BaseText>
        <BaseText variant={TextVariant.S} color="gray.500">
          Conçu au Sénégal.
        </BaseText>
      </Flex>
    </Container>
  </Box>
);
