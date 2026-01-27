import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session extends DefaultSession {
    user_id: string;
    access_token?: string;
    provider?: string;
    role?: string;
    refresh_token?: string;
    error?: string;
  }
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    id_token?: number;
    expires_at?: number;
    provider?: string;
    error?: string;
  }
}
