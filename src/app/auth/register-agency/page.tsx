import { RegisterAgency } from "../components/RegisterAgency";

export default async function RegisterAgencyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <RegisterAgency token={params?.token!} />;
}
