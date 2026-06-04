'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BaseButton, BaseText, Icons, KeurezyLogoAnimation } from '_components/custom';
import { VerificationState } from '../auth.types';
import { resolveState } from '../resolve-state';
import { TokenExpired } from './TokenExpired';
import { TokenInvalid } from './TokenInvalid';
import { UnknownError } from './UnknownError';
import { Box, Center, VStack } from '@chakra-ui/react';
import { authClient } from '../../lib/auth-client';
import { handleApiError } from '_utils/handleApiError';
import { APP_ROUTES } from '_config/routes';
import Confetti from 'react-confetti';
import { confettiColors } from '../onboarding/components/FinalStep';
import { AnimatedCheckmark } from '../onboarding/components/AnimatedCheck';
import { MotionBox } from '_constants/motion';
import { useWindowSize } from '_hooks/useWindowSize';

export const EmailVerified = ({ params }: { params: string }) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [state, setState] = useState<VerificationState>('loading');

  const handleVerifyEmail = async (token: string) => {
    const { data, error } = await authClient.verifyEmail({
      query: { token },
    });

    if (error) {
      handleApiError({ status: error.status, message: error?.message! });
      setState(error?.code as VerificationState);
    }
    if (data?.status) {
      setState('success');
    }
  };

  useEffect(() => {
    if (params) {
      const mapped = resolveState(params);
      setState(mapped);
      handleVerifyEmail(params);
    }
  }, [params]);

  return (
    <main>
      {state === 'loading' && (
        <KeurezyLogoAnimation isExiting={state !== 'loading'} onAnimationComplete={() => {}} />
      )}
      {state === 'success' && (
        <Center h={'100vh'}>
          <VStack maxW={'5xl'} mx={'auto'} spaceY={8} position={'relative'} overflow={'hidden'}>
            <Box
              position={'fixed'}
              inset={0}
              pointerEvents={'none'}
              zIndex={50}
              overflow={'hidden'}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <Confetti
                  key={i}
                  width={width}
                  height={height}
                  numberOfPieces={4}
                  recycle={false}
                  colors={confettiColors}
                />
              ))}
            </Box>

            {/* Checkmark */}
            <AnimatedCheckmark />

            {/* Title */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              spaceY={3}
              textAlign={'center'}
            >
              <BaseText fontSize={{ base: '2xl', sm: '3xl' }} fontWeight={'bold'}>
                🎉 Adresse e-mail vérifiée avec succès !
              </BaseText>
              <BaseText fontSize={'lg'} maxW={'lg'} mx={'auto'}>
                Votre adresse e-mail a bien été confirmée. Vous pouvez désormais accéder à votre
                espace de gestion locative en toute sécurité. Cliquez sur le bouton ci-dessous pour
                être redirigé vers votre tableau de bord.
              </BaseText>
            </MotionBox>
            <BaseButton
              onClick={() => router.push(APP_ROUTES.REDIRECT)}
              rightIcon={<Icons.Rocket />}
            >
              Accéder à mon tableau de bord
            </BaseButton>
          </VStack>
        </Center>
      )}
      {state === 'TOKEN_EXPIRED' && <TokenExpired />}
      {state === 'INVALID_TOKEN' && <TokenInvalid />}
      {state === 'UNKNOWN_ERROR' && <UnknownError />}
    </main>
  );
};
