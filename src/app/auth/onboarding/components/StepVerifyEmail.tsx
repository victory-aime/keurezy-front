'use client';

import { Box, HStack, VStack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { BaseButton, BaseText, FormOtpInput, Icons, TextVariant } from '_components/custom';
import { OnboardCardWrapper } from './OnboardCardWrapper';
import { GridContainer } from './GridContainer';

/** Délai avant de pouvoir redemander un code (limite aussi les envois). */
const RESEND_DELAY_S = 60;

/**
 * Étape « Vérification » : code à 6 chiffres reçu par e-mail. L'agence n'est créée qu'avec une
 * adresse vérifiée (le backend le contrôle aussi) ; la validation se fait avec « Continuer ».
 */
export const StepVerifyEmail = ({
  email,
  onResend,
}: {
  email: string;
  onResend: () => Promise<boolean>;
}) => {
  const { setFieldValue } = useFormikContext<{ otp: string }>();
  const [wait, setWait] = useState(RESEND_DELAY_S);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const resend = async () => {
    setSending(true);
    const sent = await onResend();
    setSending(false);
    if (sent) {
      setFieldValue('otp', '');
      setWait(RESEND_DELAY_S);
    }
  };

  return (
    <GridContainer alignItems="start">
      <VStack gap={6} align="stretch">
        <VStack gap={3} align="flex-start">
          <BaseText
            as="h2"
            fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}
            fontWeight="bold"
            lineHeight={1.1}
          >
            Vérifiez votre adresse e-mail
          </BaseText>
          <BaseText color="fg.muted">
            Nous avons envoyé un code à 6 chiffres à <b>{email}</b>. Il protège votre compte et
            votre future agence.
          </BaseText>
        </VStack>

        <OnboardCardWrapper>
          <VStack gap={4} align="stretch">
            <FormOtpInput name="otp" label="Code reçu par e-mail" required />
            <HStack justifyContent="space-between" flexWrap="wrap" gap={2}>
              <BaseText variant={TextVariant.XS} color="fg.muted">
                Pas reçu ? Vérifiez vos courriers indésirables.
              </BaseText>
              <BaseButton
                variant="ghost"
                colorType="primary"
                size="sm"
                isLoading={sending}
                disabled={wait > 0 || sending}
                onClick={resend}
              >
                <Icons.Refresh aria-hidden />
                {wait > 0 ? `Renvoyer le code (${wait} s)` : 'Renvoyer le code'}
              </BaseButton>
            </HStack>
          </VStack>
        </OnboardCardWrapper>
      </VStack>

      <Box
        display={{ base: 'none', lg: 'flex' }}
        alignItems="center"
        justifyContent="center"
        color="primary.solid"
        animationName="fade-in"
        animationDuration="slow"
        _motionReduce={{ animation: 'none' }}
      >
        <Icons.Mail size={160} aria-hidden />
      </Box>
    </GridContainer>
  );
};
