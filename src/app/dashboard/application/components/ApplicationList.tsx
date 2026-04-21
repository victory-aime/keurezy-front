'use client';
import { Flex } from '@chakra-ui/react';
import {
  BaseContainer,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
} from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { RentalAgreementModule, ApplicationModule, UserModule } from '_store/state-management';
import { CONSTANTS, ENUM, MODELS } from '_types/*';
import { useMemo, useState } from 'react';
import { formatDisplayDate } from 'rise-core-frontend';
import { ApplicationStatsCard } from './ApplicationStatsCard';
import { ApplicationModal } from './ApplicationModal';

export const ApplicationList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValues, setSelectedValues] = useState<MODELS.IApplicationAgency>(
    {} as MODELS.IApplicationAgency,
  );

  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });

  const agencyId = user?.propertyOwner?.propertyAgency?.id;

  const {
    data: agencyApplicationList,
    isLoading: agencyApplicationLoad,
    refetch: refetchAgencyApplicationList,
  } = ApplicationModule.agencyApplicationListQueries({
    params: {
      agencyId: agencyId,
      ownerId: user?.propertyOwner?.id,
      initialPage: currentPage,
      limitPerPage: CONSTANTS.PAGINATION.FIVE_ITEMS_PER_PAGE,
    },
    queryOptions: { enabled: false },
  });

  const { refetch: refetchRentalAgreementList } =
    RentalAgreementModule.getRentalAgreementListByAgencyQueries({
      params: { agencyId, ownerId: user?.propertyOwner?.id },
      queryOptions: { enabled: false },
    });

  const { mutateAsync: approveRequest, isPending: approvePending } =
    RentalAgreementModule.approveRentalAgreementMutation({
      mutationOptions: {
        onSuccess: async () => {
          setOpen(false);
          setEnabled(true);
          await refetchRentalAgreementList();
          await refetchAgencyApplicationList();
        },
      },
    });

  const { mutateAsync: rejectRequest, isPending: rejectPending } =
    RentalAgreementModule.rejectRentalAgreementMutation({
      mutationOptions: {
        onSuccess: async () => await refetchAgencyApplicationList(),
      },
    });

  const pendingRequestCountForSelected = useMemo(() => {
    if (!agencyApplicationList?.content || !selectedValues?.property?.id) return 0;

    return agencyApplicationList?.content.filter(
      (r) =>
        r.property?.id === selectedValues.property.id && r.status === ENUM.COMMON.Status.PENDING,
    ).length;
  }, [agencyApplicationList, selectedValues]);

  const handleApprove = async () => {
    await approveRequest({
      params: {
        agencyId: agencyId,
        requestId: selectedValues?.id,
        ownerId: user?.propertyOwner?.id,
      },
    });
  };

  const handleReject = async () => {
    await rejectRequest({
      params: {
        agencyId: agencyId,
        requestId: selectedValues?.id,
        ownerId: user?.propertyOwner?.id,
      },
    });
  };

  const rentalColumns: ColumnsDataTable[] = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (value) => <BaseText truncate>{value?.slice(0, 8)}</BaseText>,
    },
    {
      header: 'Candidat',
      accessor: 'tenant',
      cell: (value: { name: string }) => {
        return (
          <Flex alignItems={'center'} gap={2} textTransform={'capitalize'}>
            <Avatar name={value.name} bgColor={'primary.100'} />
            {value?.name}
          </Flex>
        );
      },
    },
    {
      header: 'Bien concerné',
      accessor: 'property',
      cell: (value: { title: string }) => {
        return (
          <Flex alignItems={'center'} gap={2}>
            <Icons.RiBuildingLine />
            {value?.title}
          </Flex>
        );
      },
    },
    {
      header: 'Date de candidature',
      accessor: 'createdAt',
      cell: (date: string) => {
        return <BaseText>{formatDisplayDate(date)}</BaseText>;
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (status) => <BaseTag status={status} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      actions: [
        {
          name: 'view',
          handleClick(data) {
            setSelectedValues(data);
            setOpen(true);
          },
        },
      ],
    },
  ];

  const paginationAction = async (page: number) => {
    setCurrentPage(page);
  };

  return (
    <BaseContainer
      title={'Candidatures'}
      border={'none'}
      loader={agencyApplicationLoad}
      description={'Gérez les demandes de location sur vos biens'}
      withActionButtons
      actionsButtonProps={{
        isEmailVerified: user?.emailVerified,
        onReload: async () => await refetchAgencyApplicationList(),
      }}
    >
      <ApplicationStatsCard
        agencyApplicationList={agencyApplicationList!}
        isLoading={agencyApplicationLoad}
      />

      <DataTableContainer
        isOpenSelect
        data={agencyApplicationList?.content ?? []}
        columns={rentalColumns}
        isLoading={agencyApplicationLoad}
        initialPage={currentPage}
        paginationData={{
          lazy: true,
          currentPage: currentPage,
          onLazyLoad: (index) => paginationAction(index),
          totalItems: agencyApplicationList?.totalItems,
          totalPages: agencyApplicationList?.totalPages,
          totalDataPerPage: agencyApplicationList?.totalDataPerPage!,
        }}
        hidePagination={agencyApplicationList?.totalPages === 1}
        onOpenSelectRow={(row: MODELS.IApplicationAgency) => {
          setSelectedValues(row);
          setOpen(true);
        }}
      />
      <ApplicationModal
        onChange={setOpen}
        isOpen={open}
        data={selectedValues}
        callback={handleApprove}
        onReject={() => {
          handleReject();
          setOpen(false);
        }}
        isLoading={approvePending || rejectPending}
        isEmailVerified={user?.emailVerified}
        pendingRequestCountForSelected={pendingRequestCountForSelected}
      />
    </BaseContainer>
  );
};
