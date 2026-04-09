import { ENUM } from "..";
import { COMMON, PropertyType } from "../enum";

interface IProperty {
  id?: string;
  ownerId?: string;
  title?: string;
  galleryImages?: string[] | File[] | null;
  description?: string;
  type?: PropertyType;
  price?: number;
  surface?: number;
  rooms?: number;
  postalCode?: number;
  sdb?: number;
  locationCaution?: number;
  address?: string;
  city?: string;
  country?: string;
  propertyAgenceId?: string;
  status?: COMMON.Status;
  propertyAgency?: {
    name?: string;
    isApprove?: boolean;
    phone?: string;
  };
}

interface ICreateProperty {
  title?: string;
  type?: PropertyType;
  propertyNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  rooms?: number;
  bathrooms?: number;
  area?: number;
  status?: COMMON.Status;
  documents?: string[];
  agencyId?: string;
  batimentId?: string;
  hasBatiment?: boolean;
}

interface IPropertyResponse {
  id: string;
  title: string;
  type: PropertyType;
  propertyNumber: string;
  propertyOwner: string;
  address: string;
  city: string;
  district: string;
  rooms: number;
  bathrooms: number;
  price: number;
  caution: number;
  area: number;
  status: COMMON.Status;
  documents: [];
  agencyId: string;
  batimentId: string;
  batiment: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface IMonthlyRevenueStats {
  month: string;
  receivedAmount: number;
  remainingAmount: number;
}

interface IOccupationRateStats {
  propertyType: ENUM.PropertyType;
  occupationRate: number;
}

export type {
  IProperty,
  IPropertyResponse,
  ICreateProperty,
  IMonthlyRevenueStats,
  IOccupationRateStats,
};
