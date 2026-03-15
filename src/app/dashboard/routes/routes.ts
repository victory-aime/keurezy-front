import { APP_ROUTES } from "_config/routes";

export const DASHBOARD_ROUTES = {
  HOME: `${APP_ROUTES.DASHBOARD}`,
  PROPERTIES: {
    LIST: `${APP_ROUTES.DASHBOARD}/properties`,
    ADD: `${APP_ROUTES.DASHBOARD}/properties/add`,
  },
  PROFILE: `${APP_ROUTES.DASHBOARD}/profile`,
  AGENCY: `${APP_ROUTES.DASHBOARD}/agency`,
  CONTACT_REQUEST: `${APP_ROUTES.DASHBOARD}/contact`,
  RENTAL_REQUEST: `${APP_ROUTES.DASHBOARD}/application`,
  MESSAGES: `${APP_ROUTES.DASHBOARD}/messages`,
  NOTIFICATION: `${APP_ROUTES.DASHBOARD}/notifications`,
  TENANTS: {
    LIST: `${APP_ROUTES.DASHBOARD}/tenants`,
    ADD: `${APP_ROUTES.DASHBOARD}/tenants/add`,
  },
};
