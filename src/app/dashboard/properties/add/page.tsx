import { PropertyForm } from "../components/AppartForm";

export default async function CreateProperty({
  searchParams,
}: {
  searchParams: Promise<{ requestId: string }>;
}) {
  const params = await searchParams;
  return <PropertyForm appartId={params.requestId} />;
}
