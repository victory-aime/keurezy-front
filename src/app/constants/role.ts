import { BO_ROUTES } from "_modules/dashboard/back-office/routes";
import { DASHBOARD_ROUTES } from "_modules/dashboard/routes";

const roleToDashboardMap: Record<string, string> = {
  USER: DASHBOARD_ROUTES.HOME,
  ADMIN: BO_ROUTES.DASHBOARD,
};

export { roleToDashboardMap };
