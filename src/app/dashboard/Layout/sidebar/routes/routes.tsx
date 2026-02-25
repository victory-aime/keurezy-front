import { SidebarNavGroupProps } from "../types";
import { DASHBOARD_ROUTES } from "../../../routes";
import { UserRole } from "../../../../../types/enum";
import { APP_ROUTES } from "_config/routes";
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
        label: "Propriétés",
        path: DASHBOARD_ROUTES.APPART.LIST,
        icon: Icons.RiBuildingLine,
      },
      { label: "Locataires", path: "/dashboard/tenants", icon: Icons.FaUsers },
      {
        label: "Candidatures",
        path: DASHBOARD_ROUTES.RENTAL_REQUEST,
        icon: Icons.Clipboard,
      },
      // {
      //   label: "Paiements",
      //   path: "/dashboard/payments",
      //   icon: Icons.CreditCard,
      // },
      {
        label: "Voir la page d'accueil",
        path: APP_ROUTES.ROOT,
        icon: Icons.IoIosArrowRoundBack,
      },
    ],
    title: "Principal",
    icon: Icons.Chart,
  },
  {
    title: "Analytiques",
    icon: Icons.RiBuildingLine,
    links: [
      { label: "Rapports", path: "/dashboard/reports", icon: Icons.Chart },
      { label: "Revenus", path: "/dashboard/revenue", icon: Icons.Payment },
      {
        label: "Taux d'occupation",
        path: "/dashboard/occupancy",
        icon: Icons.Chart,
      },
    ],
  },
  {
    title: "Gestion",
    icon: Icons.FolderOpen,
    links: [
      {
        label: "Messages",
        path: "/dashboard/messages",
        icon: Icons.Chat,
        badge: 5,
      },
      {
        label: "Notifications",
        path: "/dashboard/notifications",
        icon: Icons.Bell,
        badge: 12,
      },
      {
        label: "SIDE_BAR.AGENCY",
        path: DASHBOARD_ROUTES.AGENCY,
        icon: Icons.Office /*FolderOpen*/,
      },
      {
        label: "Demandes",
        path: DASHBOARD_ROUTES.REQUEST,
        icon: Icons.Request,
      },
    ],
  },

  {
    title: "Compte",
    icon: Icons.FaUsers,
    links: [
      { label: "Profil", path: DASHBOARD_ROUTES.PROFILE, icon: Icons.FaUsers },
      { label: "Sécurité", path: "/dashboard/security", icon: Icons.Shield },
      {
        label: "Abonnement",
        path: "/dashboard/billing",
        icon: Icons.Wrench /*Receipt*/,
      },
      {
        label: "Paramètres",
        path: "/dashboard/settings",
        icon: Icons.Bed /*Settings*/,
      },
    ],
  },
];

const ADMIN_ROUTES: SidebarNavGroupProps[] = [];

export const MENU_BY_ROLE: Record<string, SidebarNavGroupProps[]> = {
  ADMIN: ADMIN_ROUTES,
};
const COMMON_ROLES = [UserRole.IMMO_OWNER];

for (const role of COMMON_ROLES) {
  MENU_BY_ROLE[role] = ALL_CSA_ROUTES;
}
