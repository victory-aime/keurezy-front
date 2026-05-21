import { ENUM } from '..';
import { COMMON } from '../enum';
import { ILeadsAgency } from './leads';
import { IPropertyResponse } from './property';

interface IVisitResponse {
  id?: string;
  scheduledAt?: string | any;
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: ENUM.COMMON.Status;
  notes?: string;
  leadId?: string;
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  createdAt?: string;
  updatedAt?: string;
  property?: IPropertyResponse;
  agent?: null | any;
  lead?: ILeadsAgency;
}

interface IVisitPayload {
  title?: string;
  scheduledAt?: string | any;
  startTime?: string;
  endTime?: string;
  propertyId?: string;
  leadId?: string;
  status?: COMMON.Status;
  agentId?: string;
  notes?: string;
  visitId?: string;
}

export type { IVisitResponse, IVisitPayload };
