import {
  BaseButton,
  BaseModal,
  BaseText,
  FormOtpInput,
  Icons,
  ModalOpenProps,
} from '_components/custom';
import {
  QrCode,
  VStack,
  HStack,
  Box,
  Circle,
  AbsoluteCenter,
  Spinner,
  DownloadTrigger,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { ReactNode } from 'react';
import { CiLock } from 'react-icons/ci';
import { useTotp } from '_hooks/useTotp';
import { VALIDATION } from '_types/';
import { handleApiSuccess } from '_utils/handleApiSuccess';
import { totpErrorMessage } from '_utils/totp';

interface TotpQrCodeProps {
  isOpen: boolean;
  /** Fermeture sans activation : la 2FA reste désactivée côté serveur */
  onChange: ModalOpenProps['onChange'];
  /** Premier code valide : la 2FA est désormais active */
  onVerified: () => void;
  data: { totpURI: string; backupCodes: string[] };
}

/** Étape numérotée : pastille, titre, aide, puis le contenu de l'étape. */
const Step = ({
  index,
  title,
  hint,
  children,
}: {
  index: number;
  title: string;
  hint: string;
  children: ReactNode;
}) => (
  <HStack as="li" alignItems={'flex-start'} gap={3} width={'full'}>
    <Circle size={7} bg={'primary.500'} color={'white'} fontSize={'sm'} fontWeight={'bold'}>
      {index}
    </Circle>
    <VStack alignItems={'flex-start'} gap={2} flex={1} minW={0}>
      <Box>
        <BaseText fontWeight={'semibold'}>{title}</BaseText>
        <BaseText fontSize={'sm'} color={'fg.muted'}>
          {hint}
        </BaseText>
      </Box>
      {children}
    </VStack>
  </HStack>
);

/**
 * Activation de la 2FA : scan du QR code, sauvegarde des codes de secours, puis saisie d'un
 * premier code. Le backend n'active la 2FA qu'à ce premier code valide (`verifyTotp`) : un scan
 * raté ne peut donc pas bloquer le compte.
 */
export const TotpQrCode = ({ isOpen, onChange, onVerified, data }: TotpQrCodeProps) => {
  const { verifyTotp, isLoading } = useTotp();

  return (
    <BaseModal
      title={'Activer la double authentification'}
      icon={<CiLock />}
      iconBackgroundColor={'tertiary.500'}
      isOpen={isOpen}
      onChange={onChange}
      ignoreFooter
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <VStack as="ol" listStyleType={'none'} gap={6} width={'full'}>
        <Step
          index={1}
          title="Scannez le QR code"
          hint="Avec Google Authenticator, Microsoft Authenticator ou une application équivalente."
        >
          <Box borderWidth={1} borderColor={'border'} rounded={'lg'} p={3} alignSelf={'center'}>
            <QrCode.Root size={'xl'} value={data?.totpURI}>
              <QrCode.Frame>
                <QrCode.Pattern />
              </QrCode.Frame>
              {!data?.totpURI && (
                <AbsoluteCenter bg="bg/80" boxSize="100%">
                  <Spinner color="primary.500" />
                </AbsoluteCenter>
              )}
            </QrCode.Root>
          </Box>
        </Step>

        <Step
          index={2}
          title="Sauvegardez vos codes de secours"
          hint="Ils vous permettent de vous connecter si vous perdez votre téléphone. Chaque code ne sert qu’une fois."
        >
          <DownloadTrigger
            data={data?.backupCodes?.join('\n') ?? ''}
            fileName="keurezy-codes-de-secours.txt"
            mimeType="text/plain"
            asChild
          >
            <BaseButton
              variant="outline"
              width="full"
              leftIcon={<Icons.Download />}
              disabled={!data?.backupCodes?.length}
            >
              Télécharger les codes de secours
            </BaseButton>
          </DownloadTrigger>
        </Step>

        <Formik
          initialValues={{ totpCode: Array(6).fill('') }}
          validationSchema={VALIDATION.TOTP_VALIDATION.totpValidationSchema}
          onSubmit={async (values, helpers) => {
            const result = await verifyTotp(values.totpCode.join(''));
            if (!result || 'status' in result) {
              await helpers.setFieldValue('totpCode', Array(6).fill(''), false);
              helpers.setFieldError('totpCode', totpErrorMessage(result?.status));
              return;
            }
            handleApiSuccess({ status: 200, message: 'Double authentification activée' });
            onVerified();
          }}
        >
          {({ handleSubmit }) => (
            <Step
              index={3}
              title="Confirmez avec un code"
              hint="Saisissez le code à 6 chiffres affiché par l’application. La 2FA ne s’active qu’à cette étape."
            >
              <FormOtpInput
                name="totpCode"
                isDisabled={isLoading}
                onChangeFunction={() => handleSubmit()}
              />
              <BaseButton width={'full'} isLoading={isLoading} onClick={() => handleSubmit()}>
                Vérifier et activer
              </BaseButton>
            </Step>
          )}
        </Formik>
      </VStack>
    </BaseModal>
  );
};
