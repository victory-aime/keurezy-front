'use client';

import { Card, Center, Flex, HStack, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import {
  BaseButton,
  BaseIcon,
  BaseText,
  FloatSwitchColorMode,
  TextVariant,
  TextWeight,
} from '_components/custom';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { VariablesColors } from '_theme/variables';
import { FaLock } from 'react-icons/fa6';
import { APP_ROUTES } from '_config/routes';
import { ASSETS } from '_assets/images';
import { useColorMode } from '_components/ui/color-mode';
import { hexToRGB } from '_theme/colors';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Flex direction="column" minH="100vh">
      <Flex width={'full'} p={4} justifyContent={'space-between'}>
        <Link href={APP_ROUTES.ROOT}>
          <HStack>
            <Image
              src={colorMode === 'light' ? ASSETS.LOGO : ASSETS.LOGO_DARK}
              width={45}
              height={45}
              alt="logo"
            />
            <BaseText variant={TextVariant.L} weight={TextWeight.Bold} color={'primary.500'}>
              MyImmo
            </BaseText>
          </HStack>
        </Link>

        <BaseButton
          variant={'outline'}
          colorType={'neutral'}
          onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}
        >
          <BaseText color={'gray.500'}>{t('COMMON.LOGIN')}</BaseText>
        </BaseButton>
      </Flex>
      <Center w="full" flex={1} px={4} py={{ base: 4, md: 16 }}>
        <Card.Root
          size="md"
          w="full"
          maxW={{ base: '100%', md: '450px' }}
          border="none"
          backdropFilter={{ base: 'none', md: 'blur(14px)' }}
          css={{
            WebkitBackdropFilter: { base: 'none', md: 'blur(14px)' },
          }}
          borderRadius={{ base: 'none', md: '2xl' }}
          boxShadow={{ base: 'none', md: '0 20px 40px rgba(0,0,0,0.15)' }}
        >
          <Card.Header alignItems="center" gap={3}>
            <BaseIcon
              borderRadius={'12px'}
              color={hexToRGB('red', 0.1)}
              borderColor={hexToRGB('red', 0.5)}
              borderWidth={2}
              boxSize={'50px'}
            >
              <FaLock size={22} color={VariablesColors.red} />
            </BaseIcon>

            <Card.Title fontSize="xl">{'Accès restreint'}</Card.Title>
            <VStack fontSize="sm" color="gray.500" textAlign="center">
              Vous ne disposez pas des autorisations nécessaires pour afficher cette page.Si vous
              pensez qu’il s’agit d’une erreur, contactez votre administrateur.
            </VStack>
          </Card.Header>
          <Card.Body px={{ base: 0, md: 6 }} gap={3}>
            <BaseButton onClick={() => router.replace(APP_ROUTES.AUTH.SIGN_IN)}>
              {t('COMMON.LOGIN')}
            </BaseButton>
            <BaseButton
              variant={'outline'}
              colorType={'neutral'}
              onClick={() => router.replace(APP_ROUTES.AUTH.ONBOARD)}
            >
              <BaseText color={'gray.500'}>S'inscrire</BaseText>
            </BaseButton>
          </Card.Body>
        </Card.Root>
      </Center>
      <FloatSwitchColorMode />
    </Flex>
  );
}
