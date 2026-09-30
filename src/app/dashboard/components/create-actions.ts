import { AppPermissions } from '_utils/app-permissions';
import { DASHBOARD_ROUTES } from '../routes';

export type CreateActionIcon = 'property' | 'annonce' | 'visit' | 'invite';

export interface CreateAction {
  label: string;
  route: string;
  icon: CreateActionIcon;
}

/**
 * Entrées du bouton « Créer » de l'accueil, filtrées par les permissions de la session : ce sont
 * celles que le backend exige sur les routes de création. Un staff ne voit que ce qu'il peut faire.
 */
export function createActions(hasPermission: (permission: string) => boolean): CreateAction[] {
  const all: (CreateAction & { permission: string })[] = [
    {
      label: 'Nouveau bien',
      route: DASHBOARD_ROUTES.PROPERTIES.ADD,
      icon: 'property',
      permission: AppPermissions.PROPERTIES.CREATE,
    },
    {
      label: 'Nouvelle annonce',
      route: DASHBOARD_ROUTES.ANNONCES.ADD,
      icon: 'annonce',
      permission: AppPermissions.PROPERTIES.PUBLISH,
    },
    {
      label: 'Planifier une visite',
      route: DASHBOARD_ROUTES.VISITS,
      icon: 'visit',
      permission: AppPermissions.VISITS.SCHEDULE,
    },
    {
      label: 'Inviter un membre',
      route: DASHBOARD_ROUTES.INVITATIONS.ADD,
      icon: 'invite',
      permission: AppPermissions.INVITATIONS.SEND,
    },
  ];
  return all
    .filter((action) => hasPermission(action.permission))
    .map(({ permission, ...action }) => action);
}
