import { ENUM } from '_types/*';
import { MainOnboarding } from './components/MainOnboarding';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ planId: string; billingCycle: ENUM.BillingCycle; payment?: string }>;
}) {
  const { planId, billingCycle, payment } = await searchParams;

  return <MainOnboarding planId={planId} billingCycle={billingCycle} payment={payment} />;
}
