import { Layout } from "./Layout/Layout";
import { SessionRefreshProvider } from "_context/SessionRefresh-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionRefreshProvider>
      <Layout>{children}</Layout>
    </SessionRefreshProvider>
  );
}
