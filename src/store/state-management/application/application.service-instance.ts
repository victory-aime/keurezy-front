import { applicationInstance } from 'rise-core-frontend';
import { ApplicationService } from '_store/services';

export const applicationServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('ApplicationService] No context found.');
  }
  return new ApplicationService(context);
};
