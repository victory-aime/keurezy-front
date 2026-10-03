import { Box, Flex, Stack } from '@chakra-ui/react';
import { Icons, BaseText, TextVariant } from '_components/custom';
import { MODELS } from '_types/*';
import { LEGAL_PROOFS, missingLabel, verificationState } from '_utils/agency-legal';

/** Note de vérification : ce qui manque (informations, puis documents), l'attente, ou le badge. */
export const VerificationNote = ({ agency }: { agency: MODELS.IAgency }) => {
  const state = verificationState(agency);
  const palette = { VERIFIED: 'success', PENDING: 'info', INCOMPLETE: 'warning' }[state];
  const missing = (agency.legalMissing ?? []) as string[];
  const isProof = (key: string) => LEGAL_PROOFS.some((proof) => proof.field === key);
  const fields = missing.filter((key) => !isProof(key)).map(missingLabel);
  const documents = missing.filter(isProof).map(missingLabel);
  return (
    <Box
      role="status"
      width="full"
      p={3}
      mt={2}
      rounded="lg"
      borderLeftWidth="4px"
      borderColor={`${palette}.solid`}
      bg={`${palette}.subtle`}
      animationName="fade-in"
      animationDuration="moderate"
      _motionReduce={{ animation: 'none' }}
    >
      <Flex alignItems="center" gap={2} color={`${palette}.fg`}>
        {state === 'VERIFIED' ? <Icons.Shield aria-hidden /> : <Icons.InfoIcon aria-hidden />}
        <BaseText fontWeight="semibold" color="inherit">
          {state === 'VERIFIED'
            ? 'Agence vérifiée'
            : state === 'PENDING'
              ? 'Vos informations sont complètes : la vérification est en cours'
              : 'Complétez vos informations légales et joignez les documents pour que votre agence puisse être vérifiée'}
        </BaseText>
      </Flex>
      {state === 'INCOMPLETE' && (
        <Stack gap={0} mt={1} pl={6}>
          {fields.length > 0 && (
            <BaseText variant={TextVariant.S}>À renseigner : {fields.join(', ')}.</BaseText>
          )}
          {documents.length > 0 && (
            <BaseText variant={TextVariant.S}>À joindre : {documents.join(', ')}.</BaseText>
          )}
        </Stack>
      )}
      {state === 'VERIFIED' && (
        <BaseText variant={TextVariant.S} mt={1} pl={6}>
          Le badge est visible par les clients. Modifier la raison sociale, le NINEA, le RCCM ou un
          document justificatif le retire jusqu’à une nouvelle vérification.
        </BaseText>
      )}
    </Box>
  );
};
