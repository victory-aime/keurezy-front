import { applicationInstance } from "rise-core-frontend";
import { AgencyService } from "_store/services";

export const agencyServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[AgencyService] No context found.");
  }
  return new AgencyService(context);
};
