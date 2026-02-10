import { APP_ROUTES } from "_config/routes";
import { BO_ROUTES } from "../dashboard/back-office/routes";
import { DASHBOARD_ROUTES } from "../dashboard/routes";

const roleToDashboardMap: Record<string, string> = {
  USER: APP_ROUTES.ROOT,
  IMMO_OWNER: DASHBOARD_ROUTES.HOME,
  ADMIN: BO_ROUTES.DASHBOARD,
};

export { roleToDashboardMap };
