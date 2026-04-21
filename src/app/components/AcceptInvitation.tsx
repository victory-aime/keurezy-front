'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BaseButton, BaseText, Icons, Loader } from '_components/custom';
import { Box, Center, VStack } from '@chakra-ui/react';
import { APP_ROUTES } from '_config/routes';
import { MotionBox } from '_constants/motion';
import { AnimatedCheckmark } from '../auth/onboarding/components/AnimatedCheck';
import { confettiColors } from '../auth/onboarding/components/FinalStep';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { MODELS } from '_types/*';
import { InvitationModule } from '_store/state-management';
import { authClient } from '../lib/auth-client';

export const AcceptInvitation = ({ params }: { params: string }) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [state, setState] = useState<MODELS.InvitationVerificationState>('loading');

  const { mutateAsync: acceptInvitation } = InvitationModule.acceptInvitationMutation({
    mutationOptions: {
      onSuccess: async (data) => {
        await authClient.signIn
          .email({
            email: data?.email,
            password: data?.password,
          })
          .then(() => {
            setState('success');
          });
      },
      onError: (data) => {
        setState(data.code as MODELS.InvitationVerificationState);
      },
    },
  });

  const handleVerifyInvitationToken = async (token: string) => {
    await acceptInvitation({ params: { token } });
  };

  function resolveInvitationState(key: string): MODELS.InvitationVerificationState {
    switch (key) {
      case 'token':
        return 'loading';
      case 'token_expired':
        return 'ERR_BAD_REQUEST';
      default:
        return 'loading';
    }
  }

  useEffect(() => {
    if (params) {
      const mapped = resolveInvitationState(params);
      setState(mapped);
      handleVerifyInvitationToken(params);
    }
  }, [params]);

  return (
    <main>
      {state === 'loading' && (
        <Center h={'100vh'}>
          <Loader loader showText />
        </Center>
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
              <BaseText fontSize={{ base: '4xl', sm: '5xl' }} fontWeight={'bold'}>
                🎉 Invitation acceptée !
              </BaseText>
              <BaseText fontSize={'lg'} maxW={'lg'} mx={'auto'}>
                Vous avez accepté l'invitation. Vous pouvez désormais accéder à votre espace de
                gestion locative. en cliquant sur le bouton ci-dessous, vous serez redirigé vers
                votre tableau de bord.
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
      {state === 'ERR_BAD_REQUEST' && (
        <Center h={'100vh'}>
          <VStack spaceY={6}>
            <AnimatedCheckmark type="error" />
            <BaseText fontSize={'2xl'} fontWeight={'bold'}>
              L'invitation est invalide ou a expiré
            </BaseText>
            <BaseText fontSize={'md'}>
              Veuillez contacter l'administrateur de votre agence pour recevoir une nouvelle
              invitation.
            </BaseText>
          </VStack>
        </Center>
      )}
    </main>
  );
};
