import { ENUM } from '..';

export interface ILeadsRequest {
  propertyId: string;
  tenantId: string;
  phone?: string;
  startDate?: string;
  message?: string;
}

export interface ILeadsAgency {
  id: string;
  propertyId: string;
  phone: string;
  message: string;
  status: ENUM.COMMON.Status;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  assignedToId: string;
  agencyId: string;

  property: {
    title: string;
    type: ENUM.PropertyType;
    city: null;
  };
  client: {
    phone: null;
    user: {
      name: string;
      email: string;
    };
  };
  assignedTo: null;
  visits: [];
}

export interface IAssignAgentLeads {
  leadId: string;
  agencyId: string;
  userId: string;
  staffId: string;
}

export interface ILeadsAgencyListResponse {
  content: ILeadsAgency[];
  totalDataPerPage: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
