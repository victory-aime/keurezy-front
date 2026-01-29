import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";
import { useGlobalLoader } from "_context/loaderContext";
import { ProviderKeys } from "_constants/StorageKeys";
import { handleApiError } from "_utils/handleApiError";
import { handleApiSuccess } from "_utils/handleApiSuccess";
import { authClient } from "../lib/auth-client";

export const useAuth = () => {
  const router = useRouter();
  const { showLoader, hideLoader, isLoading } = useGlobalLoader();

  const logout = async () => {
    try {
      showLoader();
      await authClient.signOut();
      router.replace(APP_ROUTES.AUTH.SIGN_IN);
    } finally {
      hideLoader();
    }
  };

  const login = async ({
    email,
    password,
    callbackUrl,
    providerType,
  }: {
    email?: string;
    password?: string;
    callbackUrl?: string;
    providerType?: "google";
  }) => {
    try {
      if (providerType === ProviderKeys.GOOGLE) {
        const result = await authClient.signIn.social({
          provider: providerType,
          callbackURL: callbackUrl,
        });
        if (result?.error) {
          handleApiError({
            status: result.error.status,
            message: result.error.message!,
          });
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email: email!,
          password: password!,
          callbackURL: callbackUrl ?? APP_ROUTES.HOME,
        });
        if (result.error) {
          handleApiError({
            status: result.error.status,
            message: result.error.message!,
          });
          return;
        }
        if (result?.data.url) {
          handleApiSuccess({ status: 200, message: "Connexion réussie" });
          router.replace(result.data.url);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });
      if (result.error) {
        handleApiError({
          status: result.error.status,
          message: result.error.message!,
        });
        return;
      }
      if (result?.data.token) {
        handleApiSuccess({ status: 200, message: "Compte créé avec success" });
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { logout, login, signUp, isLoading };
};
