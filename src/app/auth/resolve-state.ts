import { VerificationState } from "./auth.types";

export function resolveState(key: string): VerificationState {
  switch (key) {
    case "token":
      return "loading";
    case "token_expired":
      return "token_expired";
    case "invalid_token":
      return "invalid_token";
    default:
      return "unknown_error";
  }
}
