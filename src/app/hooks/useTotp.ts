import { useCallback, useState } from "react";
import { authClient } from "../lib/auth-client";
import { handleApiSuccess } from "_utils/handleApiSuccess";
import { handleApiError } from "_utils/handleApiError";

export const useTotp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const verifyTotp = async (totpCode: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.twoFactor.verifyTotp({
        code: totpCode,
      });
      if (error) {
        return {
          status: error.status,
          message: error.statusText ?? "Code de vérification invalide",
        };
      }
      return data;
    } catch (e) {
      return {
        status: 500,
        message: "Erreur inattendue",
      };
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
          message: "TOTP désactivé",
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
    isLoading,
  };
};
