import { getServerSession } from "next-auth";
import { authOptions } from "_authOptions/auth/[...nextauth]/route";
import { Layout } from "../../dashboard-layout/Layout";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return <Layout session={session}>{children}</Layout>;
}
