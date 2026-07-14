import { ApiActionProps, APIObjectType, createApiAction } from 'rise-core-frontend';

const APIS_ROUTES_MODULES_PATH = {
  AUTH: '/auth',
  USER: '/users',
  AGENCY: '/agency',
  PROPERTY: '/property',
  LEADS: '/leads',
  CHAT: '/chat',
  NOTIFICATION: '/notif',
  PUSH_NOTIFICATIONS: '/push-notification',
  BUILDING: '/building',
  LAND: '/land',
  COMMON: {
    GLOBAL_ROUTES: '/common',
    PERMS: '/common/perms',
    PACKS: '/common/packs',
  },
  INVITATION: '/invitation',
  TEAM: '/team',
  ANNONCES: '/announces',
  VISITS: '/visits',
  INTEGRATIONS_PROVIDER: '/integrations/providers',
};

export const APIS = (baseUrl?: string) => {
  const api = (args: Omit<ApiActionProps, 'baseUrl'>): APIObjectType =>
    createApiAction({ ...args, baseUrl });

  return {
    AUTH: {
      SEND_EMAIL_VERIFICATION: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/send-email-verification`,
        method: 'POST',
        pathBase: 'UNSECURED_API',
      }),
      REGISTER: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/register`,
        method: 'POST',
        pathBase: 'UNSECURED_API',
        showResponse: false,
      }),
      FORGET_PASSWORD_INIT: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/forgot-password`,
        method: 'POST',
        pathBase: 'UNSECURED_API',
      }),
      RESET_PASSWORD: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/reset-password`,
        method: 'POST',
        pathBase: 'UNSECURED_API',
      }),
      CHECK_EMAIL: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/verified-email`,
        method: 'POST',
        pathBase: 'UNSECURED_API',
        showResponse: false,
      }),
    },
    USER: {
      INFO: api({
        path: `${APIS_ROUTES_MODULES_PATH.USER}/info`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
        handleErrorManually: false,
      }),
      PASSKEY_SESSION: api({
        path: `${APIS_ROUTES_MODULES_PATH.USER}/passkey-session`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      UPDATE_USER: api({
        path: `${APIS_ROUTES_MODULES_PATH.USER}/update-user`,
        method: 'PATCH',
        pathBase: 'SECURED_API',
      }),
    },
    AGENCY: {
      CREATE_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/create`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      AGENCY_INFO: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      AGENCY_SUBSCRIPTION_INFO: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/subscription-info`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      UPDATE_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/update`,
        method: 'POST',
        pathBase: 'SECURED_API',
      }),
      CLOSE_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/close`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      CHECK_NAME: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/verified-name`,
        method: 'POST',
        pathBase: 'UNSECURED_API',
        showResponse: false,
        handleErrorManually: false,
      }),
      STATS: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/stats`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
    },
    PROPERTY: {
      CREATE_PROPERTY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/create`,
        method: 'POST',
        pathBase: 'SECURED_API',
      }),
      ALL_PROPERTIES_BY_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/all`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      ALL_PROPERTIES_PUBLIC: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}`,
        method: 'GET',
        pathBase: 'UNSECURED_API',
        showResponse: false,
        handleErrorManually: false,
      }),
      UPDATE_PROPERTY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/update`,
        method: 'POST',
        pathBase: 'SECURED_API',
      }),
      CLOSE_PROPERTY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/close`,
        method: 'POST',
        pathBase: 'SECURED_API',
      }),

      OCCUPATION_RATE_BY_PROPERTY_TYPE: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/occupation-rate-property-type`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),

      MONTHLY_REVENUE: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/monthly-revenue`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
    },
    LEADS: {
      CREATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.LEADS}/create`,
        method: 'POST',
        pathBase: 'SECURED_API',
      }),
      ASSIGN: api({
        path: `${APIS_ROUTES_MODULES_PATH.LEADS}/assign`,
        method: 'PATCH',
        pathBase: 'SECURED_API',
      }),
      DELETE: api({
        path: `${APIS_ROUTES_MODULES_PATH.LEADS}/delete`,
        method: 'DELETE',
        pathBase: 'SECURED_API',
      }),
      AGENCY_LEADS_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.LEADS}/agency-leads`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      USER_LEADS_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.LEADS}/user-leads-list`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
    },
    CHAT: {
      CREATE_CONV: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/conversations`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      GET_CONV: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/conversations`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      GET_MESSAGE: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/conversations/messages`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      SEND_MESSAGE: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/send-message`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      READ_MESSAGE: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/read`,
        method: 'PATCH',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
    },
    NOTIFICATION: {
      GET_ALL: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/get-all`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      GET_ALL_UNREAD: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/get-all-unread`,
        method: 'GET',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      READ_ALL: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/read-all`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),

      READ_ONE: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/read`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      REGISTER_TOKEN: api({
        path: `${APIS_ROUTES_MODULES_PATH.PUSH_NOTIFICATIONS}/register-token`,
        method: 'POST',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
      REMOVE_TOKEN: api({
        path: `${APIS_ROUTES_MODULES_PATH.PUSH_NOTIFICATIONS}/remove-token`,
        method: 'DELETE',
        pathBase: 'SECURED_API',
        showResponse: false,
      }),
    },
    BUILDING: {
      ALL_BUILDING_BY_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.BUILDING}`,
        method: 'GET',
        showResponse: false,
        pathBase: 'SECURED_API',
      }),
      CREATE_BUILDING: api({
        path: `${APIS_ROUTES_MODULES_PATH.BUILDING}/create-building`,
        method: 'POST',

        pathBase: 'SECURED_API',
      }),
      UPDATE_BUILDING: api({
        path: `${APIS_ROUTES_MODULES_PATH.BUILDING}/update-building`,
        method: 'POST',

        pathBase: 'SECURED_API',
      }),
      DELETE_BUILDING: api({
        path: `${APIS_ROUTES_MODULES_PATH.BUILDING}/delete-building`,
        method: 'DELETE',
        showResponse: false,
        pathBase: 'SECURED_API',
      }),
    },
    LAND: {
      ALL_LAND_BY_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.LAND}`,
        method: 'GET',
        showResponse: false,
        pathBase: 'SECURED_API',
      }),
      CREATE_LAND: api({
        path: `${APIS_ROUTES_MODULES_PATH.LAND}/create-land`,
        method: 'POST',

        pathBase: 'SECURED_API',
      }),
      UPDATE_LAND: api({
        path: `${APIS_ROUTES_MODULES_PATH.LAND}/update-land`,
        method: 'POST',

        pathBase: 'SECURED_API',
      }),
      DELETE_LAND: api({
        path: `${APIS_ROUTES_MODULES_PATH.LAND}/delete-land`,
        method: 'DELETE',

        pathBase: 'SECURED_API',
      }),
    },
    COMMON: {
      PERMS: {
        ALL_PERMS: api({
          path: `${APIS_ROUTES_MODULES_PATH.COMMON.PERMS}`,
          pathBase: 'SECURED_API',
          method: 'GET',
          showResponse: false,
        }),
      },
      PACKS: {
        ALL_PACKS: api({
          path: `${APIS_ROUTES_MODULES_PATH.COMMON.PACKS}`,
          pathBase: 'UNSECURED_API',
          method: 'GET',
          showResponse: false,
        }),
      },
      POLLING_STATUS: api({
        path: `${APIS_ROUTES_MODULES_PATH.COMMON.GLOBAL_ROUTES}/polling`,
        pathBase: 'UNSECURED_API',
        method: 'GET',
        showResponse: false,
      }),
    },
    INVITATION: {
      ALL_INVITATIONS_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.INVITATION}/agency-invite-list`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      ACCEPT_INVITATION: api({
        path: `${APIS_ROUTES_MODULES_PATH.INVITATION}/accept-invitation`,
        pathBase: 'UNSECURED_API',
        method: 'POST',
      }),

      CREATE_INVITATION: api({
        path: `${APIS_ROUTES_MODULES_PATH.INVITATION}/create-invitation`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
      CANCEL_INVITATION: api({
        path: `${APIS_ROUTES_MODULES_PATH.INVITATION}/cancel-invitation`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
    },
    TEAM: {
      ALL_TEAMS: api({
        path: `${APIS_ROUTES_MODULES_PATH.TEAM}/agency-team-list`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      CHANGE_STATUS: api({
        path: `${APIS_ROUTES_MODULES_PATH.TEAM}/change-status`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
    },
    ANNONCES: {
      CREATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.ANNONCES}/create`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
      UPDATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.ANNONCES}/update`,
        pathBase: 'SECURED_API',
        method: 'PUT',
      }),
      DELETE: api({
        path: `${APIS_ROUTES_MODULES_PATH.ANNONCES}/delete`,
        pathBase: 'SECURED_API',
        method: 'DELETE',
      }),

      FIND_BY_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.ANNONCES}/agency`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
    },
    VISITS: {
      CREATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.VISITS}/create`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
      UPDATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.VISITS}/update`,
        pathBase: 'SECURED_API',
        method: 'PATCH',
      }),
      CANCEL_VISIT: api({
        path: `${APIS_ROUTES_MODULES_PATH.VISITS}/cancel-visit`,
        pathBase: 'SECURED_API',
        method: 'PATCH',
      }),
      ALL_BY_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.VISITS}/agency-visits`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      ASSIGN_AGENT: api({
        path: `${APIS_ROUTES_MODULES_PATH.VISITS}/assign-agent`,
        pathBase: 'SECURED_API',
        method: 'PATCH',
        showResponse: false,
      }),
    },
    INTEGRATIONS_PROVIDER: {
      CONNECT: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/connect-url`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      DISCONNECT: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/disconnect`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
      GET_STATUS: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/status`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      UPLOAD_FILE: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/upload`,
        pathBase: 'SECURED_API',
        method: 'POST',
        showResponse: false,
      }),
      FILES_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/files-list`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      TRASHED_FILES_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/trashed-list`,
        pathBase: 'SECURED_API',
        method: 'GET',
        showResponse: false,
      }),
      TRASHED: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/trashed-file`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
      DELETE_FILE: api({
        path: `${APIS_ROUTES_MODULES_PATH.INTEGRATIONS_PROVIDER}/delete-file`,
        pathBase: 'SECURED_API',
        method: 'POST',
      }),
    },
  };
};
