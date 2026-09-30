import { TwoFactorRecoveryCancel } from '../../components/TwoFactorRecoveryCancel';

export default async function TwoFactorRecoveryCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <TwoFactorRecoveryCancel token={token} />;
}
