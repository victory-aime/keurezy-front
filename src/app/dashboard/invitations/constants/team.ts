import { Icons } from '_components/custom';
import { MODELS, VALIDATION } from '_types/*';
import { AgencyRole } from '../../../../types/enum';

export interface IInviteTeamUserInfo extends MODELS.IAuthSignUp {
  role: AgencyRole | any;
}

export interface ISelectPermissions {
  permissionId: string;
  granted: boolean;
}

const onboardInviteTeamInitialValues: {
  account: IInviteTeamUserInfo;
  permissions: ISelectPermissions[];
} = {
  account: {
    name: '',
    email: '',
    password: '',
    role: [AgencyRole.AGENT],
  },
  permissions: [],
};

const TOTAL_INVITE_TEAM_STEPS = 4;

const INVITE_TEAM_STEPS = [
  { title: 'Informations', icon: Icons.User },
  { title: 'Permissions', icon: Icons.Shield },
  { title: 'Confirmation', icon: Icons.Send },
  { title: 'Terminé', icon: Icons.Check },
];

const INVITE_TEAM_SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const onboardInviteTeamStepValidationSchemas = [
  VALIDATION.TEAM.inviteTeamStep1SchemaValidation, // step 1
  VALIDATION.TEAM.inviteTeamStep2SchemaValidation, // step 2
  null,
];

export {
  onboardInviteTeamInitialValues,
  onboardInviteTeamStepValidationSchemas,
  INVITE_TEAM_SLIDE_VARIANTS,
  INVITE_TEAM_STEPS,
  TOTAL_INVITE_TEAM_STEPS,
};
