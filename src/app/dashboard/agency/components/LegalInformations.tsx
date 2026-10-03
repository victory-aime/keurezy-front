import { CustomSkeletonLoader } from '_components/custom';
import { AgencyLegalSection } from './AgencyLegalSection';
import { Panel } from './Panel';
import { MODELS } from '_types/*';

export const LegalInformations = ({
  agency,
  isOwner,
  refetchAgencyInfo,
}: {
  agency: MODELS.IAgency | undefined;
  isOwner: boolean;
  refetchAgencyInfo: () => void;
}) => {
  return (
    <Panel
      title="Informations légales"
      description="Utilisées pour la vérification de votre agence et sur vos factures. Elles ne sont jamais affichées publiquement."
    >
      {agency ? (
        <AgencyLegalSection agency={agency} isOwner={isOwner} onSaved={() => refetchAgencyInfo()} />
      ) : (
        <CustomSkeletonLoader type="FORM" width={'100%'} />
      )}
    </Panel>
  );
};
