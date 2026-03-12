import { ENUM } from "..";

export interface IRentalRequest {
  propertyId: string;
  tenantId: string;
  phone?: string;
  startDate?: string;
  message?: string;
}

export interface IRentalAgency {
  id: string;
  propertyId: string;
  phone: string;
  message: string;
  status: ENUM.COMMON.Status;
  startDate: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
    city: string;
    price: string;
  };
  tenant?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface IRentalAgencyListResponse {
  content: IRentalAgency[];
  totalDataPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
