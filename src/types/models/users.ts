import { UserRole } from "../enum";
import { Status } from "../enum/common";

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  status?: Status | undefined;
  role?: UserRole | undefined;
  accounts?: IAccountUsers[];
  propertyOwner?: { id: string; propertyAgency: { id: string } };
}

export interface IUserPasskeyList {
  name?: string;
  publicKey?: string;
  userId?: string;
  credentialID?: string;
  counter?: number;
  deviceType?: string;
  backedUp?: boolean;
  transports?: string;
  createdAt?: string | Date | any;
  aaguid?: string;
  id?: string;
}

export interface IAccountUsers {
  id?: string;
  accountId?: string;
  providerId?: string;
  userId?: string;
}

export interface IPermission {
  features: string;
  modules: string;
}
