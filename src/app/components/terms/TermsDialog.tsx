'use client';

import { BaseModal, BaseText, Icons, ModalOpenProps, TextVariant } from '_components/custom';
import { TERMS_DATE, TERMS_VERSION, TermsArticles } from './TermsContent';

/**
 * CGU dans une fenêtre (inscription) : lecture sur place, défilement à l'intérieur, et
 * « J'accepte » qui coche la case. La page publique `/terms-and-conditions` reste disponible.
 */
export const TermsDialog = ({
  open,
  onOpenChange,
  onAccept,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}) => (
  <BaseModal
    isOpen={open}
    onChange={onOpenChange as ModalOpenProps['onChange']}
    size="xl"
    scrollBehavior="inside"
    icon={<Icons.Paper />}
    title="Conditions générales d’utilisation"
    description={`Version ${TERMS_VERSION} · en vigueur au ${TERMS_DATE}`}
    buttonCancelTitle="Fermer"
    colorCancelButton="neutral"
    buttonSaveTitle="J’accepte les conditions"
    onClick={() => {
      onAccept();
      onOpenChange(false);
    }}
  >
    <BaseText variant={TextVariant.S} color="fg.muted" mb={4}>
      Prenez le temps de lire ces conditions : elles encadrent votre utilisation de Keurezy,
      l’abonnement de votre agence et vos données.
    </BaseText>
    <TermsArticles headingAs="h3" />
  </BaseModal>
);
