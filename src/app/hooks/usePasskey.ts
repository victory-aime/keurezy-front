import { useCallback, useState } from 'react';
import { authClient } from '../lib/auth-client';
import { handleApiSuccess } from '_utils/handleApiSuccess';
import { handleApiError } from '_utils/handleApiError';

export const usePasskey = () => {
  const [isLoading, setIsLoading] = useState(false);

  const addPasskey = async (name: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.passkey.addPasskey({
        name,
        authenticatorAttachment: 'cross-platform',
      });
      if (error) {
        handleApiError({ status: 400, message: error.statusText! });
        return null;
      }
      console.log('data', data);
      return data;
    } catch (e) {
      handleApiError({ status: 500, message: 'Erreur inattendue' });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePasskey = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.passkey.deletePasskey({
        id,
      });
      if (error) {
        handleApiError({ status: 400, message: error.statusText! });
        return null;
      }
      return data;
    } catch (e) {
      handleApiError({ status: 500, message: 'Erreur inattendue' });
    } finally {
      setIsLoading(false);
    }
  };

  const passkeyList = async () => {
    setIsLoading(true);
    try {
      const { data: passkeys, error } = await authClient.passkey.listUserPasskeys();
      if (error) {
        handleApiError({ status: 400, message: error.statusText! });
        return null;
      }
      return passkeys;
    } catch (e) {
      handleApiError({ status: 500, message: 'Erreur inattendue' });
    } finally {
      setIsLoading(false);
    }
  };

  //   const enable = useCallback(async (password: string) => {
  //     try {
  //       setIsLoading(true);
  //       const { data, error } = await authClient.twoFactor.enable({ password });
  //       if (error) {
  //         handleApiError({ status: 400, message: error.message! });
  //         return null;
  //       }
  //       return data; // { totpURI, backupCodes }
  //     } catch (e) {
  //       console.error(e);
  //       return null;
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, []);

  //   const disable = useCallback(async (password: string) => {
  //     try {
  //       setIsLoading(true);
  //       const { data, error } = await authClient.twoFactor.disable({ password });
  //       if (error) {
  //         handleApiError({ status: 400, message: error.message! });
  //         return false;
  //       }
  //       if (data?.status) {
  //         handleApiSuccess({
  //           status: 201,
  //           message: "TOTP désactivé",
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (e) {
  //       console.error(e);
  //       return false;
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, []);

  return {
    // enableTotp: enable,
    // disableTotp: disable,
    registerPassKey: addPasskey,
    removePassKey: deletePasskey,
    passkeyList,
    isLoading,
  };
};
