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

export type CreateLandDto = ILandDto;

export interface UpdateLandDto extends ILandDto {
  id?: string;
}

export interface LandResponseDto extends ILandDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  batiments: any[];
}

export interface ILandFilter extends IPagination, ILandDto {}

/** Bâtiments et villas portés par un terrain (`GET land/impact`), affichés avant sa suppression. */
export interface ILandImpact {
  batiments: { id: string; name: string }[];
  villas: number;
  canDelete: boolean;
}
