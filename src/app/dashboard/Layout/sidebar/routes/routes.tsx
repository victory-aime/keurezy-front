import { AppPermissions } from '_utils/app-permissions';
import { SidebarNavGroupProps } from '../types';
import { DASHBOARD_ROUTES } from '../../../routes';
import { NavIcons } from '_components/custom';

/**
 * Menu du tableau de bord, par usage : le quotidien d'abord, puis le patrimoine, l'activité
 * avec les clients, la facturation, l'équipe, l'agence et le compte. Chaque lien a sa propre
 * icône ; `permission` masque un lien au staff qui n'y a pas droit, `feature` le masque quand le
 * plan ne l'inclut pas, ou le montre verrouillé avec un aperçu animé s'il a un `preview` (la page
 * reste protégée par `PlanFeatureGate`), `ownerOnly` le réserve au propriétaire.
 */
export const ALL_CSA_ROUTES: SidebarNavGroupProps[] = [
  {
    title: 'Accueil',
    icon: NavIcons.Dashboard,
    links: [
      { label: 'SIDE_BAR.DASHBOARD', path: DASHBOARD_ROUTES.HOME, icon: NavIcons.Dashboard },
      {
        label: 'Messages',
        path: DASHBOARD_ROUTES.CHAT,
        icon: NavIcons.Messages,
        permission: AppPermissions.CONVERSATIONS.VIEW,
      },
      { label: 'Notifications', path: DASHBOARD_ROUTES.NOTIFICATION, icon: NavIcons.Notifications },
    ],
  },
  {
    title: 'Patrimoine',
    icon: NavIcons.GroupAssets,
    links: [
      {
        label: 'Propriétés',
        path: DASHBOARD_ROUTES.PROPERTIES.LIST,
        icon: NavIcons.Properties,
        feature: 'manage_properties',
        permission: AppPermissions.PROPERTIES.VIEW,
      },
      {
        label: 'Bâtiments',
        feature: 'manage_properties',
        path: DASHBOARD_ROUTES.BUILDING.LIST,
        icon: NavIcons.Buildings,
        permission: AppPermissions.BUILDING.MANAGE,
      },
      {
        label: 'Terrains',
        feature: 'manage_properties',
        path: DASHBOARD_ROUTES.LAND.LIST,
        icon: NavIcons.Lands,
        permission: AppPermissions.LAND.MANAGE,
      },
      {
        label: 'Annonces',
        feature: 'publish_properties',
        path: DASHBOARD_ROUTES.ANNONCES.LIST,
        icon: NavIcons.Annonces,
        highlight: true,
        permission: AppPermissions.PROPERTIES.VIEW,
      },
    ],
  },
  {
    title: 'Activité',
    icon: NavIcons.GroupActivity,
    links: [
      {
        label: 'Réservations',
        path: DASHBOARD_ROUTES.BOOKINGS,
        icon: NavIcons.Bookings,
        permission: AppPermissions.BOOKINGS.VIEW,
      },
      {
        label: 'Rendez-vous',
        path: DASHBOARD_ROUTES.VISITS,
        icon: NavIcons.Visits,
        permission: AppPermissions.VISITS.VIEW,
      },
    ],
  },
  {
    title: 'Facturation',
    icon: NavIcons.GroupBilling,
    links: [
      {
        label: 'Factures',
        path: DASHBOARD_ROUTES.INVOICING.LIST,
        icon: NavIcons.Invoices,
        feature: 'manage_invoices',
        permission: AppPermissions.INVOICES.VIEW,
      },
      {
        label: 'Modèles de facture',
        path: DASHBOARD_ROUTES.INVOICING.TEMPLATES,
        icon: NavIcons.InvoiceTemplates,
        permission: AppPermissions.INVOICES.VIEW,
      },
    ],
  },
  {
    title: 'Équipe',
    icon: NavIcons.GroupTeam,
    links: [
      {
        label: 'Collaborateurs',
        feature: 'manage_users',
        preview: 'team',
        pitch: 'Invitez votre équipe et choisissez précisément ce que chacun peut voir et faire.',
        path: DASHBOARD_ROUTES.TEAM.LIST,
        icon: NavIcons.Team,
        permission: AppPermissions.USERS.VIEW,
      },
      {
        label: 'Invitations',
        feature: 'manage_users',
        preview: 'team',
        pitch:
          'Invitez un collaborateur par e-mail : il rejoint l’agence avec les permissions choisies.',
        path: DASHBOARD_ROUTES.INVITATIONS.LIST,
        icon: NavIcons.Invitations,
        permission: AppPermissions.USERS.VIEW,
      },
    ],
  },
  {
    title: 'Analyse',
    icon: NavIcons.GroupAnalytics,
    links: [
      {
        label: 'Statistiques',
        path: DASHBOARD_ROUTES.STATS,
        icon: NavIcons.Stats,
        feature: 'view_reports',
        permission: AppPermissions.REPORTS.VIEW,
        preview: 'stats',
        pitch:
          'L’activité de votre agence en graphiques : biens, visites et demandes, d’un coup d’œil.',
      },
    ],
  },
  {
    title: 'Agence',
    icon: NavIcons.GroupAgency,
    links: [
      { label: 'SIDE_BAR.AGENCY', path: DASHBOARD_ROUTES.AGENCY, icon: NavIcons.Agency },
      {
        label: 'Abonnement',
        path: DASHBOARD_ROUTES.SUBSCRIPTION,
        icon: NavIcons.Subscription,
        ownerOnly: true,
      },
      {
        label: 'Intégrations',
        path: DASHBOARD_ROUTES.INTEGRATIONS_PROVIDER,
        icon: NavIcons.Integrations,
      },
    ],
  },
  {
    title: 'Compte',
    icon: NavIcons.GroupAccount,
    links: [
      { label: 'Mon profil', path: DASHBOARD_ROUTES.PROFILE, icon: NavIcons.Profile },
      { label: 'Sécurité', path: DASHBOARD_ROUTES.SECURITY, icon: NavIcons.Security },
    ],
  },
];
