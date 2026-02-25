"use client";
import { Box, Flex, VStack } from "@chakra-ui/react";
import {
  BaseContainer,
  BaseModal,
  BaseStats,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
} from "_components/custom";
import { Avatar } from "_components/ui/avatar";
import { RentalModule, UserModule } from "_store/state-management";
import { ENUM, MODELS } from "_types/*";
import { useState } from "react";
import { formatDisplayDate } from "rise-core-frontend";
import { RentalInfoItem, RentalModalSection } from "./RentalSection";

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
          <Flex alignItems={"center"} gap={2}>
            <Avatar name={value.name} />
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
    >
      <Flex width={"full"} gap={4}>
        {[
          {
            label: "Total",
            value: rentalList?.length,
            icon: <Icons.Clipboard />,
            iconBgColor: "primary.500",
          },
          {
            label: "En attente",
            value: rentalList?.filter(
              (p) => p.status === ENUM.COMMON.Status.PENDING,
            ).length,
            icon: <Icons.Timer />,
            iconBgColor: "warning.500",
          },
          {
            label: "Acceptées",
            value: rentalList?.filter(
              (p) => p.status === ENUM.COMMON.Status.ACCEPTED,
            ).length,
            icon: <Icons.Check />,
            iconBgColor: "tertiary.500",
          },
          {
            label: "Rejetées",
            value: rentalList?.filter(
              (p) => p.status === ENUM.COMMON.Status.REJECTED,
            ).length,
            icon: <Icons.Close />,
            iconBgColor: "red.500",
          },
        ].map((stats, i) => (
          <BaseStats
            key={i}
            mt={"30px"}
            icon={stats.icon}
            isLoading={rentalLoad}
            iconBgColor={stats.iconBgColor}
            title={stats.label}
            value={stats.value ?? 0}
          />
        ))}
      </Flex>

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
      <BaseModal
        isOpen={open}
        onChange={() => {
          setOpen(false);
        }}
        title="Candidature"
        description={`Candidature pour : ${selectedValues?.property?.title}`}
        status={selectedValues?.status}
        buttonCancelTitle={
          selectedValues?.status === ENUM.COMMON.Status.PENDING
            ? "Rejeter"
            : "Fermer"
        }
        iconCancelButton={<Icons.Close />}
        iconSaveButton={<Icons.Check />}
        buttonSaveTitle={
          selectedValues?.status === ENUM.COMMON.Status.PENDING
            ? "Accepter"
            : ""
        }
        alignItems={"flex-end"}
        justifyContent={"flex-end"}
      >
        <VStack alignItems="flex-start" gap={6}>
          <RentalModalSection icon={<Icons.User />} title="Informations">
            <Flex
              width="full"
              gap={4}
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <RentalInfoItem
                icon={<Icons.User />}
                label="Nom"
                value={selectedValues?.tenant?.name}
              />
              <RentalInfoItem
                icon={<Icons.Mail />}
                label="Email"
                value={selectedValues?.tenant?.email}
              />
              <RentalInfoItem
                icon={<Icons.Phone />}
                label="Phone"
                value={selectedValues?.phone}
              />
            </Flex>
          </RentalModalSection>

          <RentalModalSection
            icon={<Icons.RiBuildingLine />}
            title="Détails de la demande"
          >
            <Flex
              width="full"
              gap={4}
              justifyContent="space-between"
              flexWrap="wrap"
            >
              <RentalInfoItem
                icon={<Icons.RiBuildingLine />}
                label="Bien"
                value={selectedValues?.property?.title}
              />
              <RentalInfoItem
                icon={<Icons.User />}
                label="Emménagement"
                value={formatDisplayDate(selectedValues?.createdAt)}
              />
              <RentalInfoItem
                icon={<Icons.User />}
                label="Candidature"
                value={formatDisplayDate(selectedValues?.createdAt)}
              />
            </Flex>
          </RentalModalSection>

          <RentalModalSection icon={<Icons.Chat />} title="Message du candidat">
            <Box
              width="full"
              p={4}
              rounded="lg"
              bgColor="gray.100"
              border="1px solid"
              borderColor="border"
            >
              {selectedValues?.message}
            </Box>
          </RentalModalSection>
        </VStack>
      </BaseModal>
    </BaseContainer>
  );
};
