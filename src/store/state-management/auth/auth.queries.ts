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

const sendEmailVerificationMutation = (args: QUERIES.MutationPayload<{ email: string }>) => {
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

const twoFactorRecoveryRequestMutation = (
  args: QUERIES.MutationPayload<MODELS.ITwoFactorRecoveryRequest, MODELS.IOneTimeCodeSent> = {},
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.TWO_FACTOR_RECOVERY_REQUEST],
    mutationFn: ({ payload }) => authServiceInstance().two_factor_recovery_request(payload!),
    options: args.mutationOptions,
  });

const twoFactorRecoveryConfirmMutation = (
  args: QUERIES.MutationPayload<MODELS.ITwoFactorRecoveryConfirm, { executeAt: string }> = {},
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.TWO_FACTOR_RECOVERY_CONFIRM],
    mutationFn: ({ payload }) => authServiceInstance().two_factor_recovery_confirm(payload!),
    options: args.mutationOptions,
  });

const twoFactorRecoveryCancelMutation = (
  args: QUERIES.MutationPayload<{ token: string }, { message: string }> = {},
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AUTH_KEYS.TWO_FACTOR_RECOVERY_CANCEL],
    mutationFn: ({ payload }) => authServiceInstance().two_factor_recovery_cancel(payload!.token),
    options: args.mutationOptions,
  });

export {
  twoFactorRecoveryRequestMutation,
  twoFactorRecoveryConfirmMutation,
  twoFactorRecoveryCancelMutation,
  registerUserMutation,
  sendEmailVerificationMutation,
  forgotPasswordInitMutation,
  resetPasswordMutation,
  checkEmailMutation,
};
