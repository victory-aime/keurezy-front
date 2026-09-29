import { ENUM } from '..';
import { COMMON } from '../enum';
import { IPropertyResponse } from './property';

/** Client proposé pour une visite : il a réservé ou écrit à l'agence (`visits/agency-clients`). */
interface IVisitClient {
  id: string;
  phone?: string | null;
  user: { name: string; email: string };
}

interface IVisitResponse {
  id?: string;
  scheduledAt?: string | any;
  title?: string;
  startTime?: string;
  endTime?: string;
  status?: ENUM.COMMON.Status;
  notes?: string;
  clientId?: string;
  propertyId?: string;
  agentId?: string;
  agencyId?: string;
  createdAt?: string;
  updatedAt?: string;
  property?: IPropertyResponse;
  client?: IVisitClient;
  /** Agent assigné (membre de l'équipe) */
  agent?: { user: { id?: string; name: string; email?: string } } | null;
}

/** Données envoyées à `visits/create` (client et bien obligatoires) et `visits/update`. */
interface IVisitPayload {
  title?: string;
  scheduledAt?: string | any;
  startTime?: string;
  endTime?: string;
  clientId?: string;
  propertyId?: string;
  status?: COMMON.Status;
  agentId?: string;
  notes?: string;
  visitId?: string;
}

export type { IVisitClient, IVisitResponse, IVisitPayload };
