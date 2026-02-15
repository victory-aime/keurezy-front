import {
  ApiActionProps,
  APIObjectType,
  createApiAction,
} from "rise-core-frontend";

const APIS_ROUTES_MODULES_PATH = {
  USER: "/user",
  AGENCY: "/agency",
  PROPERTY: "/property",
  AUTH: "/auth",
  FAQ: "/faq",
};

export const APIS = (baseUrl?: string) => {
  const api = (args: Omit<ApiActionProps, "baseUrl">): APIObjectType =>
    createApiAction({ ...args, baseUrl });

  return {
    USER: {
      INFO: api({
        path: `${APIS_ROUTES_MODULES_PATH.USER}/info`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
        handleErrorManually: false,
      }),
      CHECK_EMAIL: api({
        path: `${APIS_ROUTES_MODULES_PATH.USER}/verified-email`,
        method: "POST",
        pathBase: "UNSECURED_API",
        showResponse: false,
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
      ALL_PROPERTIES: api({
        path: `${APIS_ROUTES_MODULES_PATH.PROPERTY}/all`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
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
      CHECK_NAME: api({
        path: `${APIS_ROUTES_MODULES_PATH.AGENCY}/verified-name`,
        method: "POST",
        pathBase: "UNSECURED_API",
        showResponse: false,
        handleErrorManually: false,
      }),
    },
    AUTH: {
      LOGIN: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/login`,
        method: "POST",
        pathBase: "UNSECURED_API",
        showResponse: false,
      }),
      SSO_GOOGLE: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/sso/google`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      REFRESH: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/refresh-token`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      LOGOUT: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/logout`,
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      RESET_PASSWORD: api({
        path: `${APIS_ROUTES_MODULES_PATH.AUTH}/reset-password`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
    },
    FAQ: {
      GET_FAQS: api({
        path: `${APIS_ROUTES_MODULES_PATH.FAQ}/list`,
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      CREATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.FAQ}/create-faq`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
      UPDATE: api({
        path: `${APIS_ROUTES_MODULES_PATH.FAQ}/update-faq`,
        method: "POST",
        pathBase: "SECURED_API",
      }),
      DELETE: api({
        path: `${APIS_ROUTES_MODULES_PATH.FAQ}/delete-faq`,
        method: "DELETE",
        pathBase: "SECURED_API",
      }),
    },
  };
};
