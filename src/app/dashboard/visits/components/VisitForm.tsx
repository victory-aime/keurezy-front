import { Formik, FormikValues } from 'formik';
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
import { CONSTANTS, ENUM, VALIDATION } from '_types/';

export const VisitForm = ({
  isOpen,
  callback = () => {},
  data,
  isLoading,
  onChange,
  clientList,
  propertyList,
  agentList,
  listsLoading,
}: ModalOpenProps) => {
  // Valeurs Formik : les sélecteurs Chakra portent des listes d'identifiants
  const [initialValues, setInitialValues] = useState<FormikValues>({});

  useEffect(() => {
    if (data) {
      setInitialValues({
        title: data?.title,
        clientId: data?.client?.id ? [data.client.id] : undefined,
        propertyId: data?.property?.id ? [data.property.id] : undefined,
        agentId: data?.agentId ? [data.agentId] : undefined,
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
  const isEdit = !!data?.id;
  // Aucun client ne peut encore être invité : l'enregistrement d'une nouvelle visite est bloqué
  const noClient = !isEdit && !listsLoading && clientList?.items?.length === 0;

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
          disabled={visitDone || noClient}
          showEditButton={!visitDone}
        >
          <VStack gap={4}>
            {/* Client et bien fixés à la création : non modifiables ensuite (backend) */}
            <FormSelect
              name={'clientId'}
              label={'Client'}
              placeholder={listsLoading ? 'Chargement des clients…' : 'Choisir le client'}
              listItems={clientList}
              isDisabled={isEdit || listsLoading || noClient}
              setFieldValue={setFieldValue}
            />
            {noClient && (
              <Box width={'full'} borderRadius={'lg'} p={2} bg={'orange.subtle'} role={'status'}>
                Aucun client : un client apparaît ici après une réservation ou un message à votre
                agence.
              </Box>
            )}
            <FormSelect
              name={'propertyId'}
              label={'Bien'}
              placeholder={listsLoading ? 'Chargement des biens…' : 'Choisir le bien'}
              listItems={propertyList}
              isDisabled={isEdit || listsLoading}
              setFieldValue={setFieldValue}
            />
            <FormSelect
              name={'agentId'}
              label={'Agent (facultatif)'}
              placeholder={'Assigner un agent'}
              listItems={agentList}
              isDisabled={visitDone}
              setFieldValue={setFieldValue}
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
