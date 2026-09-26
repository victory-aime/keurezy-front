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

export { changeStatusTeamMutation, getAllTeamByAgency };
