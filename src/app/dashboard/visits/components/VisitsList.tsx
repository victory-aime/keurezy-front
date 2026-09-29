'use client';

import {
  BaseContainer,
  BaseAgenda,
  BaseText,
  Icons,
  DeleteModalAnimation,
} from '_components/custom';
import { useUserContext } from '_context/user-context';
import { PropertyModule, TeamModule, VisitsModule } from '_store/state-management';
import { ENUM } from '_types/';
import { FormikValues } from 'formik';
import { useMemo, useState } from 'react';
import { MODELS } from '_types/';
import { createListCollection, parseDate } from '@chakra-ui/react';
import { mergeDateAndTime, normalizeToDate } from '_components/custom/form/utils/gerenateTime';
import { format } from 'date-fns';
import { VisitForm } from './VisitForm';
import { VisitDetails } from './VisiteDetails';
import { CalendarEvent } from '_components/custom/agenda/interface/agenda';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { pickVisitRefs } from '_utils/visits';

export const VisitsList = () => {
  const { hasPermission } = usePermissions();
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedValues, setSelectedValues] = useState<MODELS.IVisitResponse | null>(null);
  const agencyId = user?.agencyId!;
  const userId = user?.ownerId! ?? user?.staffId!;

  // Période affichée par l'agenda (AAAA-MM-JJ) : seules ses visites sont chargées
  const [range, setRange] = useState<{ from: string; to: string } | null>(null);

  const queryPayload = useMemo(
    () => ({
      params: { agencyId: agencyId!, ...range },
      // La requête attend la première période signalée par l'agenda
      queryOptions: { enabled: !!agencyId && !!userId && !!range },
    }),
    [agencyId, userId, range],
  );

  // `isFetching` : l'agenda garde la période précédente affichée pendant le chargement
  const {
    data: visitsList,
    refetch,
    isLoading,
    isFetching,
  } = VisitsModule.getAllVisitByAgencyQueries(queryPayload);

  // Listes du formulaire, chargées à son ouverture et selon les permissions (sinon 403)
  const canSchedule = hasPermission(AppPermissions.VISITS.SCHEDULE);
  const formQuery = (permission: boolean) => ({
    params: { agencyId },
    queryOptions: { enabled: open && !!agencyId && !!userId && permission },
  });
  const { data: agencyClients, isLoading: clientsLoading } = VisitsModule.agencyClientsQueries(
    formQuery(canSchedule),
  );
  // ponytail: 100 biens au plus dans la liste ; recherche asynchrone au-delà
  const { data: properties, isLoading: propertiesLoading } =
    PropertyModule.getAllPropertiesByAgency({
      params: { agencyId, limitPerPage: 100 },
      queryOptions: formQuery(hasPermission(AppPermissions.PROPERTIES.VIEW)).queryOptions,
    });
  const { data: team } = TeamModule.getAllTeamByAgency(
    formQuery(hasPermission(AppPermissions.USERS.VIEW)),
  );

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

  const agendaEvents = (visitsList ?? []).map((visit: MODELS.IVisitResponse) => ({
    id: visit?.id!,
    title: visit?.title!,
    date: visit?.scheduledAt ? visit?.scheduledAt : new Date(),
    start: visit?.startTime ? visit?.startTime : new Date(),
    end: visit?.endTime ? visit?.endTime : new Date(),
    status: visit?.status!,
    description: visit?.notes,
    meta: visit,
  }));

  /** Clients qui ont réservé ou écrit à l'agence (filtrés par le backend). */
  const clientList = createListCollection({
    items: (agencyClients ?? []).map((client) => ({
      label: `${client.user.name} · ${client.user.email}`,
      value: client.id,
    })),
  });

  const propertyList = createListCollection({
    items: (properties?.content ?? []).map((property) => ({
      label: property.title,
      value: property.id,
    })),
  });

  /** Agents assignables : membres actifs de l'équipe. */
  const agentList = createListCollection({
    items: (team ?? [])
      .filter((member) => member.status === ENUM.COMMON.Status.ACTIVE)
      .map((member) => ({ label: member.name ?? '', value: member.id ?? '' })),
  });

  const handleSubmitValues = async (values: FormikValues) => {
    const refs = pickVisitRefs(values);
    const request: MODELS.IVisitPayload = {
      startTime: mergeDateAndTime(values.scheduledAt, values.startTime),
      endTime: mergeDateAndTime(values.scheduledAt, values.endTime),
      scheduledAt: normalizeToDate(values?.scheduledAt),
      ...refs,
      status: refs.status as ENUM.COMMON.Status | undefined,
      notes: values.notes,
      title: values.title,
    };

    if (selectedValues?.id) {
      // Client et bien ne se modifient pas après création (non acceptés par visits/update)
      const { clientId, propertyId, ...changes } = request;
      updateVisit({
        payload: { ...changes, visitId: selectedValues?.id },
      });
    } else {
      await createVisit({
        payload: request,
        params: { data: { agencyId } },
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
        loading={isLoading || isFetching}
        onRangeChange={({ from, to }) =>
          setRange({ from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd') })
        }
        // Sans permission de planifier, un clic sur l'agenda n'ouvre pas le formulaire
        onCreate={
          hasPermission(AppPermissions.VISITS.SCHEDULE)
            ? (date) => {
                setOpen(true);
                setSelectedValues({
                  scheduledAt: parseDate(format(new Date(date!), 'yyyy-MM-dd')),
                });
              }
            : undefined
        }
        onSelectEvent={(event) => {
          setSelectedValues(event.meta as MODELS.IVisitResponse);
          setOpenModal(true);
        }}
        renderEventSubtitle={(event: CalendarEvent<any>) => (
          <BaseText fontSize={'xs'}>{event.meta?.property?.title}</BaseText>
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
        data={selectedValues}
        isLoading={isCreatePending || isUpdatePending}
        clientList={clientList}
        propertyList={propertyList}
        agentList={agentList}
        listsLoading={clientsLoading || propertiesLoading}
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
