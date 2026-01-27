import { BO_ROUTES } from "_modules/dashboard/back-office/routes";
import { DASHBOARD_ROUTES } from "_modules/dashboard/routes";
import { APP_ROUTES } from "_config/routes";

const roleToDashboardMap: Record<string, string> = {
  //USER: APP_ROUTES.HOME,
  USER: DASHBOARD_ROUTES.HOME,
  ADMIN: BO_ROUTES.DASHBOARD,
};

export { roleToDashboardMap };
