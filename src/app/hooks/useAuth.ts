import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { APP_ROUTES } from "_config/routes";
import { sessionLogout } from "_hooks/logout";
import { useGlobalLoader } from "_context/loaderContext";
import { ProviderKeys, StorageKey } from "_constants/StorageKeys";
import { handleApiError } from "_utils/handleApiError";
import { handleApiSuccess } from "_utils/handleApiSuccess";

export const useAuth = () => {
  const router = useRouter();
  const { showLoader, hideLoader, isLoading } = useGlobalLoader();

  const logout = async () => {
    try {
      showLoader();
      localStorage.removeItem(StorageKey.OTP_REQUIRED);
      await sessionLogout().then(() => {});

      await signOut({ redirect: false });

      router.replace(APP_ROUTES.AUTH.SIGN_IN);
    } finally {
      hideLoader();
    }
  };

  const login = async ({
    email,
    password,
    callbackUrl,
    otpRequired = false,
    providerType,
  }: {
    email: string;
    password: string;
    callbackUrl?: string;
    otpRequired?: boolean;
    providerType?: (typeof ProviderKeys)[keyof typeof ProviderKeys];
  }) => {
    try {
      if (otpRequired) {
        localStorage.setItem(StorageKey.OTP_REQUIRED, "true");
      }

      if (providerType === ProviderKeys.GOOGLE) {
        const result = await signIn(ProviderKeys.GOOGLE, {
          redirect: false,
          callbackUrl: callbackUrl ?? APP_ROUTES.HOME,
        });
        if (result?.error) {
          handleApiError({
            status: result.status,
            message: result.error,
          });
          return;
        }
        if (result?.ok && result.url) {
          handleApiSuccess({ status: 200, message: "Connexion réussie" });
          router.replace(result.url);
        }
      } else {
        const result = await signIn(ProviderKeys.CREDENTIALS, {
          email,
          password,
          redirect: false,
          callbackUrl: callbackUrl ?? APP_ROUTES.HOME,
        });
        if (result?.error) {
          handleApiError({
            status: result.status,
            message: result.error,
          });
          return;
        }
        if (result?.ok && result.url) {
          handleApiSuccess({ status: 200, message: "Connexion réussie" });
          router.replace(result.url);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { logout, login, isLoading };
};
