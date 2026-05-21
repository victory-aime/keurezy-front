'use client';

import {
  BaseContainer,
  BaseAgenda,
  BaseText,
  Icons,
  DeleteModalAnimation,
} from '_components/custom';
import { useUserContext } from '_context/user-context';
import { VisitsModule, LeadsModule } from '_store/state-management';
import { ENUM } from '_types/';
import { FormikValues } from 'formik';
import { useMemo, useState } from 'react';
import { MODELS } from '_types/';
import { createListCollection, parseDate } from '@chakra-ui/react';
import { mergeDateAndTime, normalizeToDate } from '_components/custom/form/utils/gerenateTime';
import { format } from 'date-fns';
import { VisitForm } from './VisitForm';
import { VisitDetails } from './VisiteDetails';

export const VisitsList = () => {
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedValues, setSelectedValues] = useState<MODELS.IVisitResponse | null>(null);
  const agencyId = user?.agencyId!;
  const userId = user?.ownerId! ?? user?.staffId!;

  const queryPayload = useMemo(
    () => ({
      params: {
        agencyId,
        userId,
      },
      queryOptions: {
        enabled: !!agencyId && !!userId,
      },
    }),
    [agencyId],
  );

  const {
    data: visitsList,
    refetch,
    isLoading,
  } = VisitsModule.getAllVisitByAgencyQueries({
    params: {
      data: { agencyId, userId },
    },
    queryOptions: { enabled: !!userId && !!agencyId },
  });

  const { data: leadsRequestList } = LeadsModule.agencyLeadsListQueries(queryPayload);

  const { mutateAsync: createVisit, isPending: isCreatePending } =
    VisitsModule.createNewVisitsMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetch();
          setOpen(false);
        },
      },
    });

  const { mutateAsync: updateVisit, isPending: isUpdatePending } = VisitsModule.updateVisitMutation(
    {
      mutationOptions: {
        onSuccess: async () => {
          await refetch();
          setOpen(false);
        },
      },
    },
  );

  const { mutateAsync: deleteVisit, isPending: isDeletePending } = VisitsModule.cancelVisitMutation(
    {
      mutationOptions: {
        onSuccess: async () => await refetch(),
      },
    },
  );

  const agendaEvents = (visitsList ?? []).map((visit) => ({
    id: visit?.id!,
    title: visit?.title!,
    date: visit?.scheduledAt ? visit?.scheduledAt : new Date(),
    start: visit?.startTime ? visit?.startTime : new Date(),
    end: visit?.endTime ? visit?.endTime : new Date(),
    status: visit?.status!,
    description: visit?.notes,
    meta: visit,
  }));

  const leadList = createListCollection({
    items:
      leadsRequestList?.map((item) => ({
        label: `Demande ${item?.property?.title} - faite par ${item?.client?.user?.name}`,
        value: item.id,
      })) || [],
  });

  const extractRestValues = (leadId?: string) => {
    if (!leadId || !leadsRequestList?.length) {
      return null;
    }

    return leadsRequestList.find((item) => item.id === leadId) ?? null;
  };

  const handleSubmitValues = async (values: FormikValues) => {
    const leadId = values?.leadId?.[0];
    const additionalValues = extractRestValues(leadId);

    if (!additionalValues) {
      return;
    }
    const { assignedToId, id, propertyId } = additionalValues;
    if (!id || !propertyId) {
      return;
    }

    const request: MODELS.IVisitPayload = {
      startTime: mergeDateAndTime(values.scheduledAt, values.startTime),
      endTime: mergeDateAndTime(values.scheduledAt, values.endTime),
      scheduledAt: normalizeToDate(values?.scheduledAt),
      agentId: assignedToId,
      leadId: id,
      status: values?.status && values?.status?.[0],
      notes: values.notes,
      title: values.title,
      propertyId,
    };

    if (selectedValues?.id) {
      updateVisit({
        payload: { ...request, visitId: selectedValues?.id },
        params: { data: { agencyId, userId } },
      });
    } else {
      await createVisit({
        payload: request,
        params: { data: { agencyId, userId } },
      });
    }
  };

  return (
    <BaseContainer
      border={'none'}
      withActionButtons
      title={'Rendez-vous'}
      icon={<Icons.Calendar />}
      description={` Planifiez et gérez les visites de vos biens`}
      actionsButtonProps={{
        onReload: async () => {
          await refetch();
        },
      }}
    >
      <BaseAgenda
        events={agendaEvents ?? []}
        loading={isLoading}
        onCreate={(date) => {
          setOpen(true);
          setSelectedValues({
            scheduledAt: parseDate(format(new Date(date!), 'yyyy-MM-dd')),
          });
        }}
        onSelectEvent={(event) => {
          console.log(event.meta);
          setSelectedValues(event.meta as MODELS.IVisitResponse);
          setOpenModal(true);
        }}
        renderEventSubtitle={(event) => (
          <BaseText fontSize={'xs'}>{event.meta?.lead?.property?.title}</BaseText>
        )}
        statuses={[
          ENUM.COMMON.Status.PLANNED,
          ENUM.COMMON.Status.DONE,
          ENUM.COMMON.Status.CONFIRMED,
          ENUM.COMMON.Status.CANCELLED,
        ]}
      />

      <VisitForm
        onChange={setOpen}
        isOpen={open}
        callback={handleSubmitValues}
        extractRestValues={extractRestValues}
        data={selectedValues}
        isLoading={isCreatePending || isUpdatePending}
        leadList={leadList}
      />
      <VisitDetails
        isOpen={openModal}
        onChange={() => setOpenModal(false)}
        data={selectedValues}
        onEdit={() => {
          setOpenModal(false);
          setOpen(true);
          setSelectedValues(selectedValues);
        }}
        onDelete={() => {
          setOpenModal(false);
          setOpenDelete(true);
          setSelectedValues(selectedValues);
        }}
      />
      <DeleteModalAnimation
        title={'Annuler cette visite ?'}
        onChange={setOpenDelete}
        isOpen={openDelete}
        isLoading={isDeletePending}
        ignoreFooter={false}
        buttonSaveTitle={"Valider l'annulation"}
        callback={async () =>
          await deleteVisit({
            params: {
              data: {
                agencyId,
                userId,
                visitId: selectedValues?.id!,
              },
            },
          })
        }
      >
        <BaseText textAlign={'center'}>
          Vous êtes sur le point d’annuler cette visite. Cette action mettra automatiquement à jour
          son statut et pourra notifier le client ainsi que les membres concernés de votre agence.
        </BaseText>
      </DeleteModalAnimation>
    </BaseContainer>
  );
};
