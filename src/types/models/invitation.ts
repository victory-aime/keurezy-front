import { AgencyRole } from "../enum";

export type InvitationVerificationState =
  | "loading"
  | "success"
  | "ERR_BAD_REQUEST";

export interface ICreateInvitation {
  adminId: string;
  agencyId: string;
  payload: {
    name: string;
    temporaryPassword: string;
    email: string;
    role: AgencyRole;
    permissions: { permissionId: string; granted: boolean }[];
  };
}
