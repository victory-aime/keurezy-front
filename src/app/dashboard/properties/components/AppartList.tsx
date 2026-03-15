"use client";

import {
  BaseContainer,
  BaseFormatNumber,
  BaseRatio,
  BaseText,
  ColumnsDataTable,
  TextVariant,
  TextWeight,
  DataDisplayContainer,
  BaseTag,
} from "_components/custom";
import { PropertyModule, UserModule } from "_store/state-management";
import { CONSTANTS, ENUM } from "_types/*";
import { Flex, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "../../routes";
import { AppartGridView } from "./AppartCard";
import { AppartStatsCard } from "./AppartStats";
import { useState } from "react";

export const AppartList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const { data: user } = UserModule.getUserInfo({
    queryOptions: {
      enabled: false,
    },
  });

  const {
    data: allProperties,
    isLoading,
    refetch: refectProperty,
  } = PropertyModule.getAllPropertiesByAgency({
    params: {
      agencyId: user?.propertyOwner?.propertyAgency?.id,
      ownerId: user?.propertyOwner?.id,
      limitPerPage: CONSTANTS.PAGINATION.TEN_ITEMS_PER_PAGE,
    },
    queryOptions: {
      enabled: !!user?.propertyOwner?.propertyAgency?.id,
    },
  });

  const appartColumns: ColumnsDataTable[] = [
    {
      header: "",
      accessor: "select",
    },
    {
      header: "Bien",
      accessor: "fullObject",
      cell: (data) => {
        const city = CONSTANTS.citiesByCountry?.[data.country || ""]?.find(
          (item) => item.value === data.city,
        )?.label;
        return (
          <Flex
            width={"full"}
            gap={4}
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <BaseRatio image={data?.galleryImages?.[0]} width={100} />
            <VStack alignItems={"flex-start"} gap={0}>
              <BaseText variant={TextVariant.XS} weight={TextWeight.SemiBold}>
                {data?.title}
              </BaseText>
              <BaseText
                variant={TextVariant.XS}
                lineClamp={1}
                color={"gray.600"}
              >
                {data?.address} , {city}
              </BaseText>
            </VStack>
          </Flex>
        );
      },
    },

    {
      header: "Type",
      accessor: "type",
      cell: (type: string) =>
        CONSTANTS.propertyTypes.find((item) => item.value === type)?.label ||
        type,
    },
    {
      header: "Loyer",
      accessor: "price",
      cell: (price: number) => <BaseFormatNumber value={price} />,
    },

    {
      header: "Status",
      accessor: "status",
      cell: (status: ENUM.COMMON.Status) => <BaseTag status={status} />,
    },
    {
      header: "Actions",
      accessor: "actions",
      actions: [
        {
          name: "edit",
          handleClick(data) {
            router.push(
              `${DASHBOARD_ROUTES.PROPERTIES.ADD}?requestId=${data?.id}`,
            );
          },
        },
      ],
    },
  ];

  const paginationAction = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <BaseContainer
      border={"none"}
      title={"Propriétes"}
      description={"Gérez l'ensemble de vos biens immobiliers"}
      loader={isLoading}
      numberOfLines={2}
      withActionButtons
      actionsButtonProps={{
        validateTitle: "Ajouter une propriété",
        isEmailVerified: user?.emailVerified,
        onReload: async () => {
          await refectProperty();
        },
        onClick: () => {
          router.push(DASHBOARD_ROUTES.PROPERTIES.ADD);
        },
      }}
    >
      <AppartStatsCard
        properties={allProperties?.content ?? []}
        isLoading={isLoading}
      />

      <DataDisplayContainer
        data={allProperties?.content ?? []}
        columns={appartColumns}
        isLoading={isLoading}
        renderGridItem={(item) => <AppartGridView property={item} />}
        paginationData={{
          lazy: true,
          totalItems: allProperties?.totalItems,
          totalDataPerPage: allProperties?.totalDataPerPages || 6,
          onLazyLoad: (index) => paginationAction(index),
          currentPage,
          totalPages: allProperties?.totalPages,
        }}
        hidePagination={allProperties?.totalPages === 1}
        actions={[
          {
            name: "edit",
            handleClick(data) {
              router.push(
                `${DASHBOARD_ROUTES.PROPERTIES.ADD}?requestId=${data?.id}`,
              );
            },
          },
        ]}
      />
    </BaseContainer>
  );
};
