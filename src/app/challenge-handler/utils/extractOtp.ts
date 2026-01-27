export const extractOtp = (otpCode: string[]) => {
  return Array.isArray(otpCode) ? otpCode?.join("") : "";
};
