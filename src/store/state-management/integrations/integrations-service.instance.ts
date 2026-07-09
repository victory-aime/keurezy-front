import { applicationInstance } from 'rise-core-frontend';
import { IntegrationsService } from '_store/services';

export const integrationsServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[IntegrationsService] No context found.');
  }
  return new IntegrationsService(context);
};
