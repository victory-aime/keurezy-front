import * as Constants from "./constants";
import { usersServiceInstance } from "./users.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getUserInfo = (args: QUERIES.QueryPayload<{ userId: MODELS.IUser }>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IUser, any>({
    queryKey: [Constants.USERS_KEYS.GET_USER_INFO],
    queryFn: () => usersServiceInstance().user_info(params?.userId),
    options: queryOptions,
  });
};

const resetPasswordMutation = (args: QUERIES.MutationPayload<MODELS.IUser>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.USERS_KEYS.RESET_PASSWORD],
    mutationFn: ({ payload }) =>
      usersServiceInstance().reset_password(payload!),
    options: args.mutationOptions,
  });
};

const regeneratePasswordMutation = (
  args: QUERIES.MutationPayload<MODELS.IUser>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.USERS_KEYS.REGENERATE_PASSWORD],
    mutationFn: ({ payload }) =>
      usersServiceInstance().regenerate_password(payload!),
    options: args.mutationOptions,
  });
};

const checkEmailMutation = (
  args: QUERIES.MutationPayload<{ email: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.USERS_KEYS.CHECK_EMAIL],
    mutationFn: ({ payload }) =>
      usersServiceInstance().check_email(payload?.email!),
    options: args.mutationOptions,
  });
};

export {
  getUserInfo,
  resetPasswordMutation,
  regeneratePasswordMutation,
  checkEmailMutation,
};
