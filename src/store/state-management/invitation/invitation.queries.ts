import * as Constants from './constants';
import { invitationServiceInstance } from './invitation.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllInvitationByAgency = (
  args: QUERIES.QueryPayload<any[], undefined, MODELS.IAgencyCommonParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyCommonParams, MODELS.IInvitationList[]>({
    queryKey: [Constants.INVITE_KEYS.INVITATION_AGENCY_LIST, params],
    queryFn: () => invitationServiceInstance().getAllInvitationsByAgency(params?.agencyId!),
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

/** Aperçu de l'invitation : sans nouvel essai automatique (une erreur est un état, pas un incident). */
const getInvitationPreview = (
  args: QUERIES.QueryPayload<MODELS.IInvitationPreview, undefined, { token: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { token: string }, MODELS.IInvitationPreview>({
    queryKey: [Constants.INVITE_KEYS.PREVIEW_INVITATION, params],
    queryFn: () => invitationServiceInstance().previewInvitation(params!.token),
    options: { retry: false, refetchOnWindowFocus: false, ...queryOptions },
  });
};

const sendInvitationCodeMutation = (
  args: QUERIES.MutationPayload<{ token: string }, MODELS.IInvitationCodeSent> = {},
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.INVITE_KEYS.SEND_INVITATION_CODE],
    mutationFn: ({ payload }) => invitationServiceInstance().sendInvitationCode(payload!.token),
    options: args.mutationOptions,
  });

const acceptInvitationMutation = (
  args: QUERIES.MutationPayload<MODELS.IAcceptInvitation, { email: string }> = {},
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.INVITE_KEYS.ACCEPT_INVITATION],
    mutationFn: ({ payload }) => invitationServiceInstance().acceptInvitation(payload!),
    options: args.mutationOptions,
  });

const cancelInvitationMutation = (
  args: QUERIES.MutationPayload<any, any, { inviteId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.INVITE_KEYS.CANCEL_INVITATION],
    mutationFn: ({ params }) => invitationServiceInstance().cancelInvitation(params?.inviteId!),
    options: args.mutationOptions,
  });
};

/** Renvoi d'une invitation en attente (nouveau mot de passe temporaire). */
const resendInvitationMutation = (
  args: QUERIES.MutationPayload<unknown, unknown, { inviteId: string }> = {},
) =>
  QUERIES.useCustomMutation<unknown, unknown, { inviteId: string }>({
    mutationKey: [Constants.INVITE_KEYS.RESEND_INVITATION],
    mutationFn: ({ params }) => invitationServiceInstance().resendInvitation(params!.inviteId),
    options: args.mutationOptions,
  });

export {
  resendInvitationMutation,
  createInvitationMutation,
  cancelInvitationMutation,
  acceptInvitationMutation,
  getInvitationPreview,
  sendInvitationCodeMutation,
  getAllInvitationByAgency,
};
