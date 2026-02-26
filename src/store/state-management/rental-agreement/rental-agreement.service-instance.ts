import { applicationInstance } from "rise-core-frontend";
import { RentalAgreementService } from "_store/services";

export const rentalAgreementServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("RentalAgreementService] No context found.");
  }
  return new RentalAgreementService(context);
};
