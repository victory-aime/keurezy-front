import {useRouter} from 'next/navigation';
import {APP_ROUTES} from '_config/routes';
import {useGlobalLoader} from '_context/loaderContext';
import {handleApiError} from '_utils/handleApiError';
import {handleApiSuccess} from '_utils/handleApiSuccess';
import {authClient} from '../lib/auth-client';
import {queryClient} from '../lib/query-client';
import {roleToDashboardMap} from "_constants/role";

interface AuthTypes {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
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
      queryClient.clear();
      window.location.href = APP_ROUTES.ROOT;
    } catch (error) {
      handleApiError({
        status: 500,
        message: 'Une erreur est survenue lors de la déconnexion.',
      });
    } finally {
      hideLoader();
    }
  };

  const login = async ({ email, password, callbackUrl }: AuthTypes) => {
    try {
      const result = await authClient.signIn.email(
        {
          email: email!,
          password: password!,
        },
        {
          async onSuccess(context) {
            if (context.data.twoFactorRedirect) {
              router.replace(APP_ROUTES.AUTH._2FA);
            } else if (callbackUrl) {
              router.push(callbackUrl);
            } else {
              return;
            }
          },
        },
      );
      console.log('login result:', JSON.stringify(result));
      if (result.error) {
        handleApiError({
          status: result.error.status,
          message: result.error.message!,
        });
        return;
      }
      if (result?.data) {
        handleApiSuccess({ status: 200, message: 'Connexion réussie' });
        // ✅ Hard navigation — force le browser à envoyer le cookie
        // router.push() = client-side, le cookie n'est pas encore dans la requête
        // ✅ Rôle disponible directement dans la réponse login
        const role = result.data?.user?.role;
        window.location.href = role
            ? (roleToDashboardMap[role] ?? APP_ROUTES.REDIRECT)
            : APP_ROUTES.REDIRECT;
      }
    } catch (error) {
      handleApiError({
        status: 500,
        message: 'Une erreur interne est survenue. Veuillez réessayer plus tard.',
      });
    }
  };

  return { logout, login, isLoading };
};
