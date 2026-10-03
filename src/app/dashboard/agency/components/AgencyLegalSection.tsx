'use client';

import {
  Box,
  createListCollection,
  Flex,
  HStack,
  Separator,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { useState } from 'react';
import * as yup from 'yup';
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
import { MODELS } from '_types/*';
import {
  changesIdentity,
  BANK_FIELD_LABELS,
  LEGAL_FIELD_LABELS,
  LEGAL_FORMS,
  LEGAL_PROOFS,
  missingLabel,
  verificationState,
} from '_utils/agency-legal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { LegalProofsGrid } from './LegalProofCard';
import { ProfileForm } from '../../profile/components/ProfileForm';

type Legal = MODELS.IAgencyLegal;

const legalFormList = createListCollection({ items: LEGAL_FORMS });

/** Mêmes formats que le backend (qui revalide) ; tous facultatifs à l'enregistrement. */
const schema = yup.object({
  companyName: yup.string().trim().min(2, '2 caractères minimum').max(150),
  ninea: yup
    .string()
    .transform((v) => v?.replace(/\s+/g, '').toUpperCase())
    .matches(/^[0-9A-Z]{7,14}$/, {
      message: '7 à 14 chiffres ou lettres',
      excludeEmptyString: true,
    }),
  rccm: yup
    .string()
    .transform((v) => v?.replace(/\s+/g, '').toUpperCase())
    .matches(/^[0-9A-Z][0-9A-Z./-]{5,39}$/, {
      message: 'Format attendu : SN-DKR-2020-B-12345',
      excludeEmptyString: true,
    }),
  billingAddress: yup.string().trim().min(5, '5 caractères minimum').max(255),
  billingEmail: yup.string().trim().email('E-mail invalide'),
  bankName: yup.string().trim().min(2, '2 caractères minimum').max(100),
  bankAccount: yup
    .string()
    .trim()
    .matches(/^[0-9A-Za-z ]{10,40}$/, {
      message: '10 à 40 chiffres ou lettres',
      excludeEmptyString: true,
    }),
  mobileMoneyNumber: yup
    .string()
    .trim()
    .matches(/^\+?[0-9 ]{8,20}$/, { message: 'Numéro invalide', excludeEmptyString: true }),
});

/** Note de vérification : ce qui manque (informations, puis documents), l'attente, ou le badge. */
const VerificationNote = ({ agency }: { agency: MODELS.IAgency }) => {
  const state = verificationState(agency);
  const palette = { VERIFIED: 'success', PENDING: 'info', INCOMPLETE: 'warning' }[state];
  const missing = (agency.legalMissing ?? []) as string[];
  const isProof = (key: string) => LEGAL_PROOFS.some((proof) => proof.field === key);
  const fields = missing.filter((key) => !isProof(key)).map(missingLabel);
  const documents = missing.filter(isProof).map(missingLabel);
  return (
    <Box
      role="status"
      width="full"
      p={3}
      rounded="lg"
      borderLeftWidth="4px"
      borderColor={`${palette}.solid`}
      bg={`${palette}.subtle`}
      animationName="fade-in"
      animationDuration="moderate"
      _motionReduce={{ animation: 'none' }}
    >
      <Flex alignItems="center" gap={2} color={`${palette}.fg`}>
        {state === 'VERIFIED' ? <Icons.Shield aria-hidden /> : <Icons.InfoIcon aria-hidden />}
        <BaseText fontWeight="semibold" color="inherit">
          {state === 'VERIFIED'
            ? 'Agence vérifiée'
            : state === 'PENDING'
              ? 'Vos informations sont complètes : la vérification est en cours'
              : 'Complétez vos informations légales et joignez les documents pour que votre agence puisse être vérifiée'}
        </BaseText>
      </Flex>
      {state === 'INCOMPLETE' && (
        <Stack gap={0} mt={1} pl={6}>
          {fields.length > 0 && (
            <BaseText variant={TextVariant.S}>À renseigner : {fields.join(', ')}.</BaseText>
          )}
          {documents.length > 0 && (
            <BaseText variant={TextVariant.S}>À joindre : {documents.join(', ')}.</BaseText>
          )}
        </Stack>
      )}
      {state === 'VERIFIED' && (
        <BaseText variant={TextVariant.S} mt={1} pl={6}>
          Le badge est visible par les clients. Modifier la raison sociale, le NINEA, le RCCM ou un
          document justificatif le retire jusqu’à une nouvelle vérification.
        </BaseText>
      )}
    </Box>
  );
};

/** Bloc titré de la section : identité, documents, facturation, paiement. */
const Block = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Stack gap={3} width="full">
    <Separator />
    <Stack gap={0}>
      <BaseText fontWeight="semibold">{title}</BaseText>
      {description && (
        <BaseText variant={TextVariant.S} color="fg.muted">
          {description}
        </BaseText>
      )}
    </Stack>
    {children}
  </Stack>
);

