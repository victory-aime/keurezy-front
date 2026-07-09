import { VStack, Flex, HStack, Box, FileUploadRootProvider } from '@chakra-ui/react';
import {
  FormTextInput,
  FormSelect,
  Icons,
  BaseText,
  ActionsButton,
  BaseTag,
  FormTextArea,
  useBaseFileUpload,
} from '_components/custom';
import { useFormikValidationToast } from '_hooks/useFormikValidationToast';
import { useRouter } from 'next/navigation';
import { FormCard } from '../../components/FormCard';
import { DASHBOARD_ROUTES } from '../../routes';
import { FormContainer } from '../../components/FormContainer';
import { CONSTANTS, MODELS } from '_types/*';
import { annonceStatusList, propertiesList } from '../constants/annonce';
import { ACCEPTED_TYPES } from '_components/custom/drag-drop/constant/constants';
import { BaseUploadMultipleImageList } from '_components/custom/drag-drop/base/BaseUploadMultipleImageList';

export const AnnonceFormInner = ({
  annonceId,
  isCreateAnnonce,
  isUpdate,
  galleryImagesUrl,
  allProperties,
}: {
  annonceId: string;
  isCreateAnnonce: boolean;
  isUpdate: boolean;
  galleryImagesUrl: string[];
  allProperties: MODELS.IPropertyResponse[];
}) => {
  const router = useRouter();
  const fileUpload = useBaseFileUpload({
    accept: ACCEPTED_TYPES,
  });
  const { validateAndSubmit } = useFormikValidationToast();
  const { handleSubmit, setFieldValue, values, errors } = require('formik').useFormikContext();

  const extractPropertyValues = (propertyId: string) => {
    if (!propertyId) return;

    const data = allProperties?.find((item) => item?.id === propertyId);

    if (!data) return;
    setFieldValue('loyer', data.price ?? null);
    setFieldValue('area', data.area ?? null);
    setFieldValue('rooms', data.rooms ?? null);
    setFieldValue('bathrooms', data.bathrooms ?? null);
    setFieldValue('propertyType', [data.type]);
  };

  return (
    <FileUploadRootProvider value={fileUpload}>
      <FormContainer
        pageTitle={!annonceId ? 'Créer une annonce' : "Modifier l'annonce"}
        pageDescription={'Liez une propriété, ajoutez des visuels et publiez votre annonce'}
      >
        <Flex width={'full'} gap={4} alignItems={'flex-start'}>
          <FormCard title="Propriete associé & Contenu de l'annonce">
            <VStack width={'full'} gap={4} mt={4}>
              <FormSelect
                required
                name="propertyId"
                label="Proprieté"
                setFieldValue={setFieldValue}
                placeholder={'Selectionnez une propriété'}
                listItems={propertiesList(allProperties)}
                onChangeFunc={(value) => {
                  extractPropertyValues(value?.[0]);
                }}
              />
              <HStack width={'full'}>
                <FormTextInput
                  required
                  name="title"
                  label="Titre de l'annonce"
                  placeholder={'Ex: Maginfique appartement lumineux à louer'}
                />
                <FormSelect
                  required
                  name="status"
                  label="Status"
                  setFieldValue={setFieldValue}
                  listItems={annonceStatusList}
                />
              </HStack>
              <FormTextArea
                required
                name="description"
                label="Description"
                placeholder={"Décrivez l'annonce et ses points fort"}
              />

              <BaseUploadMultipleImageList
                label={"Photos de l'annonce"}
                getFilesUploaded={(file) => setFieldValue('galleryImages', file)}
                initialImageUrls={galleryImagesUrl}
                messageInfo={errors?.galleryImages}
                isError={!!errors?.galleryImages}
              />
            </VStack>
          </FormCard>

          <FormCard
            title="Données de la propriété"
            description="Ces informations proviennent de la propriété et ne sont pas modifiables ici."
            width={'1/2'}
          >
            {values && values?.propertyId?.[0] ? (
              <VStack gap={3} width={'full'} mt={4} alignItems={'flex-start'}>
                <FormTextInput name="loyer" label="Prix mensuel" isDisabled type="amount" />
                <FormTextInput name="area" label="Surface" isDisabled />
                <FormTextInput name="rooms" label="Chambres" isDisabled />
                <FormTextInput name="bathrooms" label="Salles de bain" isDisabled />
                <HStack>
                  Type de propriété{' '}
                  <BaseTag
                    label={
                      CONSTANTS.propertyTypes.find(
                        (type) => type.value === values?.propertyType?.[0],
                      )?.label || values?.propertyType
                    }
                    color={'blue'}
                  />
                </HStack>
              </VStack>
            ) : (
              <Box p={3} border={'2px dashed'} rounded={'lg'} borderColor={'border'} mt={4}>
                <BaseText textAlign={'center'} fontSize={'md'} maxWidth={'xl'}>
                  Sélectionnez une propriété pour afficher ses données.
                </BaseText>
              </Box>
            )}
          </FormCard>
        </Flex>

        <ActionsButton
          alignItems={'flex-end'}
          justifyContent={'flex-end'}
          validateTitle={annonceId ? 'Modifier' : 'Ajouter'}
          isLoading={isCreateAnnonce || isUpdate}
          onCancel={() => router.push(DASHBOARD_ROUTES.ANNONCES.LIST)}
          onClick={() => validateAndSubmit(handleSubmit)}
          icon={annonceId ? <Icons.Edit /> : <Icons.PlusMinus />}
        />
      </FormContainer>
    </FileUploadRootProvider>
  );
};
