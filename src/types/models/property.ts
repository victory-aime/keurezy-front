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

interface ICreateProperty extends IProperty {
  galleryImages?: File[] | null;
}

interface IPropertyResponse {
  content: IProperty[];
  totalDataPerPages: number;
}

export type { IProperty, IPropertyResponse, ICreateProperty };
