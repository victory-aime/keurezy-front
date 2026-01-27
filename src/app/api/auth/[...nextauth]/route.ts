import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import isTokenExpiringSoon from "../../../helpers/expire-token";
import { jwtDecode } from "jwt-decode";
import { APIS } from "_store/endpoints";
import axios from "axios";
import { refreshAccessToken } from "_utils/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: "offline",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const url = APIS(process.env.NEXT_PUBLIC_BACKEND_URL).AUTH.LOGIN.url;
        try {
          const res = await axios.post(url, {
            email: credentials?.email,
            password: credentials?.password,
          });
          const data = res.data;
          if (!data.access_token || !data.refresh_token) {
            throw new Error("Invalid credentials");
          }

          const decoded = jwtDecode<{ sub: string }>(data.access_token);
          return {
            id: decoded.sub,
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            provider: "credentials",
          };
        } catch (error: any) {
          if (error.response?.status === 403) {
            throw new Error(
              "Votre compte est désactivé. Veuillez contacter un administrateur.",
            );
          }
          if (error.response?.status === 401) {
            throw new Error("Email ou mot de passe invalide.");
          }
          throw new Error(
            error.response?.data?.message ||
              "Une erreur est survenue lors de la connexion.",
          );
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "google") {
        try {
          const url = APIS(process.env.NEXT_PUBLIC_BACKEND_URL).AUTH.SSO_GOOGLE
            .url;
          const res = await axios.post(
            url,
            {},
            {
              headers: {
                Authorization: `Bearer ${account.id_token}`,
              },
            },
          );

          const data = res.data;
          if (!data.access_token || !data.refresh_token) {
            return false;
          }

          account.access_token = data.access_token;
          account.refresh_token = data.refresh_token;
          account.provider = "google";

          return true;
        } catch (e) {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, account }) {
      // 🟢 Login initial
      if (account?.access_token) {
        const decoded = jwtDecode<{ sub: string; exp: number; role: string }>(
          account.access_token,
        );

        token.user_id = decoded.sub;
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = decoded.exp;
        token.role = decoded.role;
        token.provider = account.provider;

        return token;
      }

      // 🔄 Refresh
      try {
        if (isTokenExpiringSoon(token.expires_at as number)) {
          const refreshed = await refreshAccessToken(
            token.refresh_token as string,
          );

          if (refreshed?.error) {
            token.error = "RefreshAccessTokenError";
            token.message = refreshed.message;
            token.code = refreshed.code;
            return token;
          }

          const decoded = jwtDecode<{ exp: number }>(refreshed.access_token);

          token.access_token = refreshed.access_token;
          token.refresh_token = refreshed.refresh_token;
          token.expires_at = decoded.exp;
        }
      } catch {
        token.error = "RefreshAccessTokenError";
        token.message = "Impossible de rafraîchir le token";
        token.code = 500;
      }

      return token;
    },
    async session({ session, token }) {
      session.user_id = token.user_id as string;
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      session.provider = token.provider as string;
      session.role = token.role as string;
      session.error = token.error as string;

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
