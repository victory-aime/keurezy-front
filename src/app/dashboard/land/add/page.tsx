import { LandForm } from '../components/LandForm';

export default async function AddOrEditLand({
  searchParams,
}: {
  searchParams: Promise<{ landId: string }>;
}) {
  const params = await searchParams;
  return <LandForm landId={params.landId} />;
}
