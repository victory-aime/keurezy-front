import { getIdToken } from "_utils/auth";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";
import axios from "axios";
import { APIS } from "_store/endpoints";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session) {
    const idToken = await getIdToken();
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!idToken) {
      return new Response("ID token is missing.", { status: 400 });
    }

    try {
      const url = `${APIS(baseUrl).AUTH.LOGOUT.url}?id_token=${idToken}`;
      const res = await axios.post(url);
      console.log("res", res.data);
    } catch (err) {
      return new Response("Logout request failed.", { status: 400 });
    }
  }

  return new Response(null, { status: 200 });
}
