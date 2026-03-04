"use client";

import {
  BaseContainer,
  BaseFormatNumber,
  BaseText,
  ColumnsDataTable,
  TextVariant,
  TextWeight,
  BaseTag,
  DataTableContainer,
} from "_components/custom";
import { RentalAgreementModule, UserModule } from "_store/state-management";
import { ENUM } from "_types/*";
import { Flex, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";
import { TenantStatsCard } from "./TenantStatsCard";
import { Avatar } from "_components/ui/avatar";
import { convertDateFormat } from "rise-core-frontend";

export const TenantsList = () => {
  const router = useRouter();

  const { data: user } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });

  const {
    data: rentalAgreementList,
    isLoading,
    refetch: refetchAgreementList,
  } = RentalAgreementModule.getRentalAgreementListByAgencyQueries({
    params: {
      agencyId: user?.propertyOwner?.propertyAgency?.id,
    },
    queryOptions: {
      enabled: !!user?.propertyOwner?.propertyAgency?.id,
    },
  });

  const tenantsColumns: ColumnsDataTable[] = [
    {
      header: "",
      accessor: "select",
    },
    {
      header: "Locataire",
      accessor: "tenant",
      cell: (data) => {
        return (
          <Flex
            width={"full"}
            gap={2}
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <Avatar name={data?.name} src={data?.image} />
            <VStack alignItems={"flex-start"} gap={0}>
              <BaseText
                variant={TextVariant.XS}
                weight={TextWeight.SemiBold}
                lineHeight={1}
              >
                {data?.name}
              </BaseText>
              <BaseText
                variant={TextVariant.XS}
                lineClamp={1}
                color={"gray.600"}
              >
                {data?.email}
              </BaseText>
            </VStack>
          </Flex>
        );
      },
    },
    {
      header: "Propriété occupée",
      accessor: "property",
      cell: (data) => {
        return <BaseText color={"gray.600"}>{data?.title}</BaseText>;
      },
    },
    {
      header: "Loyer",
      accessor: "rentAmount",
      cell: (price: number) => <BaseFormatNumber value={price} />,
    },

    {
      header: "Status",
      accessor: "status",
      cell: (status: ENUM.COMMON.Status) => <BaseTag status={status} />,
    },
    {
      header: "Début de bail",
      accessor: "startDate",
      cell: (date: string) => <BaseText>{convertDateFormat(date)}</BaseText>,
    },
    {
      header: "Actions",
      accessor: "actions",
      actions: [
        {
          name: "chat",
          handleClick(data) {
            router.push(DASHBOARD_ROUTES.MESSAGES);
          },
        },
      ],
    },
  ];

  return (
    <BaseContainer
      border={"none"}
      title={"Locataires"}
      description={"Gérez vos locataires et leurs baux"}
      loader={isLoading}
      numberOfLines={2}
      withActionButtons
      actionsButtonProps={{
        validateTitle: "Ajouter un locataire",
        onReload: async () => {
          await refetchAgreementList();
        },
        onClick: () => {
          router.push(DASHBOARD_ROUTES.TENANTS.ADD);
        },
      }}
    >
      <TenantStatsCard
        rentalAgreementList={rentalAgreementList ?? []}
        isLoading={isLoading}
      />
      <DataTableContainer
        data={rentalAgreementList ?? []}
        columns={tenantsColumns}
        isLoading={isLoading}
        hidePagination
      />
    </BaseContainer>
  );
};
