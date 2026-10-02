'use client';
import { Flex, HStack, Stack } from '@chakra-ui/react';
import {
  BaseButton,
  BaseContainer,
  BaseFormatNumber,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
  BaseBadge,
} from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { BookingsModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { useMemo, useState } from 'react';
import { formatDisplayDate } from 'rise-core-frontend';
import { useUserContext } from '_context/user-context';
import {
  countOverlappingPending,
  formatBookingDate,
  formatRentalDuration,
  getRentalTypeMeta,
  toTagStatus,
} from '_utils/bookings';
import { BookingsStatsCard } from './BookingsStatsCard';
import { BookingDetailsModal } from './BookingDetailsModal';
import { RejectBookingModal } from './RejectBookingModal';
import { CancelBookingDialog } from './CancelBookingDialog';

type StatusFilter = 'ALL' | ENUM.BookingStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Toutes' },
  { value: ENUM.BookingStatus.PENDING, label: 'À traiter' },
  { value: ENUM.BookingStatus.CONFIRMED, label: 'Confirmées' },
  { value: ENUM.BookingStatus.REJECTED, label: 'Refusées' },
  { value: ENUM.BookingStatus.CANCELLED, label: 'Annulées' },
  // Posé chaque nuit par le backend quand le séjour est terminé
  { value: ENUM.BookingStatus.COMPLETED, label: 'Terminées' },
];

