'use client';
import { createListCollection, Flex } from '@chakra-ui/react';
import {
  BaseContainer,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
} from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { LeadsModule, TeamModule } from '_store/state-management';
import { CONSTANTS, ENUM, MODELS } from '_types/*';
import { useMemo, useState } from 'react';
import { formatDisplayDate } from 'rise-core-frontend';
import { LeadsStatsCard } from './LeadStatsCard';
import { LeadsDetailsModal } from './LeadsDetailsModal';
import { useUserContext } from '_context/user-context';
import { AssignLeadModal } from './AssignLeadModal';

export const LeadsList = () => {
  const { user } = useUserContext();
  const [open, setOpen] = useState<boolean>(false);
  const [openAssign, setOpenAssign] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedValues, setSelectedValues] = useState<MODELS.ILeadsAgency>(
    {} as MODELS.ILeadsAgency,
  );

  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const {
    data: agencyLeadsList,
    isLoading: agencyLeadsLoad,
    refetch: refetchAgencyLeads,
  } = LeadsModule.agencyLeadsListQueries({
    params: {
      agencyId,
      userId,
      initialPage: currentPage,
      limitPerPage: CONSTANTS.PAGINATION.FIVE_ITEMS_PER_PAGE,
    },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const { data: allTeams, isLoading: isTeamLoad } = TeamModule.getAllTeamByAgency({
    params: {
      agencyId,
      userId,
    },
    queryOptions: { enabled: !!agencyId && !!userId },
  });

  const { mutateAsync: assignAgentLeads, isPending: isLeadAssign } =
    LeadsModule.assignAgentLeadsMutation({
      mutationOptions: {
        onSuccess: async () => {
          setOpenAssign(false);
          await refetchAgencyLeads();
        },
      },
    });

  const pendingRequestCountForSelected = useMemo(() => {
    if (!agencyLeadsList || !selectedValues?.propertyId) return 0;

    return agencyLeadsList?.filter(
      (r) => r.propertyId === selectedValues.propertyId && r.status === ENUM.COMMON.Status.NEW,
    ).length;
  }, [agencyLeadsList, selectedValues]);

  const leadsColumns: ColumnsDataTable[] = [
    {
      header: 'ID',
      accessor: 'id',
      cell: (value) => <BaseText truncate>{value?.slice(0, 8)}</BaseText>,
    },
    {
      header: 'Candidat',
      accessor: 'client',
      cell: (value) => {
        return (
          <Flex alignItems={'center'} gap={2} textTransform={'capitalize'}>
            <Avatar name={value.user?.name} bgColor={'primary.100'} />
            {value?.user?.name}
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
        {
          name: 'assign',
          handleClick(data) {
            setSelectedValues(data);
            setOpenAssign(true);
          },
        },
      ],
    },
  ];

  const paginationAction = async (page: number) => {
    setCurrentPage(page);
  };

  const handleAssignment = async (values: MODELS.IAssignAgentLeads) => {
    if (!agencyId || !userId) return;
    await assignAgentLeads({
      payload: {
        agencyId,
        leadId: selectedValues?.id,
        staffId: values?.staffId?.[0],
        userId,
      },
    });
  };

  const agentList = createListCollection({
    items:
      allTeams?.map((agent) => ({
        label: `${agent?.name} - ${agent?.email}`,
        value: agent?.id,
      })) || [],
  });

  return (
    <BaseContainer
      title={'Candidatures'}
      border={'none'}
      loader={agencyLeadsLoad}
      description={'Gérez les demandes de location sur vos biens'}
      withActionButtons
      actionsButtonProps={{
        isEmailVerified: user?.emailVerified,
        onReload: async () => await refetchAgencyLeads(),
      }}
    >
      <LeadsStatsCard agencyLeadsList={agencyLeadsList ?? []} isLoading={agencyLeadsLoad} />

      <DataTableContainer
        data={agencyLeadsList ?? []}
        columns={leadsColumns}
        isLoading={agencyLeadsLoad}
        initialPage={currentPage}
        // paginationData={{
        //   lazy: true,
        //   currentPage: currentPage,
        //   onLazyLoad: (index) => paginationAction(index),
        //   totalItems: agencyLeadsList?.totalItems,
        //   totalPages: agencyLeadsList?.totalPages,
        //   totalDataPerPage: agencyLeadsList?.totalDataPerPage!,
        // }}
        hidePagination={agencyLeadsList?.length === 1}
      />
      <LeadsDetailsModal
        onChange={setOpen}
        isOpen={open}
        data={selectedValues}
        callback={() => {}}
        onReject={() => {
          setOpen(false);
        }}
        isLoading={false}
        isEmailVerified={user?.emailVerified}
        pendingRequestCountForSelected={pendingRequestCountForSelected}
      />
      <AssignLeadModal
        isOpen={openAssign}
        onChange={() => setOpenAssign(false)}
        agentList={agentList}
        isLoading={isLeadAssign}
        callback={handleAssignment}
        staffListLoad={isTeamLoad}
      />
    </BaseContainer>
  );
};
