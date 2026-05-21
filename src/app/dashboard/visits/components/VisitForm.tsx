import { Formik } from 'formik';
import {
  ModalOpenProps,
  BaseDrawer,
  Icons,
  FormTextInput,
  FormSelect,
  FormTimePicker,
  FormTextArea,
  BaseTag,
} from '_components/custom';
import React, { useState, useEffect } from 'react';
import { Box, createListCollection, HStack, parseDate, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { extractTime, FormDatePicker } from '_components/custom';
import { CONSTANTS, ENUM, MODELS, VALIDATION } from '_types/';

export const VisitForm = ({
  isOpen,
  callback = () => {},
  data,
  isLoading,
  onChange,
  extractRestValues,
  leadList,
}: ModalOpenProps) => {
  const [initialValues, setInitialValues] = useState<MODELS.IVisitPayload>({});

  useEffect(() => {
    if (data) {
      setInitialValues({
        title: data?.title,
        leadId: data?.lead?.id && [data?.lead?.id],
        status: data?.status && [data?.status],
        scheduledAt:
          data?.scheduledAt && parseDate(format(new Date(data?.scheduledAt!), 'yyyy-MM-dd')),
        startTime: extractTime(data?.startTime),
        endTime: extractTime(data?.endTime),
        notes: data?.notes,
      });
    }
    if (!isOpen) {
      setInitialValues({});
    }
  }, [data, isOpen]);

  const visitStatusList = createListCollection({
    items:
      CONSTANTS.visitStatus.map((visit) => ({
        label: visit.label,
        value: visit.value,
      })) || [],
  });

  const visitDone = data && data?.status === ENUM.COMMON.Status.DONE;

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...initialValues }}
      onSubmit={callback}
      validationSchema={VALIDATION.visitSchema}
    >
      {({ setFieldValue, handleSubmit, resetForm }) => (
        <BaseDrawer
          title={data?.id ? 'Modifier ce rendez-vous' : 'Nouveau rendez vous'}
          description={
            data?.id
              ? 'Mettez à jour les informations de cette visite afin de garantir une bonne coordination entre le client et les membres de votre agence.'
              : 'Planifiez une nouvelle visite et partagez automatiquement les informations importantes avec les personnes concernées.'
          }
          icon={<Icons.Calendar />}
          onChange={() => {
            onChange(!isOpen);
            resetForm();
          }}
          isOpen={isOpen}
          size={'lg'}
          callback={handleSubmit}
          isLoading={isLoading}
          disabled={visitDone}
          showEditButton={!visitDone}
        >
          <VStack gap={4}>
            <FormSelect
              name={'leadId'}
              placeholder={'Choisir la demande'}
              listItems={leadList ?? []}
              isDisabled={!!data?.id}
              setFieldValue={setFieldValue}
              onChangeFunc={(value) => extractRestValues(value?.[0])}
            />
            <FormTextInput
              name={'title'}
              placeholder={'Ajouter un titre et une heure'}
              isDisabled={visitDone}
            />

            <HStack width={'full'}>
              <FormDatePicker
                name={'scheduledAt'}
                placeholder={'Date'}
                isDisabledWeekDates
                isDisabledPassDates
                isDisabled={visitDone}
              />
              <FormTimePicker
                name={'startTime'}
                placeholder={'Heure de debut'}
                isDisabled={visitDone}
              />
              <FormTimePicker
                name={'endTime'}
                placeholder={'Heure de fin'}
                isDisabled={visitDone}
              />
            </HStack>
            <FormSelect
              name={'status'}
              placeholder={'Status'}
              listItems={visitStatusList}
              setFieldValue={setFieldValue}
              isDisabled={visitDone}
              customRenderSelected={(selectedItems) => (
                <>
                  {selectedItems?.map((item) => (
                    <BaseTag key={item.value} status={item.value} />
                  ))}
                </>
              )}
            />
            <FormTextArea
              name={'notes'}
              placeholder={'Ajouter une notes ou description'}
              isDisabled={visitDone}
            />

            <Box borderRadius={'lg'} p={2} bg={'blue.subtle'}>
              NB : Lors de la création ou de la modification de la date ou des heures d’une
              visite,le client sera automatiquement informé afin de garantir une meilleure
              disponibilité et une bonne coordination entre toutes les parties.
            </Box>
          </VStack>
        </BaseDrawer>
      )}
    </Formik>
  );
};
