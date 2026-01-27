export interface IOtp {
  email?: string;
  otp?: string;
  retryAfter?: number;
  isBlocked?: boolean;
  otpRequestCount?: number;
}
