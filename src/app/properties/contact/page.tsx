import { ContactAgency } from "../components/ContactAgency";

export default async function ContactAgencyPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  return <ContactAgency id={params?.id!} />;
}
