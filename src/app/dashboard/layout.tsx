import { Layout } from "./Layout/Layout";
import { AuthContextProvider } from "_context/auth-context";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContextProvider>
      <Layout>{children}</Layout>
    </AuthContextProvider>
  );
}
