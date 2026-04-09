import { AuthContextProvider } from "_context/auth-context";
import { headers } from "next/headers";
import { authClient } from "../lib/auth-client";
import { Layout } from "./Layout/Layout";
import { SessionRefreshProvider } from "_context/SessionRefresh-context";
import { InitializeApp } from "_context/provider/initialize-app";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  return (
    <AuthContextProvider session={session?.data}>
      <SessionRefreshProvider>
        <InitializeApp isLoading={!session?.data}>
          <Layout>{children}</Layout>
        </InitializeApp>
      </SessionRefreshProvider>
    </AuthContextProvider>
  );
}
