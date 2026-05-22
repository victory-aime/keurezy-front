import { ENUM } from '..';
import { COMMON, PropertyType } from '../enum';

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
  features?: ENUM.PropertyFeature;
  documents?: string[];
  agencyId?: string;
  userId?: string;
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
  features: COMMON.Status;
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

export type { IPropertyResponse, ICreateProperty, IMonthlyRevenueStats, IOccupationRateStats };
