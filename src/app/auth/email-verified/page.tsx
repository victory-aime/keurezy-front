import { EmailVerified } from "../components/EmailVerified";

export default async function EmailVerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <EmailVerified params={params?.error!} />;
}
