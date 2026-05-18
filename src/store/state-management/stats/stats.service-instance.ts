import { applicationInstance } from 'rise-core-frontend';
import { StatsService } from '_store/services';

export const StatsServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    console.warn('[StatsService] No context found.');
  }
  return new StatsService(context);
};
