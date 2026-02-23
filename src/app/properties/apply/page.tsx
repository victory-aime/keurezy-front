import { PropertyApply } from "../components/PropertyApply";

export default async function PropertyApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;

  return <PropertyApply id={params?.id!} />;
}
