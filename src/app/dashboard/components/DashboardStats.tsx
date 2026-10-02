'use client';

import { Flex, For, HStack, SimpleGrid, Span, Stack } from '@chakra-ui/react';
import {
  BaseContainer,
  BaseStats,
  BaseStatsProps,
  BaseText,
  Icons,
  BaseIconButton,
} from '_components/custom';
import { NotificationsModule, PropertyModule } from '_store/state-management';
import { CONSTANTS, ENUM } from '_types/*';
import { OccupationRateByType } from './OccupationRateByType';
import { MonthlyRevenueAreaChart } from './MonthlyRevenueAreaChart';
import { useUserContext } from '_context/user-context';
import { useState } from 'react';
import { DASHBOARD_ROUTES } from '../routes';
import { useRouter } from 'next/navigation';
import { RenderNotifications } from '../notifications/components/RenderNotifications';
import { MODELS } from '_types/*';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { currentMonthExpected } from '_utils/revenue';
import { CreateMenu } from './CreateMenu';

export const DashboardStats = () => {
  const { user } = useUserContext();
  const router = useRouter();
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const { hasPermission } = usePermissions();
  const canViewProperties = hasPermission(AppPermissions.PROPERTIES.VIEW);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  // Statistiques des biens : uniquement avec `view_properties` (sinon 403 du backend)
  const statsQuery = <T extends object>(params: T) => ({
    params: { agencyId: agencyId!, ...params },
    queryOptions: { enabled: !!agencyId && !!userId && canViewProperties },
  });

  // Une seule ligne suffit : seul le total (`totalItems`) est affiché
  const { data: allProperties, isLoading: propertiesLoad } =
    PropertyModule.getAllPropertiesByAgency(statsQuery({ limitPerPage: 1 }));

  const { data: monthlyRevenue, isLoading: revenueLoad } = PropertyModule.getMonthlyRevenueQueries(
    statsQuery({ year }),
  );

  const { data: occupation, isLoading: occupationLoad } =
    PropertyModule.getOccupationRateByTypeQueries(statsQuery({}));

  // Revenus du mois en cours : toujours l'année courante, même si le graphique en montre une autre
  const { data: currentYearRevenue } = PropertyModule.getMonthlyRevenueQueries(
    statsQuery({ year: currentYear }),
  );

  const {
    data: allActivities,
    refetch: refetchNotificationList,
    isLoading: notificationLoad,
  } = NotificationsModule.getAllNotificationsQueries({
    queryOptions: { enabled: !!user?.id },
  });

  const stats: BaseStatsProps[] = [
    {
      title: 'Propriétés',
      value: allProperties?.totalItems ?? 0,
      icon: <Icons.RiBuildingLine />,
    },
    {
      title: 'Revenus du mois',
      // Réservations terminées et confirmées du mois (pas de paiement en ligne)
      value: currentMonthExpected(currentYearRevenue ?? []),
      isNumber: true,
      currency: ENUM.COMMON.Currency.XOF,
      icon: <Icons.Payment />,
      iconBgColor: 'tertiary.500',
    },
  ];

  const occupationData = (occupation ?? []).map((row) => ({
    ...row,
    propertyType: (CONSTANTS.propertyTypes.find((type) => type.value === row.propertyType)?.label ??
      row.propertyType) as MODELS.IOccupationRateStats['propertyType'],
  }));

  const yearSelector = (
    <HStack justify="flex-end" gap={1} width="full" mt={2}>
      <BaseIconButton
        label="Année précédente"
        size="xs"
        onClick={() => setYear((value) => value - 1)}
      >
        <Icons.ChevronLeft />
      </BaseIconButton>
      <BaseText fontWeight="semibold" minW="48px" textAlign="center" aria-live="polite">
        {year}
      </BaseText>
      <BaseIconButton
        label="Année suivante"
        size="xs"
        disabled={year >= currentYear}
        onClick={() => setYear((value) => Math.min(value + 1, currentYear))}
      >
        <Icons.ChevronRight />
      </BaseIconButton>
    </HStack>
  );

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
    >
      {/* Créations autorisées : un seul point d'entrée, en haut, filtré par permissions */}
      <Flex width={'full'} justifyContent={'flex-end'}>
        <CreateMenu />
      </Flex>
      <SimpleGrid data-tour="kpis" columns={2} mt={10} width={'full'} gap={3}>
        <For each={stats}>
          {(stat, i) => (
            <Flex key={i}>
              <BaseStats key={i} {...stat} isLoading={propertiesLoad} />
            </Flex>
          )}
        </For>
      </SimpleGrid>

      <Flex width={'full'} gap={3} flexDir={{ base: 'column', sm: 'row' }} data-tour="charts">
        <MonthlyRevenueAreaChart
          data={monthlyRevenue ?? []}
          isLoading={revenueLoad}
          toolbar={yearSelector}
        />
        <OccupationRateByType data={occupationData} isLoading={occupationLoad} />
      </Flex>
      <BaseContainer
        title="Activite recente"
        data-tour="activity"
        withActionButtons
        actionsButtonProps={{
          validateTitle: `Voir plus ${allActivities?.length}`,
          onClick: () => router.push(DASHBOARD_ROUTES.NOTIFICATION),
        }}
      >
        <Stack mt={{ base: '0', sm: '30px' }} width={'full'}>
          <RenderNotifications
            refetchNotificationList={refetchNotificationList}
            list={allActivities ?? []}
            isLoading={notificationLoad}
            isSlice
            displayLength={4}
          />
        </Stack>
      </BaseContainer>
    </BaseContainer>
  );
};
