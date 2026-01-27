import { authOptions } from "_authOptions/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function getAccessToken() {
  const session = await getServerSession(authOptions);
  if (session) {
    return session.access_token!;
  }
  return null;
}

export async function getIdToken() {
  const session = await getServerSession(authOptions);
  if (session) {
    return session.user_id;
  }
  return null;
}
