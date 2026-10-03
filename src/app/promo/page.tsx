import type { Metadata } from 'next';
import { PromoPlayer } from './PromoPlayer';

export const metadata: Metadata = {
  title: 'Keurezy en 20 secondes',
  robots: { index: false, follow: false },
};

/** Vidéo seule, plein écran, pour l'enregistrer au format 9:16 (réseaux sociaux). */
export default function PromoPage() {
  return <PromoPlayer />;
}
