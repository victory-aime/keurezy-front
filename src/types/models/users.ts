import { UserRole } from "../enum";

export interface IUser {
  id?: string;
  name?: string;
  firstName?: string;
  image?: string;
  phone?: string;
  email?: string;
  role?: UserRole | undefined;
  isActive?: boolean;
  password?: string;
  enabled2FA?: boolean;
}

export interface IPermission {
  features: string;
  modules: string;
}
