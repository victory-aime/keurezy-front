export const APP_ROUTES = {
  ROOT: "/",
  HOME: "/modules",
  AUTH: {
    SIGN_IN: "/auth/signin",
    SIGN_UP: "/auth/signup",
    _2FA: "/auth/signin/totp",
    RESET_PASSWORD: "/auth/forget-pass/request",
    RESET_PASSWORD_VALIDATE: "/auth/forget-pass/validate",
    VERIFIED_EMAIL: "/auth/email-verified",
  },
  PROTECTED: "/not-authenticated",
  LEGAL_MENTIONS: "/mentions-legales",
  SECURITY: "/security",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_USE: "/terms-and-conditions",
};

export enum ROOT_URL {
  BO = "/modules/dashboard/back-office",
  DASHBOARD = "/modules/dashboard",
}
