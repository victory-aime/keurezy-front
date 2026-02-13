import { COMMON } from "../enum";
interface ICreateAgency {
  name?: string;
  address?: string;
  description?: string;
  phone?: string;
  agencyLogo?: File | null;
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
  agencyLogo: string;
  documents: string[];
}

export type { ICreateAgency, IUpdateAgency, ICloseAgency, IAgency };
