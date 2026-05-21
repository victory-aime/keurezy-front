import * as Constants from './constants';
import { invitationServiceInstance } from './invitation.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllInvitationByAgency = (
  args: QUERIES.QueryPayload<{ agencyId: string; userId: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<any[]>({
    queryKey: [Constants.INVITE_KEYS.INVITATION_AGENCY_LIST],
    queryFn: () =>
      invitationServiceInstance().getAllInvitationsByAgency(params?.agencyId, params?.userId),
    options: queryOptions,
  });
};

const createInvitationMutation = (args: QUERIES.MutationPayload<MODELS.ICreateInvitation>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.INVITE_KEYS.CREATE_INVITATION],
    mutationFn: ({ payload }) => invitationServiceInstance().createInvitation(payload!),
    options: args.mutationOptions,
  });
};

const acceptInvitationMutation = (args: QUERIES.MutationPayload<any, any, { token: string }>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.INVITE_KEYS.ACCEPT_INVITATION],
    mutationFn: ({ params }) => invitationServiceInstance().acceptInvitation(params!.token),
    options: args.mutationOptions,
  });
};

const cancelInvitationMutation = (
  args: QUERIES.MutationPayload<any, any, { inviteId: string; agencyId: string; userId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.INVITE_KEYS.CANCEL_INVITATION],
    mutationFn: ({ params }) =>
      invitationServiceInstance().cancelInvitation(
        params?.inviteId!,
        params?.agencyId!,
        params?.userId!,
      ),
    options: args.mutationOptions,
  });
};

export {
  createInvitationMutation,
  cancelInvitationMutation,
  acceptInvitationMutation,
  getAllInvitationByAgency,
};
