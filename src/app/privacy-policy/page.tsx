import type { Metadata } from 'next';
import { LegalDocument } from '../components/legal/LegalDocument';
import { PRIVACY_DATE, PRIVACY_SECTIONS, PRIVACY_VERSION } from '../components/legal/privacy';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Quelles données Keurezy collecte, pourquoi, qui y accède, et comment exercer vos droits.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title="Politique de confidentialité"
      version={PRIVACY_VERSION}
      date={PRIVACY_DATE}
      sections={PRIVACY_SECTIONS}
    />
  );
}
