import { applicationInstance } from "rise-core-frontend";
import { PropertyService } from "_store/services";

export const propertyServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[PropertyService] No context found.");
  }
  return new PropertyService(context);
};
