import { COMMON } from '../enum';
import { IPagination } from './pagination';

export interface ILandDto {
  title?: string;
  purchasePrice?: number;
  area?: number;
  city?: string;
  paymentType?: string;
  address?: string;
  district?: string;
  landOwner?: string;
  status?: COMMON.Status;
  documents?: string[];
  agencyId?: string;
}

export interface CreateLandDto extends ILandDto {
  ownerId?: string;
}

export interface UpdateLandDto extends ILandDto {
  id?: string;
  ownerId?: string;
}

export interface LandResponseDto extends ILandDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  batiments: any[];
}

export interface ILandFilter extends IPagination, ILandDto {}
