import { ENUM } from '..';
import { ILeadsAgency } from './leads';
import { IPropertyResponse } from './property';

interface IVisistResponse {
  id: string;
  scheduledAt: string;
  status: ENUM.COMMON.Status;
  notes: string;
  leadId: string;
  propertyId: string;
  agentId: string;
  agencyId: string;
  createdAt: string;
  updatedAt: string;
  property: IPropertyResponse;
  agent: null | any;
  lead: ILeadsAgency;
}

export type { IVisistResponse };
