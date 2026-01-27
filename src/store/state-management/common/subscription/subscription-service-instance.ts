import { applicationInstance } from "rise-core-frontend";
import { CommonModule } from "_store/services";

export const subscriptionServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[SubscriptionService] No context found.");
  }
  return new CommonModule.SubscriptionModule.SubscriptionService(context);
};
