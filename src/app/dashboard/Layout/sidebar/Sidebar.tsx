'use client';

import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import { BaseButton, Icons } from '_components/custom';
import { MobileSidebar } from './components/MobileSidebar';
import { ASSETS } from '_assets/images';
import Image from 'next/image';
import { SideBarProps } from './types';
import {
  PropertyModule,
  BuildingModule,
  TeamModule,
  InvitationModule,
  LandModule,
  BookingsModule,
  NotificationsModule,
  ChatModule,
  CommonModule,
} from '_store/state-management';
import { cheapestPlanWith, toCatalog } from '_utils/subscription';
import { ALL_CSA_ROUTES } from './routes/routes';
import { RenderGroupedLinks } from './components/RenderGroupedLinks';
import { useAuth } from '_hooks/useAuth';
import { SideToolTip } from './components/SideToolTip';
import { useSessionRefreshContext } from '_context/SessionRefresh-context';
import { useMemo } from 'react';
import { DASHBOARD_ROUTES } from '../../routes';
import { useColorMode } from '_components/ui/color-mode';
import { useUserContext } from '_context/user-context';
import { useAuthContext } from '_context/auth-context';
import { useAccessControl } from '_hooks/useAccessControl';
import { usePermissions } from '_hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { ENUM } from '_types/*';

export const Sidebar = ({
  onShowSidebar,
  sideToggled,
  isLoading,
}: SideBarProps & { isLoading?: boolean }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout } = useAuth();
  const { dismissToast } = useSessionRefreshContext();
  const { colorMode } = useColorMode();
  const { user } = useUserContext();
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === ENUM.UserRole.OWNER;
  const { hasPermission } = usePermissions();
  const { canAccess, hasFeature, isLoading: accessControlLoading } = useAccessControl();
  // Catalogue public des plans : nomme le plan qui débloque un module verrouillé
  const { data: plans } = CommonModule.getAllPacksQueries({});
  const catalog = useMemo(() => toCatalog(plans ?? []), [plans]);
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  /**
   * Requête d'un badge, lancée seulement si l'utilisateur a la permission du lien :
   * sans elle, le backend répond 403 (et le lien est de toute façon masqué).
   */
  const badgeQuery = (permission: string) => ({
    params: { agencyId: agencyId! },
    queryOptions: { enabled: !!agencyId && !!userId && hasPermission(permission) },
  });

  const { data: propertyList } = PropertyModule.getAllPropertiesByAgency(
    badgeQuery(AppPermissions.PROPERTIES.VIEW),
  );

  const { data: buildingList } = BuildingModule.getAllBuildingByAgencyQueries(
    badgeQuery(AppPermissions.BUILDING.MANAGE),
  );

  const { data: allLandsList } = LandModule.getAllLandsByAgencyQueries(
    badgeQuery(AppPermissions.LAND.MANAGE),
  );

  const { data: teamList } = TeamModule.getAllTeamByAgency(badgeQuery(AppPermissions.USERS.VIEW));

  const { data: invitationList } = InvitationModule.getAllInvitationByAgency(
    badgeQuery(AppPermissions.USERS.VIEW),
  );

  // Badge : demandes de réservation à traiter
  const { data: pendingBookings } = BookingsModule.agencyBookingsQueries({
    params: { agencyId: agencyId!, status: ENUM.BookingStatus.PENDING },
    queryOptions: badgeQuery(AppPermissions.BOOKINGS.VIEW).queryOptions,
  });

  // Badge : messages non lus des clients (même requête que la page Messages, cache partagé)
  const { data: conversationsData } = ChatModule.getConversationsQueries(
    { agencyId: agencyId ?? '' },
    { queryOptions: { enabled: !!userId && hasPermission(AppPermissions.CONVERSATIONS.VIEW) } },
  );
  const unreadMessages = conversationsData?.pages[0]?.unreadTotal;

  const { data: unreadNotificationsList } = NotificationsModule.getAllUnreadNotificationsQueries({
    queryOptions: { enabled: !!user?.id },
  });

  const badgesByPath = useMemo(() => {
    return {
      [DASHBOARD_ROUTES.LAND.LIST]: allLandsList?.totalItems,
      [DASHBOARD_ROUTES.BUILDING.LIST]: buildingList?.totalItems,
      [DASHBOARD_ROUTES.PROPERTIES.LIST]: propertyList?.totalItems,
      [DASHBOARD_ROUTES.TEAM.LIST]: teamList?.length,
      [DASHBOARD_ROUTES.INVITATIONS.LIST]: invitationList?.length,
      [DASHBOARD_ROUTES.BOOKINGS]: pendingBookings?.length,
      [DASHBOARD_ROUTES.NOTIFICATION]: unreadNotificationsList?.length,
      [DASHBOARD_ROUTES.CHAT]: unreadMessages || undefined,
    };
  }, [
    propertyList?.totalItems,
    buildingList?.totalItems,
    allLandsList?.totalItems,
    teamList?.length,
    invitationList?.length,
    pendingBookings?.length,
    unreadNotificationsList?.length,
    unreadMessages,
  ]);

  const sidebarLinks = useMemo(() => {
    if (isLoading || accessControlLoading) return [];

    return (
      ALL_CSA_ROUTES.map((group) => {
        const links = group.links
          .map((link): (typeof link & { disabled?: boolean }) | null => {
            // Réservé au propriétaire (le backend refuse aussi le staff)
            if (link.ownerOnly && !isOwner) return null;

            // Module d'un plan supérieur : verrouillé avec un aperçu animé s'il en a un, sinon
            // masqué (la page reste protégée par `PlanFeatureGate`)
            if (link.feature && !hasFeature(link.feature)) {
              if (!link.preview) return null;
              const plan = cheapestPlanWith(catalog, link.feature);
              return {
                ...link,
                locked: true,
                unlockPlan: plan?.name ? { id: plan.id, name: plan.name } : null,
              };
            }
            // Permission manquante : lien masqué
            if (!canAccess({ permission: link.permission })) return null;

            const badgeValue = badgesByPath[link.path as keyof typeof badgesByPath];

            return {
              ...link,
              badge: typeof badgeValue === 'number' && badgeValue > 0 ? badgeValue : undefined,
            };
          })
          // ✅ filtre type-safe
          .filter((link): link is NonNullable<typeof link> => link !== null);

        return {
          ...group,
          links,
        };
      })
        /**✅ supprimer groupes vides uniquement
         * si on dispose de la fonctionnalite dans le plan mais
         *  que cet user connecté n'a pas la permission d'y accéder
         */
        .filter((group) => group.links.length > 0)
    );
  }, [badgesByPath, canAccess, hasFeature, catalog, isLoading, accessControlLoading, isOwner]);

  return (
    <Box>
      {isMobile ? (
        <MobileSidebar
          isOpen={!sideToggled}
          onClose={onShowSidebar}
          links={sidebarLinks}
          handleLogout={() => {
            dismissToast?.();
            logout();
          }}
        />
      ) : (
        <Box
          w={!sideToggled ? '80px' : '230px'}
          h="100vh"
          position="fixed"
          transition="width 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
          overflow="hidden"
          boxShadow="lg"
          borderRight="1px solid"
          borderColor={colorMode === 'light' ? 'border' : 'inherit'}
          display="flex"
          flexDirection="column"
          zIndex="10"
          data-tour="sidebar"
        >
          <Flex
            align="center"
            justifyContent={'center'}
            px={3}
            py={2}
            borderBottom="1px solid"
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.900'}
          >
            <Image
              src={colorMode === 'light' ? ASSETS.LOGO : ASSETS.LOGO_DARK}
              alt="logo"
              width={200}
              height={200}
              style={{
                width: 'auto',
                height: 'auto',
              }}
            />
          </Flex>

          {/* LINKS */}

          <RenderGroupedLinks
            isCollapsed={sideToggled}
            links={sidebarLinks}
            isLoading={isLoading || accessControlLoading}
          />

          <SideToolTip disabled={sideToggled} label={'Déconnexion'}>
            <Box
              p={3}
              borderTop="1px solid"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.900'}
            >
              <BaseButton
                width={'full'}
                colorType={'danger'}
                leftIcon={<Icons.Logout />}
                onClick={() => {
                  dismissToast?.();
                  logout();
                }}
              >
                {sideToggled ? 'Déconnexion' : null}
              </BaseButton>
            </Box>
          </SideToolTip>
        </Box>
      )}
    </Box>
  );
};
