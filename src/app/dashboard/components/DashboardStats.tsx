'use client';

import { Flex, For, SimpleGrid, Span, Stack, VStack } from '@chakra-ui/react';
import {
  BaseContainer,
  BaseIcon,
  BaseStats,
  BaseStatsProps,
  BaseText,
  Icons,
} from '_components/custom';
import {
  NotificationsModule,
  PropertyModule,
  RentalAgreementModule,
} from '_store/state-management';
import { ENUM } from '_types/*';
import { OccupationRateByType } from './OccupationRateByType';
import { MonthlyRevenueAreaChart } from './MonthlyRevenueAreaChart';
import { useUserContext } from '_context/user-context';
import { useMemo } from 'react';
import { DASHBOARD_ROUTES } from '../routes';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '_context/theme-context';
import { RenderNotifications } from '../notifications/components/RenderNotifications';
import { MODELS } from '_types/*';
import { Months } from '_utils/generate';

export const DashboardStats = () => {
  const { push } = useRouter();
  const { vars } = useAppTheme();
  const { user } = useUserContext();
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const queryPayload = useMemo(
    () => ({
      params: {
        agencyId,
        userId,
      },
      queryOptions: {
        enabled: !!agencyId && !!userId,
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
    params: { userId: user?.id },
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
      title: 'Total Propriétes',
      value: allProperties?.content?.length ?? 0,
      icon: <Icons.RiBuildingLine />,
    },
    {
      title: 'Locataires Actifs',
      value:
        allRentalAgreement?.content?.filter(
          (rental) => rental?.status === ENUM.COMMON.Status.ACTIVE,
        ).length ?? 0,
      icon: <Icons.FaUsers />,
      iconBgColor: 'secondary.500',
    },
    {
      title: 'Revenues Mensuels',
      value: revenues?.revenue ?? 0,
      isNumber: true,
      currency: ENUM.COMMON.Currency.XOF,
      icon: <Icons.Payment />,
      iconBgColor: 'tertiary.500',
    },
  ];

  // const cashout = async () => {
  //   const response = await fetch('https://api.naboopay.com/api/v2/payouts', {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_NABOO_PAY_API_KEY}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       selected_payment_method: 'wave',
  //       amount: 100,
  //       recipient: {
  //         first_name: 'Aminata',
  //         last_name: 'Diba',
  //         phone: '+221786068122',
  //       },
  //       reason: 'Invoice payment',
  //     }),
  //   });

  //   const data = await response.json();
  //   console.log(data);
  // };

  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateMonthlyRevenueStats = (): MODELS.IMonthlyRevenueStats[] => {
    return Months().map((month) => {
      const receivedAmount = random(500000, 5000000);
      const remainingAmount = random(100000, 2000000);

      return {
        month,
        receivedAmount,
        remainingAmount,
      };
    });
  };

  const generateOccupationRateStats = (): MODELS.IOccupationRateStats[] => {
    const propertyTypes = ['Studio', 'Appartement', 'Villa', 'Duplex', 'Bureau', 'Commerce'] as any;
    return propertyTypes.map((propertyType: any) => ({
      propertyType,
      occupationRate: random(20, 100),
    }));
  };
  return (
    <BaseContainer
      title="Tableau de bord"
      description={
        <BaseText fontSize={'lg'}>
          Bievenue,
          <Span textTransform={'capitalize'} color={'primary.500'} fontWeight={'bold'}>
            {user?.name}
          </Span>
          . Voici un aperçu de votre portefeuille.
        </BaseText>
      }
      border={'none'}
      // withActionButtons
      // actionsButtonProps={{
      //   validateTitle: 'Payer aminata',
      //   onClick: async () => {
      //     await cashout();
      //   },
      // }}
    >
      <SimpleGrid data-tour="kpis" columns={3} mt={10} width={'full'} gap={3}>
        <For each={stats}>
          {(stat, i) => (
            <Flex key={i}>
              <BaseStats key={i} {...stat} isLoading={propertiesLoad || rentalAgreementLoad} />
            </Flex>
          )}
        </For>
      </SimpleGrid>

      <Flex width={'full'} gap={3} flexDir={{ base: 'column', sm: 'row' }} data-tour="charts">
        <MonthlyRevenueAreaChart
          data={generateMonthlyRevenueStats()}
          isLoading={monthlyRevenueLoad}
        />
        <OccupationRateByType data={generateOccupationRateStats()} isLoading={occupationRateLoad} />
      </Flex>
      <BaseContainer title="Activite recente" data-tour="activity">
        <Stack mt={{ base: '0', sm: '30px' }} width={'full'}>
          <RenderNotifications
            refetchNotificationList={refetchNotificationList}
            list={allActivities ?? []}
            isLoading={notificationLoad}
          />
        </Stack>
      </BaseContainer>

      <BaseContainer data-tour="quick-actions" height={'fit-content'} title="Actions rapides">
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 4 }}
          width={'full'}
          gap={3}
          mt={{ base: '0', sm: '30px' }}
        >
          {[
            {
              title: 'Voir les terrains',
              link: DASHBOARD_ROUTES.LAND.LIST,
              icon: Icons.Map,
              color: vars.primary100,
              borderColor: 'primary.500',
            },
            {
              title: 'Ajouter un bâtiment',
              link: DASHBOARD_ROUTES.BUILDING.ADD,
              icon: Icons.RiBuildingLine,
              color: 'secondary.100',
              borderColor: 'secondary.500',
            },
            {
              title: 'Voir les propriétés',
              link: DASHBOARD_ROUTES.PROPERTIES.LIST,
              icon: Icons.Home,
              color: 'orange.100',
              borderColor: 'orange.500',
            },
            {
              title: 'Envoyer une invitation',
              link: DASHBOARD_ROUTES.INVITATIONS.ADD,
              icon: Icons.SendMail,
              color: 'success.100',
              borderColor: 'success.500',
            },
          ].map((item, i) => (
            <VStack
              key={i}
              bgColor={item.color}
              borderWidth={1}
              borderColor={item.borderColor}
              cursor={'pointer'}
              rounded={'lg'}
              p={4}
              gap={1}
              onClick={() => push(item.link)}
            >
              <BaseIcon color={item.borderColor}>
                <item.icon />
              </BaseIcon>
              <BaseText textAlign={'center'} textSizeAdjust={'auto'} color={'black'}>
                {item.title}
              </BaseText>
            </VStack>
          ))}
        </SimpleGrid>
      </BaseContainer>
    </BaseContainer>
  );
};
