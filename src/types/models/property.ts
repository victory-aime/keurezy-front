import { COMMON, PropertyType } from "../enum";

interface IProperty {
  id?: string;
  ownerId?: string;
  title?: string;
  galleryImages?: string[];
  description?: string;
  type?: PropertyType;
  price?: number;
  surface?: number;
  rooms: number;
  address?: string;
  city?: string;
  country?: string;
  status?: COMMON.Status;
}

interface IPropertyResponse {
  content: IProperty[];
  totalDataPerPages: number;
}

export type { IProperty, IPropertyResponse };
