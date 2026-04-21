import * as Constants from './constants';
import { usersServiceInstance } from './users.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getUserInfo = (args: QUERIES.QueryPayload<{ userId: MODELS.IUser }>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IUser>({
    queryKey: [Constants.USERS_KEYS.GET_USER_INFO],
    queryFn: () => usersServiceInstance().user_info(params?.userId),
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

export { getUserInfo, updateUserMutation };
