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
