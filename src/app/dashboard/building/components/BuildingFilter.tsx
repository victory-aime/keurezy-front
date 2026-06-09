import { HStack, VStack } from '@chakra-ui/react';
import {
  ActionsButton,
  FormSelect,
  FormTextInput,
  Icons,
  ModalOpenProps,
} from '_components/custom';
import { Formik } from 'formik';
import { buildingStatusList } from '../constants/building';
import { cityList } from '_constants/city';
import { MODELS } from '_types/*';
import { useEffect, useState } from 'react';

export const BuildingFilter = ({
  onChange,
  isLoading,
  callback = () => {},
  data,
}: ModalOpenProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (data) {
      setShow(true);
    }
  }, [data]);

  return (
    <Formik
      enableReinitialize
      initialValues={{} as MODELS.IBuildingFilter}
      onSubmit={callback}
      onReset={onChange}
    >
      {({ setFieldValue, handleSubmit, resetForm }) => (
        <VStack width={'full'} gap={4} alignItems={'flex-end'} justifyContent={'flex-end'}>
          <HStack width={'full'}>
            <FormTextInput name="name" label="Nom" placeholder="rechercher par nom" />
            <FormSelect
              name="city"
              label="Ville"
              placeholder="rechercher par ville"
              listItems={cityList}
              setFieldValue={setFieldValue}
            />
            <FormSelect
              name="status"
              label="Statut"
              listItems={buildingStatusList}
              setFieldValue={setFieldValue}
            />
          </HStack>
          <ActionsButton
            onClick={() => handleSubmit()}
            onCancel={() => resetForm()}
            cancelShow={show}
            cancelVariant={'outline'}
            cancelTitle={'COMMON.CLEAR_FILTER'}
            alignItems={'flex-end'}
            justifyContent={'flex-end'}
            validateTitle="Appliquer les filtres"
            isLoading={isLoading}
            icon={<Icons.Search />}
          />
        </VStack>
      )}
    </Formik>
  );
};
