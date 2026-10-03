'use client';

import { LegalDocument } from '../components/legal/LegalDocument';
import { TERMS_DATE, TERMS_SECTIONS, TERMS_VERSION } from '../components/terms/TermsContent';

export default function TermsPage() {
  return (
    <LegalDocument
      title="Conditions générales d’utilisation"
      version={TERMS_VERSION}
      date={TERMS_DATE}
      sections={TERMS_SECTIONS}
    />
  );
}
