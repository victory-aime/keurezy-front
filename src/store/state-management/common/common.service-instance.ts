import { applicationInstance } from 'rise-core-frontend';
import { CommonService } from '_store/services';

export const commonServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[CommonService] No context found.');
  }
  return new CommonService(context);
};
