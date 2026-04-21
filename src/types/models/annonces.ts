import { ENUM } from '..';
import { IPropertyResponse } from './property';

interface IAnnonceResponse {
  id?: string;
  title?: string;
  propertyId?: string;
  description?: string;
  galleryImages?: string[];
  status?: ENUM.COMMON.Status;
  publishedAt?: null;
  createdAt?: string;
  updatedAt?: string;
  property?: IPropertyResponse | null;
}

interface ICreateAnnonce {
  title?: string;
  propertyId?: string;
  description?: string;
  galleryImages?: string[];
  agencyId?: string;
  status?: string;
  propertyType?: string;
  loyer?: string;
  area?: number;
  rooms?: number;
  bathrooms?: number;
}

interface IUpdateAnnonce extends ICreateAnnonce {
  id?: string;
}

export type { ICreateAnnonce, IUpdateAnnonce, IAnnonceResponse };
