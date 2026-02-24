import { COMMON } from "../enum";

export interface IContact {
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  userId?: string;
  propertyId?: string;
  agencyId?: string;
}

export interface IAgencyRequestList {
  id?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: COMMON.Status;
  propertyId?: string;
  agencyId?: string;
  userId?: null;
  createdAt?: string;
  updatedAt?: string;
  property?: {
    title: string;
  };
  user: null;
}
