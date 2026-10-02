'use client';

import { Box, Grid, Stack } from '@chakra-ui/react';
import { Formik, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import {
  BaseModal,
  BaseText,
  FormTextInput,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { TEXT_FIELDS } from '_utils/invoice-template';
import { PlanChangeStepper } from '../../../subscription/components/PlanChangeStepper';
import { InvoicePreviewPane } from './InvoicePreviewPane';
import {
  StepBase,
  StepColors,
  StepContent,
  StepLayout,
  StepTexts,
  type TemplateEditorValues,
} from './TemplateEditorSteps';
import { useInvoicePreview } from './useInvoicePreview';

const STEPS = ['Base', 'Mise en page', 'Couleurs', 'Contenu', 'Textes', 'Aperçu'] as const;
const TITLES = [
  'Partez d’un modèle existant',
  'Choisissez la mise en page',
  'Couleurs et logo',
  'Colonnes et blocs affichés',
  'Rédigez vos textes',
  'Vérifiez et nommez le modèle',
] as const;
const TEXTS_STEP = 4;
const LAST_STEP = STEPS.length - 1;

const NAME_SCHEMA = Yup.object({
  name: Yup.string()
    .trim()
    .required('Donnez un nom au modèle.')
    .min(2, 'Donnez un nom au modèle (2 à 60 caractères).')
    .max(60, 'Donnez un nom au modèle (2 à 60 caractères).'),
});

interface TemplateEditorDialogProps {
  agencyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: MODELS.IInvoiceTemplate[];
  /** Modèle modifié ; absent pour un nouveau modèle (étape « Base » en premier) */
  editing?: MODELS.IInvoiceTemplate | null;
  /** L'agence a téléversé un cachet (style « Cachet scanné » disponible) */
  hasStamp: boolean;
  onSaved: (template: MODELS.IInvoiceTemplate) => void;
}

/** Contenu de l'éditeur, dans le formulaire : étapes, aperçu PDF en direct et navigation. */
const EditorBody = ({
  agencyId,
  open,
  onClose,
  templates,
  editing,
  hasStamp,
  saving,
}: {
  agencyId: string;
  open: boolean;
  onClose: () => void;
  templates: MODELS.IInvoiceTemplate[];
  editing?: MODELS.IInvoiceTemplate | null;
  hasStamp: boolean;
  saving: boolean;
}) => {
  const firstStep = editing ? 1 : 0;
  const [step, setStep] = useState(firstStep);
  const { values, handleSubmit, validateForm, setFieldTouched } =
    useFormikContext<TemplateEditorValues>();
  const { data: catalogue } = AgencyModule.getInvoiceTemplateVariablesQueries({
    queryOptions: { enabled: open },
  });
  const preview = useInvoicePreview(agencyId, values.config, open && !!values.config);

  // Textes : une variable inconnue bloque l'étape (erreur affichée sous le champ)
  const next = async () => {
    if (step === TEXTS_STEP) {
      const errors = (await validateForm()) as { config?: { texts?: object } };
      if (errors.config?.texts) {
        TEXT_FIELDS.forEach((field) => setFieldTouched(`config.texts.${field.key}`, true, false));
        return;
      }
    }
    if (step === LAST_STEP) handleSubmit();
    else setStep(step + 1);
  };

  const content = () => {
    if (step === 0) return <StepBase templates={templates} />;
    if (!values.config) return null;
    if (step === 1) return <StepLayout />;
    if (step === 2) return <StepColors />;
    if (step === 3) return <StepContent hasStamp={hasStamp} />;
    if (step === TEXTS_STEP) return <StepTexts catalogue={catalogue} />;
    return (
      <Stack gap={5}>
        <FormTextInput
          required
          name="name"
          label="Nom du modèle"
          maxLength={60}
          infoMessage={
            editing?.isDefault
              ? 'Le modèle commun reste inchangé : une copie à ce nom est créée pour votre agence.'
              : undefined
          }
        />
        <Box display={{ lg: 'none' }}>
          <InvoicePreviewPane {...preview} />
        </Box>
      </Stack>
    );
  };

  return (
    <BaseModal
      isOpen={open}
      onChange={((o: boolean) => !o && !saving && onClose()) as ModalOpenProps['onChange']}
      size="full"
      title={TITLES[step]}
      description={`${editing ? 'Modifier le modèle' : 'Nouveau modèle'} · étape ${step - firstStep + 1} sur ${STEPS.length - firstStep}`}
      icon={<Icons.Edit />}
      buttonCancelTitle="Annuler"
      colorCancelButton="neutral"
      buttonRejectTitle={step > firstStep ? 'Retour' : ''}
      colorRejectButton="neutral"
      onReject={() => setStep(step - 1)}
      buttonSaveTitle={step === LAST_STEP ? 'Enregistrer le modèle' : 'Continuer'}
      saveDisabled={step === 0 && !values.config}
      isLoading={saving}
      onClick={next}
    >
      <Stack width="full" maxW="80rem" mx="auto" gap={6}>
        <PlanChangeStepper current={step - firstStep} steps={STEPS.slice(firstStep)} />
        <Grid
          gap={{ base: 6, lg: 10 }}
          templateColumns={{ base: '1fr', lg: values.config ? 'minmax(0, 1fr) 420px' : '1fr' }}
          alignItems="start"
        >
          <Stack gap={5} minW={0}>
            {step === 0 && (
              <BaseText variant={TextVariant.S} color="fg.muted">
                Sa mise en page, ses couleurs et ses textes servent de point de départ.
              </BaseText>
            )}
            {content()}
          </Stack>
          {values.config && (
            <Box display={{ base: 'none', lg: 'block' }} position="sticky" top={0}>
              <InvoicePreviewPane {...preview} />
            </Box>
          )}
        </Grid>
      </Stack>
    </BaseModal>
  );
};

/**
 * Éditeur guidé d'un modèle de facture, plein écran. Nouveau modèle : Base → Mise en page →
 * Couleurs → Contenu → Textes → Aperçu. Modification : sans l'étape Base. Sur grand écran,
 * l'aperçu PDF (rendu par le backend) accompagne chaque étape.
 */
export const TemplateEditorDialog = ({
  agencyId,
  open,
  onOpenChange,
  templates,
  editing,
  hasStamp,
  onSaved,
}: TemplateEditorDialogProps) => {
  // Formulaire remonté à chaque ouverture : il repart du modèle édité (ou de rien)
  const [session, setSession] = useState(0);
  useEffect(() => {
    if (open) setSession((s) => s + 1);
  }, [open, editing]);

  const { mutate: save, isPending: saving } = AgencyModule.saveInvoiceTemplateMutation({
    mutationOptions: {
      onSuccess: (template) => {
        onOpenChange(false);
        onSaved(template);
      },
    },
  });

  return (
    <Formik<TemplateEditorValues>
      key={session}
      initialValues={{
        config: editing ? structuredClone(editing.config) : null,
        name: editing ? (editing.isDefault ? `${editing.name} (personnalisé)` : editing.name) : '',
      }}
      validationSchema={NAME_SCHEMA}
      onSubmit={({ name, config }) => {
        if (config) {
          save({ payload: { name: name.trim(), config }, params: { agencyId, id: editing?.id } });
        }
      }}
    >
      <EditorBody
        agencyId={agencyId}
        open={open}
        onClose={() => onOpenChange(false)}
        templates={templates}
        editing={editing}
        hasStamp={hasStamp}
        saving={saving}
      />
    </Formik>
  );
};
