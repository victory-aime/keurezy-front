import { createAuthClient } from 'better-auth/react';
import {
  customSessionClient,
  inferAdditionalFields,
  twoFactorClient,
} from 'better-auth/client/plugins';
import { APP_ROUTES } from '_config/routes';
import { passkeyClient } from '@better-auth/passkey/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    customSessionClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = APP_ROUTES.AUTH._2FA;
      },
    }),
    passkeyClient(),
    inferAdditionalFields({
      session: {
        permissions: {
          type: 'json',
          input: false,
        },
      },
      user: {
        role: {
          type: 'string',
          input: false,
        },
      },
    }),
  ],
});
