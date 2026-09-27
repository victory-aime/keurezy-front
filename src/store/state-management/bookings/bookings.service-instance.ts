import { applicationInstance } from 'rise-core-frontend';
import { BookingsService } from '_store/services';

export const bookingsServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[BookingsService] No context found.');
  }
  return new BookingsService(context);
};
