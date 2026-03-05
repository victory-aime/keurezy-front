import { applicationInstance } from "rise-core-frontend";
import { NotificationsService } from "_store/services";

export const notificationsServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("NotificationsService] No context found.");
  }
  return new NotificationsService(context);
};
