import { useCallback, useState } from 'react';
import { authClient } from '../lib/auth-client';
import { handleApiSuccess } from '_utils/handleApiSuccess';
import { handleApiError } from '_utils/handleApiError';

/** État de la vérification 2FA en cours (`GET /two-factor/status` du backend). */
export interface TwoFactorStatus {
  /** Fin du verrouillage (ISO), `null` si le compte n'est pas verrouillé. */
  lockedUntil: string | null;
  remainingAttempts: number;
  /** Recours sans code : récupération autonome (membre) ou support (owner). */
  recovery: 'self' | 'support';
}

/** `null` quand aucun défi 2FA n'est valide (expiré, détruit après trop d'essais, ou absent). */
export const fetchTwoFactorStatus = async (): Promise<TwoFactorStatus | null> => {
  try {
    const { data, error } = await authClient.$fetch<TwoFactorStatus>('/two-factor/status', {
      method: 'GET',
    });
    return error ? null : data;
  } catch {
    return null;
  }
};

export const useTotp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const verifyTotp = async (totpCode: string, trustedDevice?: boolean) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: totpCode,
        trustDevice: trustedDevice ?? false,
      });
      if (error) {
        return {
          status: error.status,
          code: error.code,
          message: error.statusText ?? 'Code de vérification invalide',
        };
      }
      return data;
    } catch (e) {
      return {
        status: 500,
        message: 'Erreur inattendue',
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Connexion avec un code de secours (téléphone perdu). Même format de retour que
   * `verifyTotp` ; Better Auth invalide le code après usage.
   */
  const verifyBackupCode = async (code: string, trustedDevice?: boolean) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.twoFactor.verifyBackupCode({
        code: code.trim(),
        trustDevice: trustedDevice ?? false,
      });
      if (error) {
        return {
          status: error.status,
          code: error.code,
          message: error.statusText ?? 'Code de secours invalide',
        };
      }
      return data;
    } catch (e) {
      return { status: 500, message: 'Erreur inattendue' };
    } finally {
      setIsLoading(false);
    }
  };

  const enable = useCallback(async (password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.twoFactor.enable({ password });
      if (error) {
        handleApiError({ status: 400, message: error.message! });
        return null;
      }
      return data; // { totpURI, backupCodes }
    } catch (e) {
      console.error(e);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disable = useCallback(async (password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await authClient.twoFactor.disable({ password });
      if (error) {
        handleApiError({ status: 400, message: error.message! });
        return false;
      }
      if (data?.status) {
        handleApiSuccess({
          status: 201,
          message: 'TOTP désactivé',
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    enableTotp: enable,
    disableTotp: disable,
    verifyTotp,
    verifyBackupCode,
    isLoading,
  };
};
