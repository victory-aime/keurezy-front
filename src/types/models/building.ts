import { COMMON } from '../enum';
import { IPagination } from './pagination';
import { IPropertyResponse } from './property';

export interface CreateBuildingDto {
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  description?: string;
  buildingOwner?: string;
  floors?: number;
  status?: COMMON.Status | any;
  documents?: string[];
  agencyId?: string;
  landId?: string;
}

export interface UpdateBuildingDto extends CreateBuildingDto {
  id?: string;
}

export interface IDeleteBuilding {
  id: string;
}

export interface IBuilding {
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  description?: string;
  floors?: number;
  buildingOwner?: string;
  documents?: string[];
  status?: COMMON.Status;
  agencyId?: string;
  landId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  properties?: IPropertyResponse[];
  land?: {
    id: string;
    title: string;
  } | null;
}

export interface IBuildingFilter extends IPagination, IBuilding {}

/**
 * Ce que la suppression d'un bâtiment entraîne (`GET building/impact`) : ses biens sont
 * supprimés avec lui, et leur historique cumulé décide si c'est permis (`canDelete`).
 */
export interface IBuildingImpact {
  properties: { id: string; title: string }[];
  annonces: { total: number; online: number };
  bookings: { total: number; upcoming: number; pending: number };
  conversations: number;
  visits: { total: number; upcoming: number };
  canDelete: boolean;
}
