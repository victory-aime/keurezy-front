import { getServerSession } from "next-auth";
import { authOptions } from "_authOptions/auth/[...nextauth]/route";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return <>{children}</>;
}
