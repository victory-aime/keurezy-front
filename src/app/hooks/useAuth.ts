import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";
import { useGlobalLoader } from "_context/loaderContext";
import { ProviderKeys } from "_constants/StorageKeys";
import { handleApiError } from "_utils/handleApiError";
import { handleApiSuccess } from "_utils/handleApiSuccess";
import { authClient } from "../lib/auth-client";

interface AuthTypes {
  name?: string;
  email?: string;
  password?: string;
  callbackUrl?: string;
  providerType?: string;
}

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
  }: AuthTypes) => {
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
        const result = await authClient.signIn.email(
          {
            email: email!,
            password: password!,
          },
          {
            async onSuccess(context) {
              if (context.data.twoFactorRedirect) {
                router.replace(APP_ROUTES.AUTH._2FA);
              } else {
                router.push(callbackUrl!);
              }
            },
          },
        );
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
      console.log("error catch", error);
    }
  };

  const signUp = async ({ name, email, password }: AuthTypes) => {
    try {
      const result = await authClient.signUp.email({
        name: name!,
        email: email!,
        password: password!,
      });
      if (result.error) {
        handleApiError({
          status: result.error.status,
          message: result.error.message!,
        });
        return;
      }
      return result;
    } catch (error) {
      console.log("error signUp", error);
    }
  };

  return { logout, login, signUp, isLoading };
};
