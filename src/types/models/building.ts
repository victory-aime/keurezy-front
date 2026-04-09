import { COMMON } from "../enum";
import { IPagination } from "./pagination";
import { IPropertyResponse } from "./property";

export interface CreateBuildingDto {
  name?: string;
  address?: string;
  city?: string;
  district?: string;
  description?: string;
  buildingOwner?: string;
  floors?: number;
  status?: COMMON.Status;
  documents?: string[];
  agencyId?: string;
  landId?: string;
}

export interface UpdateBuildingDto extends CreateBuildingDto {
  id?: string;
}

export interface IDeleteBuilding {
  ownerId: string;
  id: string;
  agencyId: string;
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
}

export interface IBuildingFilter extends IPagination, IBuilding {}
