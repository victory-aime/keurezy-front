import { applicationInstance } from 'rise-core-frontend';
import { LeadsService } from '_store/services';

export const leadsServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('LeadsService] No context found.');
  }
  return new LeadsService(context);
};
