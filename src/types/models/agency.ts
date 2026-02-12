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
export type { ICreateAgency };
