'use client';

import { Box, Field, Flex, Grid, Heading, Input, Stack } from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BaseButton, BaseText, TextVariant } from '_components/custom';
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '_components/ui/dialog';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { unknownVariables } from '_utils/invoice-template';
import { PlanChangeStepper } from '../../../subscription/components/PlanChangeStepper';
import { InvoicePreviewPane } from './InvoicePreviewPane';
import { StepBase, StepColors, StepContent, StepLayout, StepTexts } from './TemplateEditorSteps';
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
const HEX = /^#[0-9a-fA-F]{6}$/;

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
  const firstStep = editing ? 1 : 0;
  const [step, setStep] = useState(firstStep);
  const [baseId, setBaseId] = useState<string | null>(null);
  const [config, setConfig] = useState<MODELS.IInvoiceTemplateConfig | null>(null);
  const [name, setName] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { data: catalogue } = AgencyModule.getInvoiceTemplateVariablesQueries({
    queryOptions: { enabled: open },
  });
  const preview = useInvoicePreview(agencyId, config, open && !!config);

  useEffect(() => {
    if (!open) return;
    setStep(editing ? 1 : 0);
    setBaseId(editing?.id ?? null);
    setConfig(editing ? structuredClone(editing.config) : null);
    setName(editing ? (editing.isDefault ? `${editing.name} (personnalisé)` : editing.name) : '');
  }, [open, editing]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const { mutate: save, isPending: saving } = AgencyModule.saveInvoiceTemplateMutation({
    mutationOptions: {
      onSuccess: (template) => {
        onOpenChange(false);
        onSaved(template);
      },
    },
  });

  const change = (patch: Partial<MODELS.IInvoiceTemplateConfig>) =>
    setConfig((current) => (current ? { ...current, ...patch } : current));

  const textErrors = useMemo(
    () =>
      config && catalogue
        ? Object.values(config.texts).some((text) => unknownVariables(text, catalogue).length > 0)
        : false,
    [config, catalogue],
  );
  const colorsValid = !!config && HEX.test(config.primaryColor) && HEX.test(config.accentColor);
  const nameValid = name.trim().length >= 2 && name.trim().length <= 60;

  const blockedReason =
    step === 0 && !config
      ? 'Choisissez un modèle de départ.'
      : step === 2 && !colorsValid
        ? 'Couleurs au format #RRGGBB.'
        : step === 4 && textErrors
          ? 'Corrigez les variables inconnues.'
          : step === 5 && !nameValid
            ? 'Donnez un nom au modèle (2 à 60 caractères).'
            : '';

  const submit = () => {
    if (!config || blockedReason) return;
    save({
      payload: { name: name.trim(), config },
      params: { agencyId, id: editing?.id },
    });
  };

  const content = () => {
    if (step === 0) {
      return (
        <StepBase
          templates={templates}
          baseId={baseId}
          onSelect={(template) => {
            setBaseId(template.id);
            setConfig(structuredClone(template.config));
            setName(`${template.name} (copie)`);
          }}
        />
      );
    }
    if (!config) return null;
    if (step === 1) return <StepLayout config={config} onChange={change} />;
    if (step === 2) return <StepColors config={config} onChange={change} />;
    if (step === 3) return <StepContent config={config} onChange={change} hasStamp={hasStamp} />;
    if (step === 4) return <StepTexts config={config} onChange={change} catalogue={catalogue} />;
    return (
      <Stack gap={5}>
        <Field.Root required invalid={!nameValid && name.length > 0}>
          <Field.Label>Nom du modèle</Field.Label>
          <Input value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
          {editing?.isDefault && (
            <Field.HelperText>
              Le modèle commun reste inchangé : une copie à ce nom est créée pour votre agence.
            </Field.HelperText>
          )}
        </Field.Root>
        <Box display={{ lg: 'none' }}>
          <InvoicePreviewPane {...preview} />
        </Box>
      </Stack>
    );
  };

  return (
    <DialogRoot
      open={open}
      onOpenChange={(e) => !saving && onOpenChange(e.open)}
      size="full"
      initialFocusEl={() => headingRef.current}
      lazyMount
      unmountOnExit
    >
      <DialogContent rounded="none" bg="bg">
        <DialogHeader borderBottomWidth="1px" borderColor="border" py={4}>
          <Box width="full" maxW="80rem" mx="auto" pr={10}>
            <PlanChangeStepper current={step - firstStep} steps={STEPS.slice(firstStep)} />
          </Box>
          <DialogCloseTrigger disabled={saving} top="4" insetEnd="4" aria-label="Fermer" />
        </DialogHeader>

        <DialogBody py={{ base: 6, md: 8 }}>
          <Grid
            width="full"
            maxW="80rem"
            mx="auto"
            gap={{ base: 6, lg: 10 }}
            templateColumns={{ base: '1fr', lg: config ? 'minmax(0, 1fr) 420px' : '1fr' }}
            alignItems="start"
          >
            <Stack gap={5} minW={0}>
              <Stack gap={1}>
                <BaseText variant={TextVariant.XS} color="fg.muted">
                  {editing ? 'Modifier le modèle' : 'Nouveau modèle'} · étape {step - firstStep + 1}{' '}
                  sur {STEPS.length - firstStep}
                </BaseText>
                <DialogTitle asChild>
                  <Heading
                    as="h2"
                    ref={headingRef}
                    tabIndex={-1}
                    size={{ base: 'lg', md: 'xl' }}
                    fontWeight="semibold"
                    outline="none"
                  >
                    {TITLES[step]}
                  </Heading>
                </DialogTitle>
              </Stack>
              {content()}
            </Stack>
            {config && (
              <Box display={{ base: 'none', lg: 'block' }} position="sticky" top={0}>
                <InvoicePreviewPane {...preview} />
              </Box>
            )}
          </Grid>
        </DialogBody>

        <DialogFooter borderTopWidth="1px" borderColor="border" bg="bg" py={3}>
          <Flex
            width="full"
            maxW="80rem"
            mx="auto"
            gap={3}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              {step > firstStep && (
                <BaseButton
                  variant="outline"
                  colorType="neutral"
                  disabled={saving}
                  onClick={() => setStep(step - 1)}
                >
                  Retour
                </BaseButton>
              )}
            </Box>
            <Flex alignItems="center" gap={3} minW={0}>
              <BaseText
                role="status"
                aria-live="polite"
                variant={TextVariant.XS}
                color="fg.muted"
                display={{ base: 'none', md: 'block' }}
              >
                {blockedReason}
              </BaseText>
              {step < STEPS.length - 1 ? (
                <BaseButton
                  colorType="primary"
                  disabled={!!blockedReason}
                  onClick={() => setStep(step + 1)}
                >
                  Continuer
                </BaseButton>
              ) : (
                <BaseButton
                  colorType="primary"
                  isLoading={saving}
                  disabled={!!blockedReason || saving}
                  onClick={submit}
                >
                  Enregistrer le modèle
                </BaseButton>
              )}
            </Flex>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
