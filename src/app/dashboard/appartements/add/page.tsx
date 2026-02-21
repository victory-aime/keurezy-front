import { AppartForm } from "../components/AppartForm";

export default async function CreateProperty({
  searchParams,
}: {
  searchParams: Promise<{ requestId: string }>;
}) {
  const params = await searchParams;
  return <AppartForm appartId={params.requestId} />;
}
