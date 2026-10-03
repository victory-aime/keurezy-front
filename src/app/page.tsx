import type { Metadata } from 'next';
import { LandingPage } from './components/landing/LandingPage';

export const metadata: Metadata = {
  title: { absolute: 'Keurezy · Le logiciel des agences immobilières' },
  description:
    'Biens, réservations sans double location, prospects, visites, messagerie et factures : pilotez votre agence immobilière depuis un seul espace. Plan gratuit, paiement Wave, Orange Money et Mobile Money.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Keurezy · Le logiciel des agences immobilières',
    description:
      'Pilotez votre agence immobilière depuis un seul espace. Plan gratuit, sans engagement, prix en francs CFA.',
    url: '/',
    siteName: 'Keurezy',
    locale: 'fr_SN',
    type: 'website',
  },
};

export default function PublicPage() {
  return <LandingPage />;
}
