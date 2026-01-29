import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: process.env.BASE_AUTH_CLIENT_URL!,
});
