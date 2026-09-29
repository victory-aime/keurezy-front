import { ENTITY_QUERY_OPTIONS } from '../query-options';
import * as Constants from './constants';
import { teamServiceInstance } from './team.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllTeamByAgency = (
  args: QUERIES.QueryPayload<MODELS.ITeam[], undefined, MODELS.IAgencyCommonParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyCommonParams, MODELS.ITeam[]>({
    queryKey: [Constants.TEAM_KEYS.ALL_TEAMS, params],
    queryFn: () => teamServiceInstance().getAllTeamByAgency(params?.agencyId!),
    options: queryOptions,
  });
};

const changeStatusTeamMutation = (
  args: QUERIES.MutationPayload<{ status: boolean; id: string }, any, MODELS.IAgencyCommonParams>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.TEAM_KEYS.CHANGE_STATUS],
    mutationFn: ({ params, payload }) =>
      teamServiceInstance().changeStatus(payload!, params?.agencyId!),
    options: args.mutationOptions,
  });
};

/** Permissions d'un membre : la liste envoyée remplace les précédentes. */
const updateTeamPermissionsMutation = (
  args: QUERIES.MutationPayload<
    MODELS.IUpdateStaffPermissions,
    MODELS.IUpdateStaffPermissionsResponse,
    MODELS.IAgencyCommonParams
  > = {},
) => {
  return QUERIES.useCustomMutation<
    MODELS.IUpdateStaffPermissions,
    MODELS.IUpdateStaffPermissionsResponse,
    MODELS.IAgencyCommonParams
  >({
    mutationKey: [Constants.TEAM_KEYS.UPDATE_PERMISSIONS],
    mutationFn: ({ params, payload }) =>
      teamServiceInstance().updatePermissions(payload!, params?.agencyId!),
    options: {
      ...args.mutationOptions,
      onSuccess: (...result) => {
        QUERIES.QueryCache.invalidate([Constants.TEAM_KEYS.ALL_TEAMS]);
        return args.mutationOptions?.onSuccess?.(...result);
      },
    },
  });
};

type MemberParams = { agencyId: string; id: string };

/** Impact du retrait d'un membre ; chargé à l'ouverture de la confirmation. */
const getMemberImpactQueries = (
  args: QUERIES.QueryPayload<MODELS.IMemberImpact, undefined, MemberParams>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, MemberParams, MODELS.IMemberImpact>({
    queryKey: [Constants.TEAM_KEYS.MEMBER_IMPACT, params],
    queryFn: () => teamServiceInstance().getMemberImpact(params as MemberParams),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

/** Retrait d'un membre : la liste de l'équipe est rechargée ensuite. */
const removeMemberMutation = (args: QUERIES.MutationPayload<unknown, unknown, MemberParams> = {}) =>
  QUERIES.useCustomMutation<unknown, unknown, MemberParams>({
    mutationKey: [Constants.TEAM_KEYS.REMOVE_MEMBER],
    mutationFn: ({ params }) => teamServiceInstance().removeMember(params!),
    options: {
      ...args.mutationOptions,
      onSuccess: (...result) => {
        QUERIES.QueryCache.invalidate([Constants.TEAM_KEYS.ALL_TEAMS]);
        return args.mutationOptions?.onSuccess?.(...result);
      },
    },
  });

export {
  changeStatusTeamMutation,
  getAllTeamByAgency,
  updateTeamPermissionsMutation,
  getMemberImpactQueries,
  removeMemberMutation,
};
