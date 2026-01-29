import { Layout } from "../../dashboard-layout/Layout";
import { AuthProvider } from "_context/auth-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
  );
}
