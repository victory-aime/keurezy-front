import { AgencyRole } from '../enum';
import { Status } from '../enum/common';

/** `GET invite/preview` : ce que l'invité voit avant d'accepter (lecture seule). */
export interface IInvitationPreview {
  agency: { name: string; logo: string | null };
  invitedBy: string;
  role: AgencyRole;
  permissions: string[];
  maskedEmail: string;
  expiresAt: string;
}

/** `POST invite/send-code` : durées en secondes. */
export interface IInvitationCodeSent {
  expiresIn: number;
  retryIn: number;
}

export interface IAcceptInvitation {
  token: string;
  code: string;
  password: string;
}

export interface ICreateInvitation {
  agencyId: string;
  payload: {
    name: string;
    email: string;
    role: AgencyRole;
    permissions: { permissionId: string; granted: boolean }[];
  };
}

export interface IInvitationList {
  id: string;
  email: string;
  token: string;
  agencyId: string;
  agencyRole: 'AGENT';
  createdAt: Date;
  name: string;
  status: Status;
  invitedBy: string;
  expiresAt: Date;
}
