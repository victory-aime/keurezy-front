import { COMMON, PropertyType } from "../enum";
import { IPagination } from "./pagination";
interface ICreateAgency {
  name?: string;
  address?: string;
  description?: string;
  username?: string;
  userEmail?: string;
  password?: string;
  email?: string;
  phone?: string;
  userId?: string;
  acceptTerms?: boolean;
  documents?: File[];
}

interface IUpdateAgency extends ICreateAgency {
  agencyId?: string;
}
interface ICloseAgency extends IUpdateAgency {
  ownerId: string;
}

interface IAgency {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  address: string;
  phone: string;
  status: COMMON.Status;
  isApprove: boolean;
  agencyLogo?: string;
  documents: string[];
}

interface IAgencyFilters extends IPagination {
  title?: string;
  status?: COMMON.Status;
  type?: PropertyType;
}

interface IAgencyCommonParams {
  agencyId: string;
  ownerId: string;
  requestId?: string;
  propertyId?: string;
}

export type {
  ICreateAgency,
  IUpdateAgency,
  ICloseAgency,
  IAgency,
  IAgencyFilters,
  IAgencyCommonParams,
};
