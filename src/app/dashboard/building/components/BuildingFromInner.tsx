import { VStack, Flex, FileUploadRootProvider, useFileUpload } from '@chakra-ui/react';
import {
  FormTextInput,
  FormSelect,
  Icons,
  BaseText,
  ActionsButton,
  FormTextArea,
  useBaseFileUpload,
} from '_components/custom';
import { BaseUploadMultipleFiles } from '_components/custom/drag-drop/base/BaseUploadMultipleFiles';
import { cityList } from '_constants/city';
import { useFormikValidationToast } from '_hooks/useFormikValidationToast';
import { useRouter } from 'next/navigation';
import { FormCard } from '../../components/FormCard';
import { DASHBOARD_ROUTES } from '../../routes';
import { buildingStatusList, getLandsList } from '../constants/building';
import { MODELS } from '_types/*';
export const BuildingFormInner = ({
  buildingId,
  isCreateBuilding,
  isUpdateBuilding,
  isAllLandLoad,
  documentsURL,
  landsData,
}: {
  buildingId: string;
  isCreateBuilding: boolean;
  isAllLandLoad: boolean;
  isUpdateBuilding: boolean;
  documentsURL: string[];
  landsData: { content: MODELS.LandResponseDto[] };
}) => {
  const router = useRouter();
  const { validateAndSubmit } = useFormikValidationToast();
  const { handleSubmit, setFieldValue } = require('formik').useFormikContext();
  const fileUpload = useBaseFileUpload();

  return (
    <FileUploadRootProvider value={fileUpload}>
      <VStack gap={3} alignItems={'flex-end'} width={'full'}>
        <Flex width={'full'} gap={4} flexDir={{ base: 'column', sm: 'row' }}>
          <FormCard title="Informations principales">
            <VStack width={'full'} mt={4} gap={4}>
              <FormTextInput
                required
                name="name"
                label="Nom du bâtiment"
                placeholder="Residence Bosh"
              />
              <FormSelect
                required
                name="city"
                label="Ville"
                listItems={cityList}
                setFieldValue={setFieldValue}
              />
              <FormTextInput
                required
                name="address"
                label="Adresse complète"
                placeholder="Cite avion ouakam"
              />
              <FormTextInput
                required
                name="buildingOwner"
                label="Nom du propriétaire du bâtiment"
                placeholder="Ahmed Toure"
              />
            </VStack>
          </FormCard>

          <FormCard title="Informations secondaires">
            <VStack width={'full'} mt={4} gap={4}>
              <FormTextInput name="district" label="Quartier" placeholder="Grand Dakar" />
              <FormTextInput type="number" name="floors" label="Nombre d'étages" min={1} />
              <FormSelect
                name="landId"
                label="Terrain"
                placeholder="Lier ce bâtiment à un terrain"
                listItems={getLandsList({
                  content: landsData?.content ?? [],
                })}
                isLoading={isAllLandLoad}
                setFieldValue={setFieldValue}
              />
              <FormSelect
                name="status"
                label="Status"
                listItems={buildingStatusList}
                setFieldValue={setFieldValue}
              />
              <BaseUploadMultipleFiles
                initialImageUrls={documentsURL}
                getFilesUploaded={(files) => setFieldValue('documents', files)}
                label={
                  <Flex fontSize={'sm'} alignItems={'center'} gap={2}>
                    <Icons.Paper />
                    <BaseText fontSize={'sm'}>Documents(images, pdf, etc...)</BaseText>
                  </Flex>
                }
              />
            </VStack>
          </FormCard>
        </Flex>
        <FormTextArea
          name="description"
          label="Description du bâtiment"
          placeholder="Décrivez les caractérisques du bâtiment plus en details ici...."
          maxCharacters={10000}
          autoresize
        />

        <ActionsButton
          validateTitle={buildingId ? 'Modifier' : 'Ajouter'}
          isLoading={isCreateBuilding || isUpdateBuilding}
          onCancel={() => router.push(DASHBOARD_ROUTES.BUILDING.LIST)}
          onClick={() => validateAndSubmit(handleSubmit)}
          icon={buildingId ? <Icons.Edit /> : <Icons.PlusMinus />}
        />
      </VStack>
    </FileUploadRootProvider>
  );
};
