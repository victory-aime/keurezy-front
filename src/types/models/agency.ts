import { COMMON } from "../enum";
interface ICreateAgency {
  name?: string;
  address?: string;
  description?: string;
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

interface IAgencyFilters {
  agencyId: string;
  initialPage: number;
  limitPerPage: number;
}

export type {
  ICreateAgency,
  IUpdateAgency,
  ICloseAgency,
  IAgency,
  IAgencyFilters,
};
