import { applicationInstance } from 'rise-core-frontend';
import { AuthService } from '_store/services';

export const authServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[AuthService] No context found.');
  }
  return new AuthService(context);
};
