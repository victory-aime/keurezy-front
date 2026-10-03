'use client';

import { BaseTabs, Icons } from '_components/custom';
import { FormikValues } from 'formik';
import { AgencyModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/';
import { useEffect, useState } from 'react';
import { useGlobalLoader } from '_context/loaderContext';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { useUserContext } from '_context/user-context';
import { useAuthContext } from '_context/auth-context';
import { UserRole } from '../../../../types/enum';
import { usePermissions } from '../../../hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { AgencyProfile } from './AgencyProfile';
import { LegalInformations } from './LegalInformations';
import { AgencyRegistration } from './AgencyRegistration';
import { AgencyDanger } from './AgencyDanger';
import { AgencyFacturation } from './AgencyFacturation';

/**
 * Page Agence en vue divisée : les sections à gauche (onglets verticaux), la section choisie à
 * droite. Sur petit écran, les onglets passent en haut.
 */
export const AgencyInfo = () => {
  const { user } = useUserContext();
  const { hideLoader } = useGlobalLoader();
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === UserRole.OWNER;
  // Profil public de l'agence : owner, ou staff avec la permission (le backend la vérifie aussi)
  const canEdit = usePermissions().hasPermission(AppPermissions.AGENCY.UPDATE);

  const [initialAgencyValues, setInitialAgencyValues] = useState<MODELS.IAgency>(
    {} as MODELS.IAgency,
  );
  const agencyId = user?.agencyId;
  const userId = user?.ownerId ?? user?.staffId;

  const {
    data: agency,
    isLoading: loadInfo,
    refetch: refetchAgencyInfo,
  } = AgencyModule.getAgencyInfo({
    params: {
      agencyId: agencyId!,
    },
    queryOptions: {
      enabled: !!agencyId && !!userId,
    },
  });

  const { mutateAsync: updateAgency } = AgencyModule.updateAgencyMutation({
    mutationOptions: {
      onSuccess: async () => {
        hideLoader();
        await refetchAgencyInfo();
      },
    },
  });

  const handleUpdateAgency = async (values: FormikValues) => {
    const formData = new FormData();
    // N'envoie que les champs renseignés (évite d'enregistrer la chaîne "undefined")
    (['name', 'description', 'address', 'phone'] as const).forEach((field) => {
      if (values?.[field] !== undefined && values?.[field] !== null) {
        formData.append(field, String(values[field]));
      }
    });
    formData.append('agencyId', String(agency?.id));
    // Logo : seulement un nouveau fichier (l'URL enregistrée reste telle quelle)
    if (values?.agencyLogo instanceof File) {
      formData.append('agencyLogo', values.agencyLogo);
    }
    await updateAgency({ payload: formData as MODELS.IUpdateAgency });
  };

  const handleOpenDoc = (url: string) => {
    setSelectedDoc(url);
    setIsOpen(true);
  };

  const getFileNameFromUrl = (url: string) => {
    try {
      return url.split('/').pop()?.split('?')[0];
    } catch {
      return 'document';
    }
  };

  useEffect(() => {
    if (agency) {
      setInitialAgencyValues(agency);
    }
  }, [agency]);

  const isPending = agency?.status === ENUM.COMMON.Status.PENDING;
  const legalMissing = agency?.legalMissing?.length ?? 0;
  const documents = agency?.documents ?? [];

  return (
    <>
      <BaseTabs
        title="Agence"
        description="Gérez votre agence section par section : profil, informations légales, documents."
        variant="line"
        width="full"
        items={[
          {
            label: 'Profil public',
            icon: <Icons.Office aria-hidden />,
            content: (
              <AgencyProfile
                canEdit={canEdit}
                initialAgencyValues={initialAgencyValues}
                handleUpdateAgency={handleUpdateAgency}
                agency={agency}
                loadInfo={loadInfo}
                isPending={isPending}
              />
            ),
          },
          {
            label: 'Informations',
            icon: <Icons.Shield aria-hidden />,
            totalItems: legalMissing,
            totalItemsLabelColor: legalMissing > 0 ? 'warning' : 'success',
            totalItemsLabelTitle: legalMissing > 0 ? `${legalMissing}` : 'Verifiée',
            content: (
              <LegalInformations
                agency={agency}
                isOwner={isOwner}
                refetchAgencyInfo={refetchAgencyInfo}
              />
            ),
          },

          ...(isOwner
            ? [
                {
                  label: 'Facturation',
                  icon: <Icons.Payment aria-hidden />,
                  content: <AgencyFacturation agency={agency} onSaved={refetchAgencyInfo} />,
                },
              ]
            : []),
          {
            label: 'Documents',
            icon: <Icons.Paper aria-hidden />,
            content: (
              <AgencyRegistration
                documents={documents}
                handleOpenDoc={handleOpenDoc}
                getFileNameFromUrl={getFileNameFromUrl}
              />
            ),
          },
          ...(isOwner
            ? [
                {
                  label: 'Zone sensible',
                  icon: <Icons.Warn aria-hidden />,
                  content: <AgencyDanger />,
                },
              ]
            : []),
        ]}
      />
      <DocumentPreviewModal onChange={setIsOpen} isOpen={isOpen} data={selectedDoc} />
    </>
  );
};
