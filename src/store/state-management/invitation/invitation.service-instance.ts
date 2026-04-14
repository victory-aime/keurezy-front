import { applicationInstance } from "rise-core-frontend";
import { InvitationService } from "_store/services";

export const invitationServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[InvitationService] No context found.");
  }
  return new InvitationService(context);
};
