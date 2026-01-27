import { signOut } from "next-auth/react";
import axios from "axios";
import { APIS } from "_store/endpoints";
import { APP_ROUTES } from "_config/routes";

export async function refreshAccessToken(refresh_token: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const res = await axios.post(APIS(baseUrl).AUTH.REFRESH.url, {
      refresh_token,
    });

    const data = res.data;
    if (!data?.access_token || !data?.refresh_token) {
      throw new Error("Invalid token refresh response");
    }

    console.log("Refreshed token:", data);
    return data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Erreur serveur";
    const code = error.response?.data?.code || "TOKEN_INVALID";
    console.error("❌ Failed to refresh token:", error);
    if (code === 102) {
      await signOut({ callbackUrl: APP_ROUTES.AUTH.SIGN_IN });
    }
    return { error: true, message, code };
  }
}
