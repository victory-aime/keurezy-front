"use client";

import { Flex, For, SimpleGrid, Span, Stack, VStack } from "@chakra-ui/react";
import {
  BaseContainer,
  BaseIcon,
  BaseStats,
  BaseStatsProps,
  BaseText,
  Icons,
} from "_components/custom";
import {
  NotificationsModule,
  PropertyModule,
  RentalAgreementModule,
  UserModule,
} from "_store/state-management";
import { ENUM } from "_types/*";
import { RenderNotifications } from "../notifications/components/RenderNotifications";
import { hexToRGB } from "_theme/colors";
import { OccupationRateByType } from "./OccupationRateByType";
import { MonthlyRevenueAreaChart } from "./MonthlyRevenueAreaChart";

export const DashboardStats = () => {
  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });

  const agencyId = user?.propertyOwner?.propertyAgency?.id;
  const ownerId = user?.propertyOwner?.id;
  const enabled = !!agencyId && !!ownerId;

  const { data: allProperties, isLoading: propertiesLoad } =
    PropertyModule.getAllPropertiesByAgency({
      params: {
        agencyId,
        ownerId,
      },
      queryOptions: { enabled },
    });
  const { data: occupationRateData, isLoading: occupationRateLoad } =
    PropertyModule.getOccupationRateByTypeQueries({
      params: {
        agencyId,
        ownerId,
      },
      queryOptions: { enabled },
    });
  const { data: monthlyRevenueData, isLoading: monthlyRevenueLoad } =
    PropertyModule.getMonthlyRevenueQueries({
      params: {
        agencyId,
        ownerId,
      },
      queryOptions: { enabled },
    });
  const { data: allRentalAgreement, isLoading: rentalAgreementLoad } =
    RentalAgreementModule.getRentalAgreementListByAgencyQueries({
      params: { agencyId, ownerId },
      queryOptions: { enabled },
    });
  const {
    data: allActivities,
    refetch: refetchNotificationList,
    isLoading: notificationLoad,
  } = NotificationsModule.getAllNotificationsQueries({
    params: { recipientId: user?.id },
    queryOptions: { enabled: !!user?.id },
  });

  const revenues = allProperties?.content?.reduce(
    (acc, p) => {
      if (p.status !== ENUM.COMMON.Status.AVAILABLE) {
        acc.revenue += Number(p.price ?? 0);
      }
      return acc;
    },
    { revenue: 0 },
  );

  const stats: BaseStatsProps[] = [
    {
      title: "Total Propriétes",
      value: allProperties?.content?.length ?? 0,
      icon: <Icons.RiBuildingLine />,
    },
    {
      title: "Locataires Actifs",
      value:
        allRentalAgreement?.content?.filter(
          (rental) => rental?.status === ENUM.COMMON.Status.ACTIVE,
        ).length ?? 0,
      icon: <Icons.FaUsers />,
      iconBgColor: "secondary.500",
    },
    {
      title: "Revenues Mensuels",
      value: revenues?.revenue ?? 0,
      isNumber: true,
      currency: ENUM.COMMON.Currency.XOF,
      icon: <Icons.Payment />,
      iconBgColor: "tertiary.500",
    },
  ];
  return (
    <BaseContainer
      title="Tableau de bord"
      description={
        <BaseText fontSize={"lg"}>
          Bievenue,
          <Span
            textTransform={"capitalize"}
            color={"primary.500"}
            fontWeight={"bold"}
          >
            {user?.name}
          </Span>
          . Voici un aperçu de votre portefeuille.
        </BaseText>
      }
      border={"none"}
    >
      <SimpleGrid data-tour="kpis" columns={3} mt={10} width={"full"} gap={3}>
        <For each={stats}>
          {(stat, i) => (
            <Flex key={i}>
              <BaseStats
                key={i}
                {...stat}
                isLoading={propertiesLoad || rentalAgreementLoad}
              />
            </Flex>
          )}
        </For>
      </SimpleGrid>

      <Flex
        width={"full"}
        gap={3}
        flexDir={{ base: "column", sm: "row" }}
        data-tour="charts"
      >
        <MonthlyRevenueAreaChart
          data={monthlyRevenueData ?? []}
          isLoading={monthlyRevenueLoad}
        />
        <OccupationRateByType
          data={occupationRateData ?? []}
          isLoading={occupationRateLoad}
        />
      </Flex>

      <Flex width={"full"} gap={4} flexDir={{ base: "column", sm: "row" }}>
        <BaseContainer title="Activite recente" data-tour="activity">
          <Stack mt={{ base: "0", sm: "30px" }} width={"full"}>
            <RenderNotifications
              refetchNotificationList={refetchNotificationList}
              list={allActivities ?? []}
              isLoading={notificationLoad}
            />
          </Stack>
        </BaseContainer>
        <BaseContainer
          data-tour="quick-actions"
          height={"fit-content"}
          title="Actions rapides"
        >
          <SimpleGrid
            columns={2}
            width={"full"}
            gap={3}
            mt={{ base: "0", sm: "30px" }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <VStack
                key={i}
                bgColor={i === 0 ? hexToRGB("primary", 0.3) : "inherit"}
                borderWidth={1}
                borderColor={i === 0 ? "primary.500" : "inherit"}
                cursor={"pointer"}
                _hover={{
                  bgColor: i === 0 ? "none" : hexToRGB("primary", 0.3),
                  borderColor: i === 0 ? "none" : hexToRGB("primary", 0.3),
                }}
                rounded={"lg"}
                p={4}
                gap={1}
              >
                <BaseIcon>
                  <Icons.RiBuildingLine />
                </BaseIcon>
                <BaseText textAlign={"center"} textSizeAdjust={"auto"}>
                  Ajouter une propriete
                </BaseText>
              </VStack>
            ))}
          </SimpleGrid>
        </BaseContainer>
      </Flex>
    </BaseContainer>
  );
};
