import { ENUM } from '_types/*';
import { MainOnboarding } from './components/MainOnboarding';

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ planId: string; billingCycle: ENUM.BillingCycle }>;
}) {
  const { planId, billingCycle } = await searchParams;

  return <MainOnboarding planId={planId} billingCycle={billingCycle} />;
}
