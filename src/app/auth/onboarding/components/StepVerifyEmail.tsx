'use client';

import { Flex, HStack, VStack } from '@chakra-ui/react';
import { useReducedMotion } from 'framer-motion';
import { MotionBox } from '_constants/motion';
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
  const reduceMotion = useReducedMotion();

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

        <MotionBox
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: 'easeOut' }}
        >
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
        </MotionBox>
      </VStack>

      {/* L'e-mail vient de partir : enveloppe qui se pose, ondes qui se propagent */}
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        alignItems="center"
        justifyContent="center"
        minH="360px"
        position="relative"
        aria-hidden
      >
        {!reduceMotion &&
          [0, 1, 2].map((ring) => (
            <MotionBox
              key={ring}
              position="absolute"
              boxSize="180px"
              rounded="full"
              borderWidth="2px"
              borderColor="primary.solid"
              initial={{ scale: 0.6, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 2.4, delay: ring * 0.8, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        <MotionBox
          position="relative"
          boxSize="180px"
          rounded="full"
          bg="primary.subtle"
          color="primary.solid"
          display="flex"
          alignItems="center"
          justifyContent="center"
          initial={reduceMotion ? false : { y: -60, opacity: 0, rotate: -12 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
        >
          <MotionBox
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            <Icons.Mail size={88} />
          </MotionBox>
          <MotionBox
            position="absolute"
            top="18px"
            right="22px"
            initial={reduceMotion ? false : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 14 }}
          >
            <Flex
              boxSize="34px"
              rounded="full"
              bg="success.solid"
              color="success.contrast"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="sm"
            >
              1
            </Flex>
          </MotionBox>
        </MotionBox>
      </Flex>
    </GridContainer>
  );
};
