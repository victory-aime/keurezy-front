import { applicationInstance } from "rise-core-frontend";
import { RentalService } from "_store/services";

export const rentalServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("RentalService] No context found.");
  }
  return new RentalService(context);
};
