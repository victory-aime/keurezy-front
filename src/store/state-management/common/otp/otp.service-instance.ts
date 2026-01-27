import { applicationInstance } from "rise-core-frontend";
import { CommonModule } from "_store/services";

export const otpServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[OtpService] No context found.");
  }
  return new CommonModule.OtpModule.OtpService(context);
};
