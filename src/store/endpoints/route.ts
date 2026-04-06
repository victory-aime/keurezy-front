import {
  ApiActionProps,
  APIObjectType,
  createApiAction,
} from "rise-core-frontend";

const APIS_ROUTES_MODULES_PATH = {
  AUTH: "/auth",
  USER: "/users",
  AGENCY: "/agency",
  PROPERTY: "/property",
  CONTACT: "/contact",
  APPLICATION: "/application",
  RENTAL_AGREEMENT: "/rental-agreement",
  CHAT: "/chat",
  NOTIFICATION: "/notif",
};

export const APIS = (baseUrl?: string) => {
  const api = (args: Omit<ApiActionProps, "baseUrl">): APIObjectType =>
    createApiAction({ ...args, baseUrl });

  return {
    AUTH: {
      SEND_EMAIL_VERIFICATION: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/send-email-verification`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      REGISTER: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/register`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      FORGET_PASSWORD_INIT: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/forgot-password`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      RESET_PASSWORD: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/reset-password`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      CHECK_EMAIL: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/verified-email`,
        method: "POST",
        pathBase: "UNSECURED_API",
        showResponse: false,
      }),
    },
    USER: {
      INFO: api({
        path: `${APIS_ROUTES_MODULES_PATH.USER}/info`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
        handleErrorManually: false,
      }),
    },
    AGENCY: {
      CREATE_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/create`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      AGENCY_INFO: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      UPDATE_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/update`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
      CLOSE_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/close`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      CHECK_NAME: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/verified-name`,
        method: "POST",
        pathBase: "UNSECURED_API",
        showResponse: false,
        handleErrorManually: false,
      }),
    },
    PROPERTY: {
      CREATE_PROPERTY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/create`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      ALL_PROPERTIES_BY_AGENCY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/all`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      ALL_PROPERTIES_PUBLIC: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}`,
        method: "GET",
        pathBase: "UNSECURED_API",
        showResponse: false,
        handleErrorManually: false,
      }),
      UPDATE_PROPERTY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/update`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
      CLOSE_PROPERTY: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/close`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),

      OCCUPATION_RATE_BY_PROPERTY_TYPE: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/occupation-rate-property-type`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),

      MONTHLY_REVENUE: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/monthly-revenue`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
    },
    CONTACT: {
      PUBLIC_CONTACT: api({
        path: `${APIS_ROUTES_MODULES_PATH.CONTACT}/public`,
        method: "POST",
        pathBase: "UNSECURED_API",
      }),
      AGENCY_CONTACT_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.CONTACT}/agency-contact-list`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      AGENCY_CONTACT_UPDATE_STATUS: api({
        path: `${APIS_ROUTES_MODULES_PATH.CONTACT}/agency-update-status`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      AGENCY_CONTACT_READ_ALL: api({
        path: `${APIS_ROUTES_MODULES_PATH.CONTACT}/agency-update-status`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
    },
    APPLICATION: {
      CREATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.APPLICATION}/create`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
      AGENCY_APPLICATION_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.APPLICATION}/agency-application-list`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      USER_APPLICATION_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.APPLICATION}/user-application-list`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
    },
    RENTAL_AGREEMENT: {
      GET_AGENCY_LIST: api({
        path: `${APIS_ROUTES_MODULES_PATH.RENTAL_AGREEMENT}/rental-agreement-agency-list`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      APPROVE: api({
        path: `${APIS_ROUTES_MODULES_PATH.RENTAL_AGREEMENT}/approve`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
      REJECT: api({
        path: `${APIS_ROUTES_MODULES_PATH.RENTAL_AGREEMENT}/reject`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      TERMINATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.RENTAL_AGREEMENT}/terminate`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
    },
    CHAT: {
      CREATE_CONV: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/create-conversation`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      GET_CONV: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/get-conversation`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      GET_MESSAGE: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/get-message`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      SEND_MESSAGE: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/send-message`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      READ_MESSAGE: api({
        path: `${APIS_ROUTES_MODULES_PATH.CHAT}/read`,
        method: "PATCH",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
    },
    NOTIFICATION: {
      GET_ALL: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/get-all`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      GET_ALL_UNREAD: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/get-all-unread`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      READ_ALL: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/read-all`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),

      READ_ONE: api({
        path: `${APIS_ROUTES_MODULES_PATH.NOTIFICATION}/read`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
    },
  };
};
