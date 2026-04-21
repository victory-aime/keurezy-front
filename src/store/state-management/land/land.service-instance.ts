import { applicationInstance } from 'rise-core-frontend';
import { LandService } from '_store/services';

export const landServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[LandService] No context found.');
  }
  return new LandService(context);
};
