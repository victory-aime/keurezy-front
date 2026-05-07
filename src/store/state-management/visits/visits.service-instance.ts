import { applicationInstance } from 'rise-core-frontend';
import { VisitsService } from '_store/services';

export const visitsServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[VisitsService] No context found.');
  }
  return new VisitsService(context);
};
