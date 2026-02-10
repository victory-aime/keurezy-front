import {
  ApiActionProps,
  APIObjectType,
  createApiAction,
} from "rise-core-frontend";

export const APIS = (baseUrl?: string) => {
  const api = (args: Omit<ApiActionProps, "baseUrl">): APIObjectType =>
    createApiAction({ ...args, baseUrl });

  return {
    USER: {
      INFO: api({
        path: "/user/info",
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
        handleErrorManually: false,
      }),
      REGENERATE_PASSWORD: api({
        path: "/user/regenerate-password",
        method: "POST",
        pathBase: "SECURED_API",
      }),
    },
    AUTH: {
      LOGIN: api({
        path: "/auth/login",
        method: "POST",
        pathBase: "UNSECURED_API",
        showResponse: false,
      }),
      SSO_GOOGLE: api({
        path: "/auth/sso/google",
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      REFRESH: api({
        path: "/auth/refresh-token",
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      LOGOUT: api({
        path: "/auth/logout",
        method: "POST",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      RESET_PASSWORD: api({
        path: "/auth/reset-password",
        method: "POST",
        pathBase: "SECURED_API",
      }),
    },
    FAQ: {
      GET_FAQS: api({
        path: "/faq",
        method: "GET",
        pathBase: "SECURED_API",
        showResponse: false,
      }),
      CREATE: api({
        path: "/faq/create-faq",
        method: "POST",
        pathBase: "SECURED_API",
      }),
      UPDATE: api({
        path: "/faq/update-faq",
        method: "POST",
        pathBase: "SECURED_API",
      }),
      DELETE: api({
        path: "/faq/delete-faq",
        method: "DELETE",
        pathBase: "SECURED_API",
      }),
    },
  };
};
