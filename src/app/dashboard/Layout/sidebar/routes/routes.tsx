import { SidebarNavGroupProps } from '../types';
import { DASHBOARD_ROUTES } from '../../../routes';
import { Icons } from '_components/custom';

export const ALL_CSA_ROUTES: SidebarNavGroupProps[] = [
  {
    links: [
      {
        path: DASHBOARD_ROUTES.HOME,
        label: 'SIDE_BAR.DASHBOARD',
        icon: Icons.Home,
      },
      {
        label: 'Annonces',
        path: DASHBOARD_ROUTES.ANNONCES.LIST,
        icon: Icons.Megaphone,
        highlight: true,
      },
      {
        label: 'Terrains',
        path: DASHBOARD_ROUTES.LAND.LIST,
        icon: Icons.Map,
      },
      {
        label: 'Bâtiments',
        path: DASHBOARD_ROUTES.BUILDING.LIST,
        icon: Icons.RiBuildingLine,
      },
      {
        label: 'Propriétés',
        path: DASHBOARD_ROUTES.PROPERTIES.LIST,
        icon: Icons.Home,
        feature: 'manage_properties',
        permission: 'view_properties',
      },
    ],
    title: 'Gestion Immobiliers',
    icon: Icons.GridHome,
  },

  {
    title: 'Gestion',
    icon: Icons.FolderOpen,
    links: [
      {
        label: 'Demandes',
        path: DASHBOARD_ROUTES.LEADS,
        icon: Icons.Clipboard,
        badge: 5,
      },
      {
        label: 'Invitations',
        path: DASHBOARD_ROUTES.INVITATIONS.LIST,
        icon: Icons.SendMail,
        badge: 5,
      },

      {
        label: 'Equipe',
        path: DASHBOARD_ROUTES.TEAM.LIST,
        icon: Icons.FaUsers,
        badge: 5,
      },
      {
        label: 'Notifications',
        path: DASHBOARD_ROUTES.NOTIFICATION,
        icon: Icons.Bell,
      },

      {
        label: 'SIDE_BAR.AGENCY',
        path: DASHBOARD_ROUTES.AGENCY,
        icon: Icons.Office,
      },
    ],
  },

  {
    title: 'Compte',
    icon: Icons.FaUsers,
    links: [
      { label: 'Profil', path: DASHBOARD_ROUTES.PROFILE, icon: Icons.FaUsers },
      {
        label: 'Sécurité',
        path: DASHBOARD_ROUTES.SECURITY,
        icon: Icons.Shield,
      },
    ],
  },
];
