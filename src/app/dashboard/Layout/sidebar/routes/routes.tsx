import { SidebarNavGroupProps } from "../types";
import { DASHBOARD_ROUTES } from "../../../routes";
import { Icons } from "_components/custom";

export const ALL_CSA_ROUTES: SidebarNavGroupProps[] = [
  {
    links: [
      {
        path: DASHBOARD_ROUTES.HOME,
        label: "SIDE_BAR.DASHBOARD",
        icon: Icons.Home,
      },
      {
        label: "Terrains",
        path: DASHBOARD_ROUTES.LAND.LIST,
        icon: Icons.Map,
      },
      {
        label: "Bâtiments",
        path: DASHBOARD_ROUTES.BUILDING.LIST,
        icon: Icons.RiBuildingLine,
      },
      {
        label: "Propriétés",
        path: DASHBOARD_ROUTES.PROPERTIES.LIST,
        icon: Icons.Home,
      },
      // {
      //   label: "Locataires",
      //   path: DASHBOARD_ROUTES.TENANTS.LIST,
      //   icon: Icons.FaUsers,
      // },
      // {
      //   label: "Candidatures",
      //   path: DASHBOARD_ROUTES.RENTAL_REQUEST,
      //   icon: Icons.Clipboard,
      // },
      // {
      //   label: "Paiements",
      //   path: "/dashboard/payments",
      //   icon: Icons.CreditCard,
      // },
      // {
      //   label: "Voir la page d'accueil",
      //   path: APP_ROUTES.ROOT,
      //   icon: Icons.IoIosArrowRoundBack,
      // },
    ],
    title: "Gestion Immobiliers",
    icon: Icons.GridHome,
  },
  // {
  //   title: "Analytiques",
  //   icon: Icons.Chart,
  //   links: [
  //     { label: "Rapports", path: "/dashboard/reports", icon: Icons.Chart },
  //     { label: "Revenus", path: "/dashboard/revenue", icon: Icons.Payment },
  //     {
  //       label: "Taux d'occupation",
  //       path: "/dashboard/occupancy",
  //       icon: Icons.Chart,
  //     },
  //   ],
  // },
  {
    title: "Gestion",
    icon: Icons.FolderOpen,
    links: [
      // {
      //   label: "Messages",
      //   path: DASHBOARD_ROUTES.MESSAGES,
      //   icon: Icons.Chat,
      //   badge: 5,
      // },
      {
        label: "Notifications",
        path: DASHBOARD_ROUTES.NOTIFICATION,
        icon: Icons.Bell,
      },

      // {
      //   label: "Demandes",
      //   path: DASHBOARD_ROUTES.CONTACT_REQUEST,
      //   icon: Icons.Request,
      // },
      {
        label: "SIDE_BAR.AGENCY",
        path: DASHBOARD_ROUTES.AGENCY,
        icon: Icons.Office,
      },
    ],
  },

  {
    title: "Compte",
    icon: Icons.FaUsers,
    links: [
      { label: "Profil", path: DASHBOARD_ROUTES.PROFILE, icon: Icons.FaUsers },
      {
        label: "Sécurité",
        path: DASHBOARD_ROUTES.SECURITY,
        icon: Icons.Shield,
      },
      // {
      //   label: "Abonnement",
      //   path: "/dashboard/billing",
      //   icon: Icons.Wrench /*Receipt*/,
      // },
      // {
      //   label: "Paramètres",
      //   path: "/dashboard/settings",
      //   icon: Icons.Bed /*Settings*/,
      // },
    ],
  },
];
