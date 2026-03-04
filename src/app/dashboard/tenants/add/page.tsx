import { RentalAgreementForm } from "../components/RentalAgreementForm";

export default async function AddOrEditTenant({
  searchParams,
}: {
  searchParams: Promise<{ requestId: string }>;
}) {
  const params = await searchParams;
  return <RentalAgreementForm appartId={params.requestId} />;
}
