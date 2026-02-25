import { ENUM } from "..";

export interface IRentalRequest {
  propertyId: string;
  tenantId: string;
  phone?: string;
  message?: string;
}

export interface IRentalAgencyListResponse {
  id: string;
  propertyId: string;
  phone: string;
  message: string;
  status: ENUM.COMMON.Status;
  createdAt: string;
  property: {
    id: string;
    title: string;
    city: string;
    price: string;
  };
  tenant: {
    id: string;
    email: string;
    name: string;
  };
}
