import { AgencyRole } from '../enum';

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
