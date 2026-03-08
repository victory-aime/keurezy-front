import { Suspense } from "react";
import { Layout } from "./Layout/Layout";
import { SessionRefreshProvider } from "_context/SessionRefresh-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionRefreshProvider>
      <Suspense>
        <Layout>{children}</Layout>
      </Suspense>
    </SessionRefreshProvider>
  );
}
