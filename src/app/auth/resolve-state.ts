import { VerificationState } from "./auth.types";

export function resolveState(error: string): VerificationState {
  if (!error) return "success";

  switch (error) {
    case "token_expired":
      return "token_expired";
    case "invalid_token":
      return "invalid_token";
    default:
      return "unknown_error";
  }
}
