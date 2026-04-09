import { APP_ROUTES } from "_config/routes";

enum PATHS {
  PROPERTIES = "properties",
  BUILDING = "building",
  LAND = "land",
}

export const DASHBOARD_ROUTES = {
  HOME: `${APP_ROUTES.DASHBOARD}`,
  LAND: {
    LIST: `${APP_ROUTES.DASHBOARD}/${PATHS.LAND}`,
    DETAILS: ``,
    ADD: `${APP_ROUTES.DASHBOARD}/${PATHS.LAND}/add`,
  },
  BUILDING: {
    LIST: `${APP_ROUTES.DASHBOARD}/${PATHS.BUILDING}`,
    ADD: `${APP_ROUTES.DASHBOARD}/${PATHS.BUILDING}/add`,
  },
  PROPERTIES: {
    LIST: `${APP_ROUTES.DASHBOARD}/properties`,
    ADD: `${APP_ROUTES.DASHBOARD}/properties/add`,
  },
  PROFILE: `${APP_ROUTES.DASHBOARD}/profile`,
  SECURITY: `${APP_ROUTES.DASHBOARD}/security`,
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
