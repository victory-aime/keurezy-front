import { applicationInstance } from "rise-core-frontend";
import { ChatService } from "_store/services";

export const chatServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("ChatService] No context found.");
  }
  return new ChatService(context);
};
