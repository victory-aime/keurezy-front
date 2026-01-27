import * as Constants from "./constants";
import { otpServiceInstance } from "./otp.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const generateOtpMutation = (args: QUERIES.MutationPayload<string>) => {
  return QUERIES.useCustomMutation<string, any>({
    mutationKey: [Constants.OTP_KEYS.GENERATE_OTP],
    mutationFn: ({ payload }) => otpServiceInstance().generateOtp(payload!),
    options: args.mutationOptions,
  });
};

const validateOtpMutation = (
  args: QUERIES.MutationPayload<MODELS.COMMON.OTP.IOtp>,
) => {
  return QUERIES.useCustomMutation<MODELS.COMMON.OTP.IOtp, any>({
    mutationKey: [Constants.OTP_KEYS.VALIDATE_OTP],
    mutationFn: ({ payload }) => otpServiceInstance().validateOtp(payload!),
    options: args.mutationOptions,
  });
};

export { generateOtpMutation, validateOtpMutation };
