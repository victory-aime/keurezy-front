import { AnnonceForm } from '../components/AnnoncesForm';
import { Suspense } from 'react';

export default async function AnnonceFormPage({
  searchParams,
}: {
  searchParams: Promise<{ annonceId: string; propertyId?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense>
      <AnnonceForm annonceId={params?.annonceId} />
    </Suspense>
  );
}