export const BookingsList = () => {
  const { user } = useUserContext();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [selected, setSelected] = useState<MODELS.IAgencyBooking | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  // Liste complète : statistiques et chevauchements portent sur toutes les réservations
  const {
    data: bookings,
    isLoading,
    refetch,
  } = BookingsModule.agencyBookingsQueries({
    params: { agencyId: agencyId! },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const allBookings = useMemo(() => bookings ?? [], [bookings]);
  const visibleBookings = useMemo(
    () =>
      statusFilter === 'ALL'
        ? allBookings
        : allBookings.filter((booking) => booking.status === statusFilter),
    [allBookings, statusFilter],
  );

  const { mutateAsync: confirmBooking, isPending: isConfirming } =
    BookingsModule.confirmBookingMutation({
      mutationOptions: { onSuccess: () => setOpenDetails(false) },
    });

  const { mutateAsync: rejectBooking, isPending: isRejecting } =
    BookingsModule.rejectBookingMutation({
      mutationOptions: {
        onSuccess: () => {
          setOpenReject(false);
          setOpenDetails(false);
        },
      },
    });

  const { mutate: cancelBooking, isPending: isCancelling } =
    BookingsModule.agencyCancelBookingMutation({
      mutationOptions: {
        onSuccess: () => {
          setOpenCancel(false);
          setOpenDetails(false);
        },
      },
    });

  const openBooking = (booking: MODELS.IAgencyBooking) => {
    setSelected(booking);
    setOpenDetails(true);
  };

  const columns: ColumnsDataTable[] = [
    {
      header: 'Client',
      accessor: 'client',
      cell: (client: MODELS.IAgencyBooking['client']) => (
        <Flex alignItems={'center'} gap={2}>
          <Avatar name={client?.name} bgColor={'primary.100'} size={'sm'} />
          <Stack gap={0}>
            <BaseText textTransform={'capitalize'}>{client?.name ?? 'Client supprimé'}</BaseText>
            <BaseText fontSize={'xs'} color={'fg.muted'}>
              {client?.email}
            </BaseText>
          </Stack>
        </Flex>
      ),
    },
    {
      header: 'Bien',
      accessor: 'property',
      cell: (property: MODELS.IAgencyBooking['property']) => (
        <Flex alignItems={'center'} gap={2}>
          <Icons.RiBuildingLine />
          <BaseText truncate maxW={'200px'}>
            {property?.title}
          </BaseText>
        </Flex>
      ),
    },
    {
      header: 'Période',
      accessor: 'fullObject',
      cell: (booking: MODELS.IAgencyBooking) => (
        <Stack gap={1}>
          <HStack gap={2}>
            <BaseBadge
              color="tertiary"
              variant="subtle"
              size="sm"
              label={getRentalTypeMeta(booking.rentalType)?.label}
            />
            <BaseText fontSize={'xs'} color={'fg.muted'}>
              {formatRentalDuration(booking.duration, booking.rentalType)}
            </BaseText>
          </HStack>
          <BaseText fontSize={'sm'}>
            {formatBookingDate(booking.startDate)} → {formatBookingDate(booking.endDate)}
          </BaseText>
        </Stack>
      ),
    },
    {
      header: 'Montant',
      accessor: 'fullObject',
      cell: (booking: MODELS.IAgencyBooking) => (
        <Stack gap={0}>
          <BaseFormatNumber value={booking.totalAmount} currencyCode={ENUM.COMMON.Currency.XAF} />
          <BaseText fontSize={'xs'} color={'fg.muted'}>
            Caution : <BaseFormatNumber value={booking.depositAmount} />
          </BaseText>
        </Stack>
      ),
    },
    {
      header: 'Reçue le',
      accessor: 'createdAt',
      cell: (date: string) => <BaseText>{formatDisplayDate(date)}</BaseText>,
    },
    {
      header: 'Statut',
      accessor: 'status',
      cell: (status: ENUM.BookingStatus) => <BaseTag status={toTagStatus(status)} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [{ name: 'view', title: 'Voir la demande', handleClick: openBooking }],
    },
  ];

  return (
    <BaseContainer
      title={'Réservations'}
      border={'none'}
      loader={isLoading}
      description={'Traitez les demandes de réservation reçues sur vos biens'}
      withActionButtons
      actionsButtonProps={{
        isEmailVerified: user?.emailVerified,
        onReload: async () => await refetch(),
      }}
    >
      <BookingsStatsCard bookings={allBookings} isLoading={isLoading} />

      <Flex gap={2} mt={8} mb={2} flexWrap={'wrap'}>
        {STATUS_FILTERS.map((filter) => {
          const count =
            filter.value === 'ALL'
              ? allBookings.length
              : allBookings.filter((booking) => booking.status === filter.value).length;
          const isActive = statusFilter === filter.value;

          return (
            <BaseButton
              key={filter.value}
              size={'sm'}
              colorType={'primary'}
              variant={isActive ? 'solid' : 'outline'}
              withGradient={isActive}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
              <BaseBadge
                ml={1}
                size="sm"
                p={1}
                minW={6}
                color="neutral"
                variant={isActive ? 'surface' : 'subtle'}
                label={String(count)}
              />
            </BaseButton>
          );
        })}
      </Flex>

      <DataTableContainer
        data={visibleBookings}
        columns={columns}
        isLoading={isLoading}
        hidePagination={visibleBookings.length <= 1}
      />

      <BookingDetailsModal
        isOpen={openDetails}
        onChange={setOpenDetails}
        data={selected}
        overlappingPending={selected ? countOverlappingPending(selected, allBookings) : 0}
        isLoading={isConfirming}
        isEmailVerified={user?.emailVerified}
        callback={async () => {
          if (selected) await confirmBooking({ params: { id: selected.id } });
        }}
        onReject={() => setOpenReject(true)}
        onCancelBooking={() => setOpenCancel(true)}
      />

      <CancelBookingDialog
        isOpen={openCancel}
        onChange={setOpenCancel}
        booking={selected}
        isSubmitting={isCancelling}
        onConfirm={(reason) =>
          selected && cancelBooking({ payload: { reason }, params: { id: selected.id } })
        }
      />

      <RejectBookingModal
        isOpen={openReject}
        onChange={setOpenReject}
        isLoading={isRejecting}
        data={selected}
        callback={async (values: MODELS.IRejectBookingPayload) => {
          if (selected) {
            await rejectBooking({
              payload: { reason: values.reason },
              params: { id: selected.id },
            });
          }
        }}
      />
    </BaseContainer>
  );
};
