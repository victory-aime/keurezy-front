import { Flex, Box, Stack, Separator, VStack, HStack } from "@chakra-ui/react";
import {
  BaseAccordion,
  BaseButton,
  BaseContainer,
  BaseDrawer,
  BaseFormatNumber,
  BaseIcon,
  BaseTag,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
  ModalOpenProps,
} from "_components/custom";
import { useRouter } from "next/navigation";
import { FormCard } from "../../components/FormCard";
import { formatDisplayDate } from "rise-core-frontend";
import { DASHBOARD_ROUTES } from "../../routes";
import { CONSTANTS, ENUM, MODELS } from "_types/*";

interface IBuildingDetail extends ModalOpenProps {
  data: MODELS.IBuilding | null;
}

export const BuildingDetails = ({
  isOpen,
  onChange,
  data,
  isLoading,
  callback,
}: IBuildingDetail) => {
  const router = useRouter();

  const propertyColumns: ColumnsDataTable[] = [
    {
      header: "Propriété",
      accessor: "title",
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
  ];

  const buildingDetailsAccordions = [
    {
      label: "Informations Générales",
      icon: <Icons.Target />,
      content: (
        <FormCard title="">
          <VStack align="stretch" gap={0} width={"full"}>
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Prpriétaire</BaseText>
              <BaseText>{data?.buildingOwner}</BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Adresse</BaseText>
              <BaseText>{data?.address}</BaseText>
            </Flex>
            <Separator />

            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Ville</BaseText>
              <BaseText>{data?.city}</BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Etages</BaseText>
              <BaseText>{data?.floors}</BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Status</BaseText>
              <BaseTag status={data?.status} />
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Créé le</BaseText>
              <BaseText> {formatDisplayDate(data?.createdAt)} </BaseText>
            </Flex>
            <Separator />
            <Flex py={2} justify="space-between">
              <BaseText color="gray.500">Modifié le</BaseText>
              <BaseText> {formatDisplayDate(data?.updatedAt)} </BaseText>
            </Flex>
          </VStack>
        </FormCard>
      ),
    },

    {
      label: "Propriétes associée",
      icon: <Icons.Home />,
      content: (
        <VStack p={4} mt={4} width={"full"} alignItems={"flex-start"}>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"full"}
          >
            <BaseText>
              {" "}
              Au moins {data?.properties?.length} proprietes associés{" "}
            </BaseText>
            <BaseIcon
              cursor={"pointer"}
              onClick={() => {
                onChange(!isOpen);
                router.push(DASHBOARD_ROUTES.PROPERTIES.ADD);
              }}
            >
              <Icons.PlusMinus size={24} />
            </BaseIcon>
          </Flex>
          <BaseContainer>
            <DataTableContainer
              data={data?.properties?.slice(0, 3) ?? []}
              columns={propertyColumns}
              hidePagination
            />
          </BaseContainer>
        </VStack>
      ),
    },
  ];

  return (
    <BaseDrawer
      title={"Detail du bâtiment"}
      description={" Visualisation des informations du bâtiment"}
      size={"xl"}
      icon={<Icons.RiBuildingLine />}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter
    >
      <Box
        borderLeftWidth={2}
        boxShadow={"sm"}
        borderRadius={"lg"}
        borderColor={"primary.500"}
        p={4}
      >
        <Flex alignItems={"center"} justifyContent={"space-between"} gap={5}>
          <HStack>
            <BaseIcon>
              <Icons.RiBuildingLine />
            </BaseIcon>
            <Stack gap={0}>
              <BaseText>{data?.name}</BaseText>
              <BaseText textTransform={"capitalize"}>
                {data?.city},{data?.address},{data?.district}
              </BaseText>
            </Stack>
          </HStack>
          <BaseButton
            colorType="danger"
            variant={"outline"}
            onClick={() => callback?.()}
          >
            Supprimer
          </BaseButton>
        </Flex>
      </Box>
      <BaseAccordion
        items={buildingDetailsAccordions}
        multipleOpen
        isLoading={isLoading}
        mt={5}
        itemContentProps={{
          p: "0",
          mt: "2",
        }}
      />
    </BaseDrawer>
  );
};
