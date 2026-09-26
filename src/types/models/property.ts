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
  batimentId?: string;
  hasBatiment?: boolean;
  rentalConfigs?: IRentalConfig[];
}

/** Fenêtre de disponibilité, bornes incluses, au format AAAA-MM-JJ. */
interface IRentalAvailability {
  startDate: string;
  endDate: string;
}

/** Modalité de location d'un bien (contrat du backend : RentalConfigDto). */
interface IRentalConfig {
  rentalType: ENUM.RentalType;
  price: number;
  deposit?: number;
  minDuration?: number | null;
  maxDuration?: number | null;
  isActive?: boolean;
  availabilities?: IRentalAvailability[];
}

interface IRentalConfigResponse {
  id: string;
  rentalType: ENUM.RentalType;
  price: string | number;
  deposit: string | number;
  minDuration: number | null;
  maxDuration: number | null;
  isActive: boolean;
}

interface IAvailabilityResponse {
  id: string;
  rentalType: ENUM.RentalType | null;
  startDate: string;
  endDate: string;
  isAvailable: boolean;
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
  rentalConfigs?: IRentalConfigResponse[];
  availabilities?: IAvailabilityResponse[];
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
  IPropertyResponse,
  ICreateProperty,
  IMonthlyRevenueStats,
  IOccupationRateStats,
  IRentalAvailability,
  IRentalConfig,
  IRentalConfigResponse,
  IAvailabilityResponse,
};
