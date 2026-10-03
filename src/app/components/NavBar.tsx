import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BaseButton, BaseIconButton, BaseText, Icons } from '_components/custom';
import { Box, Flex, Stack, Container, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import { ASSETS } from '_assets/images';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '_config/routes';
import { MotionBox } from '_constants/motion';
import { useColorMode } from '_components/ui/color-mode';
import { ANCHORS } from './landing/content';

/** Ancres de la page d'accueil (préfixées par « / » pour fonctionner depuis les autres pages publiques). */
const NAV_LINKS = [
  { href: `/#${ANCHORS.features}`, label: 'Fonctionnalités' },
  { href: `/#${ANCHORS.pricing}`, label: 'Tarifs' },
  { href: `/#${ANCHORS.faq}`, label: 'FAQ' },
];
export const Navbar = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={50}
      backdropFilter="blur(5px)"
      bg="bg/85"
      borderBottomWidth="1px"
      borderColor="border"
    >
      <Container
        mx={'auto'}
        px={{ base: 6, sm: 8 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems={'center'} justifyContent={'space-between'} width={'full'}>
          <Link href={APP_ROUTES.ROOT}>
            <Image
              src={colorMode === 'light' ? ASSETS.LOGO : ASSETS.LOGO_DARK}
              alt="Keurezy, retour à l’accueil"
              width={200}
              height={200}
            />
          </Link>

          <Flex
            as="nav"
            aria-label="Navigation principale"
            gap={7}
            mx="auto"
            display={{ base: 'none', md: 'flex' }}
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <BaseText
                  fontWeight="medium"
                  color="fg.muted"
                  _hover={{ color: 'fg' }}
                  transition="color 0.15s"
                >
                  {link.label}
                </BaseText>
              </Link>
            ))}
          </Flex>

          <Flex gap={3} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
            <BaseButton variant="outline" onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}>
              Connexion
            </BaseButton>
            <BaseButton onClick={() => router.push(APP_ROUTES.AUTH.ONBOARD)}>
              Créer mon agence
            </BaseButton>
          </Flex>

          <BaseIconButton
            display={{ base: 'inline-flex', md: 'none' }}
            variant="ghost"
            label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <Icons.Close size={20} /> : <Icons.Menu size={20} />}
          </BaseIconButton>
        </Flex>
      </Container>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <MotionBox
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            borderBottomWidth="1px"
            borderColor="border"
            overflow={'hidden'}
          >
            <Box px={4} py={4} spaceY={2}>
              <Stack as="nav" aria-label="Navigation principale" gap={1} mb={3}>
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    <BaseText fontWeight="medium" py={2}>
                      {link.label}
                    </BaseText>
                  </Link>
                ))}
              </Stack>
              <Stack alignItems={'center'} pt={2} gap={2} width={'full'}>
                <BaseButton
                  variant="outline"
                  width={'full'}
                  onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
                >
                  Connexion
                </BaseButton>
                <BaseButton width={'full'} onClick={() => router.push(APP_ROUTES.AUTH.ONBOARD)}>
                  Créer mon agence
                </BaseButton>
              </Stack>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
