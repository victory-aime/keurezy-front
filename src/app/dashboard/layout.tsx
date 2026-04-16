import { AuthContextProvider } from "_context/auth-context";
import { headers } from "next/headers";
import { Layout } from "./Layout/Layout";
import { SessionRefreshProvider } from "_context/SessionRefresh-context";
import { UserProvider } from "_context/user-context";
import { safeGetServerSession } from "_hooks/get-server-session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await safeGetServerSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return (
    <AuthContextProvider session={session?.data as any}>
      <SessionRefreshProvider error={session?.error?.toString()}>
        <UserProvider userId={session?.data?.user?.id}>
          <Layout>{children}</Layout>
        </UserProvider>
      </SessionRefreshProvider>
    </AuthContextProvider>
  );
}
