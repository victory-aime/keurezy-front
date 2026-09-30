import * as Constants from './constants';
import { usersServiceInstance } from './users.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

// Profil de l'utilisateur connecté (identité déduite de la session côté serveur)
const getUserInfo = (args: QUERIES.QueryPayload<MODELS.IUser>) => {
  const { queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, undefined, MODELS.IUser>({
    queryKey: [Constants.USERS_KEYS.GET_USER_INFO],
    queryFn: () => usersServiceInstance().user_info(),
    options: queryOptions,
  });
};

const getPasskeySessions = (args: QUERIES.QueryPayload<MODELS.IUserPasskeyAndSessionsResponse>) => {
  const { queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, undefined, MODELS.IUserPasskeyAndSessionsResponse>({
    queryKey: [Constants.USERS_KEYS.PASSKEY_SESSIONS],
    queryFn: () => usersServiceInstance().passkey_session_list(),
    options: queryOptions,
  });
};

const updateUserMutation = (args: QUERIES.MutationPayload<MODELS.IUser>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.USERS_KEYS.UPDATE_USER_INFO],
    mutationFn: ({ payload }) => usersServiceInstance().update_user_info(payload!),
    options: args.mutationOptions,
  });
};

/** Codes de secours 2FA restants (le nombre seulement). */
const getBackupCodesRemaining = (args: QUERIES.QueryPayload<{ remaining: number }>) =>
  QUERIES.useCustomQuery<undefined, undefined, { remaining: number }>({
    queryKey: [Constants.USERS_KEYS.BACKUP_CODES_REMAINING],
    queryFn: () => usersServiceInstance().backup_codes_remaining(),
    options: args.queryOptions,
  });

export { getUserInfo, updateUserMutation, getPasskeySessions, getBackupCodesRemaining };
