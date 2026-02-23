import { PropertyDetails } from "../components/PropertyDetails";

export default async function PropertyDetailsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  return <PropertyDetails id={params?.id!} />;
}
