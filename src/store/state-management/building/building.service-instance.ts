import { applicationInstance } from "rise-core-frontend";
import { BuildingService } from "_store/services";

export const buildingServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[BuildingService] No context found.");
  }
  return new BuildingService(context);
};
