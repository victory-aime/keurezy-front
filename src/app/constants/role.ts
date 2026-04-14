import { APP_ROUTES } from "_config/routes";
import { DASHBOARD_ROUTES } from "../dashboard/routes";

const roleToDashboardMap: Record<string, string> = {
  USER: APP_ROUTES.ROOT,
  OWNER: DASHBOARD_ROUTES.HOME,
  AGENCY_ADMIN: DASHBOARD_ROUTES.HOME,
  AGENT: DASHBOARD_ROUTES.HOME,
};

export { roleToDashboardMap };
