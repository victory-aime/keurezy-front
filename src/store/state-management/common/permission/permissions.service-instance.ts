import { applicationInstance } from 'rise-core-frontend';
import { PermissionService } from '_store/services';

export const permissionServiceInstance = () => {
  const context = applicationInstance.getContext();
  if (!context) {
    throw new Error('[PermissionService] No context found.');
  }
  return new PermissionService(context);
};
