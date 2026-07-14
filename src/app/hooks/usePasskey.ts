import { useState } from 'react';
import { authClient } from '../lib/auth-client';
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

  return {
    registerPassKey: addPasskey,
    removePasskey: deletePasskey,
    isLoading,
  };
};
