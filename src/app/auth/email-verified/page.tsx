import { EmailVerified } from "../components/EmailVerified";

export default async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <EmailVerified params={params?.token!} />;
}
