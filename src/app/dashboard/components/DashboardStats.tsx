"use client";

import { Flex, For, SimpleGrid, Span, VStack } from "@chakra-ui/react";
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
} from "_store/state-management";
import { ENUM } from "_types/*";
import { Colors, hexToRGB } from "_theme/colors";
import { OccupationRateByType } from "./OccupationRateByType";
import { MonthlyRevenueAreaChart } from "./MonthlyRevenueAreaChart";
import { useUserContext } from "_context/user-context";
import { useMemo } from "react";
import { DASHBOARD_ROUTES } from "../routes";
import { useRouter } from "next/navigation";

export const DashboardStats = () => {
  const { push } = useRouter();
  const { user } = useUserContext();

  const agencyId = user?.agencyId;

  const queryPayload = useMemo(
    () => ({
      params: {
        agencyId,
      },
      queryOptions: {
        enabled: !!agencyId,
      },
    }),
    [agencyId],
  );

  const { data: allProperties, isLoading: propertiesLoad } =
    PropertyModule.getAllPropertiesByAgency(queryPayload);

  const { data: occupationRateData, isLoading: occupationRateLoad } =
    PropertyModule.getOccupationRateByTypeQueries(queryPayload);

  const { data: monthlyRevenueData, isLoading: monthlyRevenueLoad } =
    PropertyModule.getMonthlyRevenueQueries({
      queryOptions: { enabled: false },
    });

  const { data: allRentalAgreement, isLoading: rentalAgreementLoad } =
    RentalAgreementModule.getRentalAgreementListByAgencyQueries({
      queryOptions: { enabled: false },
    });

  const {
    data: allActivities,
    refetch: refetchNotificationList,
    isLoading: notificationLoad,
  } = NotificationsModule.getAllNotificationsQueries({
    params: { recipientId: user?.id },
    queryOptions: { enabled: false },
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
        {/* <BaseContainer title="Activite recente" data-tour="activity">
          <Stack mt={{ base: "0", sm: "30px" }} width={"full"}>
            <RenderNotifications
              refetchNotificationList={refetchNotificationList}
              list={allActivities ?? []}
              isLoading={notificationLoad}
            />
          </Stack>
        </BaseContainer> */}
        <BaseContainer
          data-tour="quick-actions"
          height={"fit-content"}
          title="Actions rapides"
        >
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 4 }}
            width={"full"}
            gap={3}
            mt={{ base: "0", sm: "30px" }}
          >
            {[
              {
                title: "Voir les terrains",
                link: DASHBOARD_ROUTES.LAND.LIST,
                icon: Icons.Map,
                color: "primary",
                borderColor: "primary.500",
              },
              {
                title: "Ajouter un bâtiment",
                link: DASHBOARD_ROUTES.BUILDING.ADD,
                icon: Icons.RiBuildingLine,
                color: "secondary",
                borderColor: "secondary.500",
              },
              {
                title: "Voir les propriétés",
                link: DASHBOARD_ROUTES.PROPERTIES.LIST,
                icon: Icons.Home,
                color: "orange",
                borderColor: "orange.500",
              },
              {
                title: "Envoyer une invitation",
                link: DASHBOARD_ROUTES.INVITATIONS.ADD,
                icon: Icons.SendMail,
                color: "success",
                borderColor: "success.500",
              },
            ].map((item, i) => (
              <VStack
                key={i}
                bgColor={hexToRGB(item.color as keyof Colors, 0.3)}
                borderWidth={1}
                borderColor={item.borderColor}
                cursor={"pointer"}
                rounded={"lg"}
                p={4}
                gap={1}
                onClick={() => push(item.link)}
              >
                <BaseIcon color={item.borderColor}>
                  <item.icon />
                </BaseIcon>
                <BaseText textAlign={"center"} textSizeAdjust={"auto"}>
                  {item.title}
                </BaseText>
              </VStack>
            ))}
          </SimpleGrid>
        </BaseContainer>
      </Flex>
    </BaseContainer>
  );
};
