import { AnnonceForm } from '../components/AnnoncesForm';

export default async function AnnonceFormPage({
  searchParams,
}: {
  searchParams: Promise<{ annonceId: string; propertyId?: string }>;
}) {
  const params = await searchParams;
  return <AnnonceForm annonceId={params?.annonceId} />;
}
