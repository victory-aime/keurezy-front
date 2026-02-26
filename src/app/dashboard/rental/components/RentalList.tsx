"use client";
import { Flex } from "@chakra-ui/react";
import {
  BaseContainer,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
} from "_components/custom";
import { Avatar } from "_components/ui/avatar";
import {
  RentalAgreementModule,
  RentalModule,
  UserModule,
} from "_store/state-management";
import { ENUM, MODELS } from "_types/*";
import { useMemo, useState } from "react";
import { formatDisplayDate } from "rise-core-frontend";
import { RentalStatsCard } from "./RentalStatsCard";
import { RentalModal } from "./RentalModal";

export const RentalList = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] =
    useState<MODELS.IRentalAgencyListResponse>(
      {} as MODELS.IRentalAgencyListResponse,
    );

  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });

  const {
    data: rentalList,
    isLoading: rentalLoad,
    refetch: refetchList,
  } = RentalModule.rentalAgencyRequestListQueries({
    params: { agencyId: user?.propertyOwner?.propertyAgency?.id },
    queryOptions: { enabled: !!user?.propertyOwner?.propertyAgency?.id },
  });

  const { mutateAsync: approveRequest, isPending: approvePending } =
    RentalAgreementModule.approveRentalAgreementMutation({
      mutationOptions: { onSuccess: async () => await refetchList() },
    });

  const { mutateAsync: rejectRequest, isPending: rejectPending } =
    RentalAgreementModule.rejectRentalAgreementMutation({
      mutationOptions: { onSuccess: async () => await refetchList() },
    });

  const pendingRequestCountForSelected = useMemo(() => {
    if (!rentalList || !selectedValues?.property?.id) return 0;

    return rentalList.filter(
      (r) =>
        r.property?.id === selectedValues.property.id &&
        r.status === ENUM.COMMON.Status.PENDING,
    ).length;
  }, [rentalList, selectedValues]);

  const handleApprove = async () => {
    await approveRequest({
      params: {
        agencyId: user?.propertyOwner?.propertyAgency?.id,
        requestId: selectedValues?.id,
      },
    });
  };

  const handleReject = async () => {
    await rejectRequest({
      params: {
        agencyId: user?.propertyOwner?.propertyAgency?.id,
        requestId: selectedValues?.id,
      },
    });
  };

  const rentalColumns: ColumnsDataTable[] = [
    {
      header: "ID",
      accessor: "id",
      cell: (value) => <BaseText truncate>{value?.slice(0, 8)}</BaseText>,
    },
    {
      header: "Candidat",
      accessor: "tenant",
      cell: (value: { name: string }) => {
        return (
          <Flex alignItems={"center"} gap={2} textTransform={"capitalize"}>
            <Avatar name={value.name} bgColor={"primary.100"} />
            {value?.name}
          </Flex>
        );
      },
    },
    {
      header: "Bien concerné",
      accessor: "property",
      cell: (value: { title: string }) => {
        return (
          <Flex alignItems={"center"} gap={2}>
            <Icons.RiBuildingLine />
            {value?.title}
          </Flex>
        );
      },
    },
    {
      header: "Date de candidature",
      accessor: "createdAt",
      cell: (date: string) => {
        return <BaseText>{formatDisplayDate(date)}</BaseText>;
      },
    },
    {
      header: "Status",
      accessor: "status",
      cell: (status) => <BaseTag status={status} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      actions: [
        {
          name: "view",
          handleClick(data) {
            setSelectedValues(data);
            setOpen(true);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      title={"Candidatures"}
      border={"none"}
      p={0}
      loader={rentalLoad}
      description={"Gérez les demandes de location sur vos biens"}
      withActionButtons
      actionsButtonProps={{
        onReload: async () => await refetchList(),
      }}
    >
      <RentalStatsCard rentalList={rentalList ?? []} isLoading={rentalLoad} />

      <DataTableContainer
        data={rentalList ?? []}
        columns={rentalColumns}
        isLoading={rentalLoad}
        isOpenSelect
        onOpenSelectRow={(row: MODELS.IRentalAgencyListResponse) => {
          setSelectedValues(row);
          setOpen(true);
        }}
        hidePagination
      />
      <RentalModal
        onChange={setOpen}
        isOpen={open}
        data={selectedValues}
        callback={handleApprove}
        onReject={() => {
          handleReject();
          setOpen(false);
        }}
        isLoading={approvePending || rejectPending}
        pendingRequestCountForSelected={pendingRequestCountForSelected}
      />
    </BaseContainer>
  );
};
