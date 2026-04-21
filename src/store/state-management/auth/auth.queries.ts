import * as Constants from './constants';
import { authServiceInstance } from './auth.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const registerUserMutation = (args: QUERIES.MutationPayload<MODELS.ICreateUser>) => {
  return QUERIES.useCustomMutation<
    MODELS.ICreateUser,
    {
      message: string;
      userId: string;
      email: string;
    }
  >({
    mutationKey: [Constants.AUTH_KEYS.REGISTER_USER],
    mutationFn: ({ payload }) => authServiceInstance().register_user(payload!),
    options: args.mutationOptions,
  });
};
const forgotPasswordInitMutation = (args: QUERIES.MutationPayload<MODELS.IForgotPasswordInit>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.FORGET_PASSWORD_INIT],
    mutationFn: ({ payload }) => authServiceInstance().forgot_password(payload!),
    options: args.mutationOptions,
  });
};
const resetPasswordMutation = (args: QUERIES.MutationPayload<MODELS.IResetPassword>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.RESET_PASSWORD],
    mutationFn: ({ payload }) => authServiceInstance().reset_password(payload!),
    options: args.mutationOptions,
  });
};

const sendEmailVerificationMutation = (
  args: QUERIES.MutationPayload<{ email: string; callbackURL: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.SEND_EMAIL_VERIFICATION],
    mutationFn: ({ payload }) => authServiceInstance().send_verification_email(payload!),
    options: args.mutationOptions,
  });
};

const checkEmailMutation = (args: QUERIES.MutationPayload<{ email: string }>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.CHECK_EMAIL],
    mutationFn: ({ payload }) => authServiceInstance().check_email(payload?.email!),
    options: args.mutationOptions,
  });
};

export {
  registerUserMutation,
  sendEmailVerificationMutation,
  forgotPasswordInitMutation,
  resetPasswordMutation,
  checkEmailMutation,
};