/** Lecture seule (staff) : libellé et valeur. */
const ReadOnlyValue = ({ label, value }: { label: string; value?: string | null }) => (
  <Stack gap={0}>
    <BaseText variant={TextVariant.XS} color="fg.muted">
      {label}
    </BaseText>
    <BaseText variant={TextVariant.S}>{value || 'Non renseigné'}</BaseText>
  </Stack>
);

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

  // Adresse et e-mail de facturation : ceux de l'agence par défaut
  const initialValues = {
    companyName: agency.companyName ?? '',
    // Le select renvoie un tableau de valeurs
    legalForm: agency.legalForm ? [agency.legalForm] : ([] as string[]),
    ninea: agency.ninea ?? '',
    rccm: agency.rccm ?? '',
    billingAddress: agency.billingAddress ?? agency.address ?? '',
    billingEmail: agency.billingEmail ?? agency.email ?? '',
    bankName: agency.bankName ?? '',
    bankAccount: agency.bankAccount ?? '',
    mobileMoneyNumber: agency.mobileMoneyNumber ?? '',
  };

  // Seuls les champs remplis partent (un champ vide n'efface rien côté serveur)
  const toPayload = ({ legalForm, ...values }: typeof initialValues): Partial<Legal> => ({
    ...(Object.fromEntries(
      Object.entries(values).filter(([, v]) => v.trim() !== ''),
    ) as Partial<Legal>),
    ...(legalForm[0] && { legalForm: legalForm[0] as MODELS.LegalForm }),
  });

  const closeConfirm = ((open: boolean) => {
    if (!open) setPending(null);
  }) as ModalOpenProps['onChange'];

  const submit = (values: typeof initialValues) => {
    const payload = toPayload(values);
    if (agency.isVerified && changesIdentity(agency, payload)) setPending(payload);
    else save({ payload, params: { agencyId: agency.id } });
  };

  const documents = (
    <Block
      title="Documents justificatifs"
      description={
        isOwner
          ? 'Un document officiel par information, contrôlé lors de la vérification. Chaque document est enregistré dès son envoi.'
          : 'Documents officiels fournis par le propriétaire.'
      }
    >
      <LegalProofsGrid agency={agency} isOwner={isOwner} onPreview={setPreview} onSaved={onSaved} />
    </Block>
  );

  return (
    <ProfileForm
      title="Informations légales"
      description="Utilisées pour la vérification de votre agence et sur vos factures. Elles ne sont jamais affichées publiquement."
    >
      <Stack gap={4} width="full">
        <VerificationNote agency={agency} />

        {/* Documents : enregistrés dès leur envoi, indépendamment du formulaire */}
        {isOwner ? (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={submit}
          >
            {({ handleSubmit, setFieldValue }) => (
              <Stack gap={5} width="full">
                <Block title="Identité de l’entreprise">
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
                </Block>
                {documents}
                <Block title="Facturation" description="Imprimées sur vos factures.">
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <FormTextInput name="billingAddress" label="Adresse de facturation" />
                    <FormTextInput name="billingEmail" label="E-mail de facturation" type="email" />
                  </SimpleGrid>
                </Block>
                <Block
                  title="Coordonnées de paiement (facultatif)"
                  description="Imprimées sur vos factures quand le modèle affiche ce bloc."
                >
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <FormTextInput name="bankName" label={BANK_FIELD_LABELS.bankName} />
                    <FormTextInput
                      name="bankAccount"
                      label={BANK_FIELD_LABELS.bankAccount}
                      placeholder="SN012 01001 012345678901 85"
                    />
                    <FormTextInput
                      name="mobileMoneyNumber"
                      label={BANK_FIELD_LABELS.mobileMoneyNumber}
                      placeholder="+221 77 000 00 00"
                    />
                  </SimpleGrid>
                </Block>
                <HStack justifyContent="flex-end">
                  <BaseButton
                    colorType="primary"
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
            <Block title="Identité de l’entreprise">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <ReadOnlyValue label={LEGAL_FIELD_LABELS.companyName} value={agency.companyName} />
                <ReadOnlyValue
                  label={LEGAL_FIELD_LABELS.legalForm}
                  value={LEGAL_FORMS.find((f) => f.value === agency.legalForm)?.label}
                />
                <ReadOnlyValue label={LEGAL_FIELD_LABELS.ninea} value={agency.ninea} />
                <ReadOnlyValue label={LEGAL_FIELD_LABELS.rccm} value={agency.rccm} />
              </SimpleGrid>
            </Block>
            {documents}
            <Block title="Facturation">
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                <ReadOnlyValue
                  label={LEGAL_FIELD_LABELS.billingAddress}
                  value={agency.billingAddress}
                />
                <ReadOnlyValue
                  label={LEGAL_FIELD_LABELS.billingEmail}
                  value={agency.billingEmail}
                />
              </SimpleGrid>
            </Block>
            <Block title="Coordonnées de paiement">
              <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                {(Object.keys(BANK_FIELD_LABELS) as (keyof typeof BANK_FIELD_LABELS)[]).map(
                  (field) => (
                    <ReadOnlyValue
                      key={field}
                      label={BANK_FIELD_LABELS[field]}
                      value={agency[field]}
                    />
                  ),
                )}
              </SimpleGrid>
            </Block>
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
    </ProfileForm>
  );
};
