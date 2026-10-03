import { APP_ROUTES } from '_config/routes';
import { DASHBOARD_ROUTES } from '../dashboard/routes';

const roleToDashboardMap: Record<string, string> = {
  // Compte web sans agence : reprise de l'inscription (compte d'abord)
  USER: APP_ROUTES.AUTH.ONBOARD,
  OWNER: DASHBOARD_ROUTES.HOME,
  AGENCY_ADMIN: DASHBOARD_ROUTES.HOME,
  AGENT: DASHBOARD_ROUTES.HOME,
};

export { roleToDashboardMap };
