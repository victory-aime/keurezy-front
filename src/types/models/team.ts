import { UserRole, COMMON } from '../enum';

export interface ITeam {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: COMMON.Status;
  userId?: string;
  createdAt?: string;
  permissions: {
    id: string;
    staffId: string;
    permissionId: string;
    granted: boolean;
    grantedBy: string;
    grantedAt: string;
    permission: {
      id: string;
      name: string;
      description: string;
      featureId: string;
      feature: {
        id: string;
        name: string;
        description: string | null;
        category: string;
      };
    };
  }[];
}

interface IPerm {}

/** Mise à jour des permissions d'un membre : liste complète des permissions accordées. */
export interface IUpdateStaffPermissions {
  staffId: string;
  permissionIds: string[];
}

export interface IUpdateStaffPermissionsResponse {
  message: string;
  member: ITeam;
}

/** Ce que le retrait d'un membre entraîne (`GET team/member-impact`). */
export interface IMemberImpact {
  name: string;
  email: string;
  /** Visites assignées au membre (dont à venir) : elles seront désassignées */
  visits: { assigned: number; upcoming: number };
  tickets: number;
  /** Permissions retirées avec le profil */
  permissions: number;
}
