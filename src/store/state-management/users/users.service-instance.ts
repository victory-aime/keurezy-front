import { applicationInstance } from "rise-core-frontend";
import { UserModule } from "_store/services";

export const usersServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error("[UserService] No context found.");
  }
  return new UserModule.UserService(context);
};
