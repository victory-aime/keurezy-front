export const APP_ROUTES = {
  ROOT: "/",
  REDIRECT: "/redirect",
  AUTH: {
    SIGN_IN: "/auth/signin",
    _2FA: "/auth/signin/totp",
    RESET_PASSWORD: "/auth/forget-pass/request",
    RESET_PASSWORD_VALIDATE: "/auth/forget-pass/validate",
    VERIFIED_EMAIL: "/auth/email-verified",
    ONBOARD: "/auth/onboarding",
  },
  PROTECTED: "/not-authenticated",
  LEGAL_MENTIONS: "/mentions-legales",
  SECURITY: "/security",
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_USE: "/terms-and-conditions",
  DASHBOARD: "/dashboard",
};
