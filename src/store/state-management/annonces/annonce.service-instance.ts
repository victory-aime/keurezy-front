import { applicationInstance } from 'rise-core-frontend';
import { AnnoncesService } from '_store/services';

export const annoncesServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[AnnoncesService] No context found.');
  }
  return new AnnoncesService(context);
};
