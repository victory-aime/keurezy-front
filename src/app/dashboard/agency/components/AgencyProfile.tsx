import { Flex, FileUploadRootProvider, Stack, chakra, VStack, HStack } from '@chakra-ui/react';
import {
  BaseText,
  TextVariant,
  CustomSkeletonLoader,
  BaseUploadImageFile,
  FormTextInput,
  FormTextArea,
  Icons,
  FormPhonePicker,
  BaseButton,
  useBaseFileUpload,
  BaseTag,
} from '_components/custom';
import { ACCEPTED_TYPES } from '_components/custom/drag-drop/constant/constants';
import { useGlobalLoader } from '_context/loaderContext';
import { MODELS, VALIDATION } from '_types/*';
import { Formik, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';
import { Panel } from './Panel';

export const AgencyProfile = ({
  agency,
  canEdit,
  isPending,
  loadInfo,
  initialAgencyValues,
  handleUpdateAgency,
}: {
  canEdit: boolean;
  agency: MODELS.IAgency | undefined;
  isPending: boolean;
  loadInfo: boolean;
  initialAgencyValues: MODELS.IAgency;
  handleUpdateAgency: (values: FormikValues) => void;
}) => {
  const { t } = useTranslation();
  const { showLoader } = useGlobalLoader();
  const fileUpload = useBaseFileUpload({
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
  });

  return (
    <Panel
      title="Profil public"
      description={
        canEdit
          ? 'Ce que voient les clients : logo, nom, présentation et coordonnées.'
          : 'Ce que voient les clients, en lecture seule : la modification demande la permission « Modifier le profil de l’agence ».'
      }
    >
      {loadInfo ? (
        <CustomSkeletonLoader type="FORM" width={'100%'} />
      ) : (
        <>
          <Flex
            gap={3}
            rounded="7px"
            bg="bg.subtle"
            alignItems={{ base: 'flex-start', sm: 'center' }}
            flexDirection={{ base: 'column', sm: 'row' }}
          >
            {agency && <BaseTag status={agency.status} />}
            <BaseText variant={TextVariant.S} color="fg.muted">
              {isPending
                ? 'Votre agence est en cours de validation : elle sera visible dès son approbation.'
                : 'Votre agence est active et visible par les utilisateurs de la plateforme.'}
            </BaseText>
          </Flex>
          <Formik
            enableReinitialize
            initialValues={initialAgencyValues as MODELS.IAgency}
            onSubmit={(values) => {
              showLoader();
              handleUpdateAgency(values);
            }}
            validationSchema={VALIDATION.AGENCY_VALIDATION.updateAgencyValidationSchema}
          >
            {({ handleSubmit, setFieldValue, errors }) => (
              <FileUploadRootProvider value={fileUpload}>
                <Stack gap={5} mt={5} width={'full'}>
                  <chakra.fieldset
                    disabled={!canEdit}
                    display="flex"
                    minW={0}
                    width="full"
                    gap={6}
                    flexDirection={{ base: 'column', md: 'row' }}
                  >
                    <VStack
                      width={{ base: 'full', md: '200px' }}
                      maxW={{ base: '220px', md: 'none' }}
                      alignSelf={{ base: 'center', md: 'flex-start' }}
                      flexShrink={0}
                      gap={2}
                      alignItems="stretch"
                    >
                      <BaseText fontWeight="semibold">Logo</BaseText>
                      {/* Logo entier, sans recadrage ; un clic le remplace */}
                      <BaseUploadImageFile
                        getFileUploaded={(file) => setFieldValue('agencyLogo', file)}
                        avatarImage={agency?.agencyLogo}
                        messageInfo={errors?.agencyLogo}
                        ratio={1}
                        contain
                        showBorder
                      />
                      <BaseText variant={TextVariant.XS} color="fg.muted">
                        Cliquez sur l’image pour la remplacer. PNG, JPEG ou WebP, 2 Mo max.
                      </BaseText>
                    </VStack>

                    <VStack width="full" gap={4} alignItems="flex-start">
                      <FormTextInput name="name" label="PROFILE.NAME" />
                      <FormTextArea
                        name="description"
                        label="Description de l’agence"
                        placeholder="Présentez brièvement votre agence, ses services ou sa spécialité."
                        maxCharacters={500}
                      />
                      <HStack width="full" gap={4} flexDirection={{ base: 'column', md: 'row' }}>
                        <FormTextInput
                          name="address"
                          label="Adresse de l'agence"
                          leftAccessory={<Icons.MapPin />}
                        />
                        <FormPhonePicker
                          name="phone"
                          label="Téléphone professionnel"
                          listAvailableCountries={['sn']}
                        />
                      </HStack>
                    </VStack>
                  </chakra.fieldset>
                  {canEdit && (
                    <Flex justifyContent="flex-end">
                      <BaseButton onClick={() => handleSubmit()}>
                        {t('Sauvegarder les changements')}
                      </BaseButton>
                    </Flex>
                  )}
                </Stack>
              </FileUploadRootProvider>
            )}
          </Formik>
        </>
      )}
    </Panel>
  );
};
