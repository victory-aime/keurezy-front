'use client';

import { BaseContainer } from '_components/custom';
import { useUserContext } from '_context/user-context';
import { VisitsModule } from '_store/state-management';
import { isSameDay } from 'date-fns';
import { Appointments } from './Appointement';

export const VisitsList = () => {
  const { user } = useUserContext();
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const { data: visitsList } = VisitsModule.getAllVisitByAgencyQueries({
    params: {
      data: { agencyId, userId },
    },
    queryOptions: { enabled: false },
  });

  const agendaEvents = (visitsList ?? []).map((visit) => ({
    id: visit.id,
    title: `${visit.lead?.client.user?.name ?? 'Client'} - ${visit?.lead?.property?.title ?? 'Bien'}`,
    start: new Date(visit.scheduledAt),
    end: new Date(new Date(visit.scheduledAt).getTime() + 60 * 60 * 1000),
    status: visit.status,
    description: visit.notes,
    meta: visit,
  }));

  const todayCount = agendaEvents?.filter((a) => isSameDay(new Date(a.start), new Date())).length;

  return (
    <BaseContainer
      border={'none'}
      //   withActionButtons
      //   description={` Planifiez et gérez les visites de vos biens — ${todayCount} visite
      //           ${todayCount > 1 ? 's' : ''} aujourd'hui.`}
      //   actionsButtonProps={{
      //     onReload: async () => {
      //       await refetch();
      //     },
      //   }}
    >
      {/* <BaseAgenda
        events={agendaEvents}
        onCreate={(date) => {
          console.log('create at', date);
        }}
        onMoveEvent={(eventId, newDate) => {
          console.log(eventId, newDate);
        }}
        onResizeEvent={(eventId, newEndDate) => {
          console.log(eventId, newEndDate);
        }}
        onSelectEvent={(event) => {
          console.log(event.meta);
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
      /> */}
      <Appointments />
    </BaseContainer>
  );
};
