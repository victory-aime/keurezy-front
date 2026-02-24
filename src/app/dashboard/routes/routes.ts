import { APP_ROUTES } from "_config/routes";

export const DASHBOARD_ROUTES = {
  HOME: `${APP_ROUTES.DASHBOARD}`,
  APPART: {
    LIST: `${APP_ROUTES.DASHBOARD}/appartements`,
    ADD: `${APP_ROUTES.DASHBOARD}/appartements/add`,
  },
  QUITTANCE: `${APP_ROUTES.DASHBOARD}/quittances`,
  PROFILE: `${APP_ROUTES.DASHBOARD}/profile`,
  AGENCY: `${APP_ROUTES.DASHBOARD}/agency`,
  REQUEST: `${APP_ROUTES.DASHBOARD}/request`,
};
