import { AppPermissions } from '_utils/app-permissions';
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
        permission: AppPermissions.PROPERTIES.VIEW,
      },
      {
        label: 'Terrains',
        path: DASHBOARD_ROUTES.LAND.LIST,
        icon: Icons.Map,
        permission: AppPermissions.LAND.MANAGE,
      },
      {
        label: 'Bâtiments',
        path: DASHBOARD_ROUTES.BUILDING.LIST,
        icon: Icons.RiBuildingLine,
        permission: AppPermissions.BUILDING.MANAGE,
      },
      {
        label: 'Propriétés',
        path: DASHBOARD_ROUTES.PROPERTIES.LIST,
        icon: Icons.Home,
        feature: 'manage_properties',
        permission: AppPermissions.PROPERTIES.VIEW,
      },
      {
        label: 'Réservations',
        path: DASHBOARD_ROUTES.BOOKINGS,
        icon: Icons.Calendar,
        permission: AppPermissions.BOOKINGS.VIEW,
      },
    ],
    title: 'Gestion Immobiliers',
    icon: Icons.GridHome,
  },
  // {
  //   title: 'Analytique',
  //   icon: Icons.QueryStats,
  //   links: [
  //     {
  //       label: 'Statistiques',
  //       path: DASHBOARD_ROUTES.STATS,
  //       icon: Icons.StatsChart,
  //     },
  //   ],
  // },

  {
    title: 'Gestion',
    icon: Icons.FolderOpen,
    links: [
      {
        label: 'Rendez-vous',
        path: DASHBOARD_ROUTES.VISITS,
        icon: Icons.Calendar,
        permission: AppPermissions.VISITS.VIEW,
      },
      {
        label: 'Invitations',
        path: DASHBOARD_ROUTES.INVITATIONS.LIST,
        icon: Icons.SendMail,
        permission: AppPermissions.USERS.VIEW,
      },

      {
        label: 'Equipe',
        path: DASHBOARD_ROUTES.TEAM.LIST,
        icon: Icons.FaUsers,
        permission: AppPermissions.USERS.VIEW,
      },
      {
        label: 'Messages',
        path: DASHBOARD_ROUTES.CHAT,
        icon: Icons.Chat,
        permission: AppPermissions.CONVERSATIONS.VIEW,
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
      {
        // Accès du staff avec la permission de facturation : module I3
        label: 'Modèles de facture',
        path: DASHBOARD_ROUTES.INVOICING.TEMPLATES,
        icon: Icons.Paper,
        ownerOnly: true,
      },
    ],
  },

  {
    title: 'Outils',
    icon: Icons.Wrench,
    links: [
      {
        label: 'Google Drive',
        path: DASHBOARD_ROUTES.INTEGRATIONS_PROVIDER,
        icon: Icons.GoogleDrive,
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
      {
        label: 'Abonnement',
        path: DASHBOARD_ROUTES.SUBSCRIPTION,
        icon: Icons.CreditCard,
        ownerOnly: true,
      },
    ],
  },
];
