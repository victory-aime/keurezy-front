import { applicationInstance } from "rise-core-frontend";
import { ContactService } from "_store/services";

export const contactServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[ContactService] No context found.");
  }
  return new ContactService(context);
};
