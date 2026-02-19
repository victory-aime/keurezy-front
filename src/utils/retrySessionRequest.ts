import { authClient } from "../app/lib/auth-client";

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export async function retrySessionRequest(
  maxRetries = MAX_RETRIES,
  delay = RETRY_DELAY,
): Promise<true> {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const { data, error } = await authClient.getSession();
      if (data?.session?.token) {
        return true;
      }
      if (error) {
        attempt++;
      }
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delay));
      }
    } catch (err) {
      attempt++;
      if (attempt < maxRetries) await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Session not restored");
}
