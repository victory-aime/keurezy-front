import * as Constants from './constants';
import { teamServiceInstance } from './team.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllTeamByAgency = (args: QUERIES.QueryPayload<{ agencyId: string; userId: string }>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.ITeam[]>({
    queryKey: [Constants.TEAM_KEYS.ALL_TEAMS],
    queryFn: () => teamServiceInstance().getAllTeamByAgency(params?.agencyId, params?.userId),
    options: queryOptions,
  });
};

const changeStatusTeamMutation = (
  args: QUERIES.MutationPayload<
    {
      status: boolean;
    },
    any,
    { id?: string; userId?: string }
  >,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.TEAM_KEYS.CHANGE_STATUS],
    mutationFn: ({ params, payload }) =>
      teamServiceInstance().changeStatus(params?.id!, params?.userId!, payload!.status),
    options: args.mutationOptions,
  });
};

export { changeStatusTeamMutation, getAllTeamByAgency };
