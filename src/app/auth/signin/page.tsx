import { SignIn } from "../components/SignIn";

export default async function SignInPages({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  return <SignIn callbackUrl={params.callbackUrl} />;
}
