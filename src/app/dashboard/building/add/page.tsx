import { BuildingForm } from "../components/BuildingForm";

export default async function AddOrEditBuildinPage({
  searchParams,
}: {
  searchParams: Promise<{ buildingId: string }>;
}) {
  const params = await searchParams;
  return <BuildingForm buildingId={params.buildingId} />;
}
