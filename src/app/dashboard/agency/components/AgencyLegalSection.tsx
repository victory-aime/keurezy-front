'use client';

import { createListCollection, HStack, SimpleGrid, Stack } from '@chakra-ui/react';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  BaseButton,
  BaseModal,
  BaseText,
  FormSelect,
  FormTextInput,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { MODELS, VALIDATION } from '_types/*';
import { changesIdentity, LEGAL_FIELD_LABELS, LEGAL_FORMS, toPayload } from '_utils/agency-legal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { LegalProofsGrid } from './LegalProofCard';
import { Panel } from './Panel';
import { VerificationNote } from './VerificationNote';
import { ReadOnlyValue } from './ReadOnlyValue';

type Legal = MODELS.IAgencyLegal;

/**
 * Informations légales de l'agence (factures, vérification), jamais publiques. L'owner les
 * modifie ; le staff les consulte. Changer l'identité d'une agence vérifiée retire la
 * vérification : l'owner le confirme avant d'enregistrer.
 */
export const AgencyLegalSection = ({
  agency,
  isOwner,
  onSaved,
}: {
  agency: MODELS.IAgency;
  isOwner: boolean;
  onSaved: () => void;
}) => {
  const [pending, setPending] = useState<Partial<Legal> | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutateAsync: save, isPending: saving } = AgencyModule.updateAgencyLegalMutation({
    mutationOptions: {
      onSuccess: () => {
        setPending(null);
        onSaved();
      },
    },
  });

  const legalFormList = createListCollection({ items: LEGAL_FORMS });

  const initialValues = {
    companyName: agency.companyName ?? '',
    legalForm: agency.legalForm ? [agency.legalForm] : ([] as string[]),
    ninea: agency.ninea ?? '',
    rccm: agency.rccm ?? '',
  };

  const closeConfirm = ((open: boolean) => {
    if (!open) setPending(null);
  }) as ModalOpenProps['onChange'];

  const submit = (values: typeof initialValues) => {
    const payload = toPayload(values);
    if (agency.isVerified && changesIdentity(agency, payload)) setPending(payload);
    else save({ payload, params: { agencyId: agency.id } });
  };

  const documents = (
    <Panel
      title="Documents justificatifs"
      description={
        isOwner
          ? 'Un document officiel par information, contrôlé lors de la vérification. Chaque document est enregistré dès son envoi.'
          : 'Documents officiels fournis par le propriétaire.'
      }
    >
      <LegalProofsGrid agency={agency} isOwner={isOwner} onPreview={setPreview} onSaved={onSaved} />
    </Panel>
  );

  return (
    <React.Fragment>
      <Stack gap={4} width="full">
        <VerificationNote agency={agency} />

        {/* Documents : enregistrés dès leur envoi, indépendamment du formulaire */}
        {isOwner ? (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={VALIDATION.AGENCY_VALIDATION.agencyLegalInfoValidations}
            onSubmit={submit}
          >
            {({ handleSubmit, setFieldValue }) => (
              <Stack gap={5} width="full">
                <Panel title="Identité de l’entreprise">
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <FormTextInput name="companyName" label="Raison sociale" />
                    <FormSelect
                      name="legalForm"
                      label="Forme juridique"
                      listItems={legalFormList}
                      setFieldValue={setFieldValue}
                      isClearable={false}
                    />
                    <FormTextInput name="ninea" label="NINEA" placeholder="0012345 2G3" />
                    <FormTextInput name="rccm" label="RCCM" placeholder="SN-DKR-2020-B-12345" />
                  </SimpleGrid>
                </Panel>
                {documents}
                <HStack justifyContent="flex-end">
                  <BaseButton
                    isLoading={saving && !pending}
                    disabled={saving}
                    onClick={() => handleSubmit()}
                  >
                    Enregistrer les informations légales
                  </BaseButton>
                </HStack>
              </Stack>
            )}
          </Formik>
        ) : (
          <Stack gap={5} width="full">
            <Panel title="Identité de l’entreprise">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <ReadOnlyValue label={LEGAL_FIELD_LABELS.companyName} value={agency.companyName} />
                <ReadOnlyValue
                  label={LEGAL_FIELD_LABELS.legalForm}
                  value={LEGAL_FORMS.find((f) => f.value === agency.legalForm)?.label}
                />
                <ReadOnlyValue label={LEGAL_FIELD_LABELS.ninea} value={agency.ninea} />
                <ReadOnlyValue label={LEGAL_FIELD_LABELS.rccm} value={agency.rccm} />
              </SimpleGrid>
            </Panel>
            {documents}
          </Stack>
        )}
      </Stack>
      <BaseModal
        isOpen={!!pending}
        onChange={closeConfirm}
        title="Modifier l’identité de l’agence"
        icon={<Icons.Warn />}
        iconBackgroundColor="warning.solid"
        size="md"
        buttonCancelTitle="Annuler"
        buttonSaveTitle="Enregistrer et retirer la vérification"
        colorSaveButton="danger"
        isLoading={saving}
        onClick={() => pending && save({ payload: pending, params: { agencyId: agency.id } })}
      >
        <BaseText variant={TextVariant.S}>
          Vous modifiez la raison sociale, le NINEA ou le RCCM. Votre agence perdra son badge «
          vérifiée » jusqu’à ce que Keurezy vérifie les nouvelles informations.
        </BaseText>
      </BaseModal>
      <DocumentPreviewModal
        isOpen={!!preview}
        onChange={((open: boolean) => !open && setPreview(null)) as ModalOpenProps['onChange']}
        data={preview}
      />
    </React.Fragment>
  );
};
