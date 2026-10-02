'use client';

import { Flex, HStack, SimpleGrid, Stack, VStack } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import {
  BaseButton,
  BaseContainer,
  BaseModal,
  BaseText,
  Icons,
  ModalOpenProps,
  TextVariant,
  CustomSkeletonLoader,
  FormTextInput,
  BaseDrawer,
} from '_components/custom';
import { useAuthContext } from '_context/auth-context';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { UserRole } from '../../../../../types/enum';
import { InvoicePreviewPane } from './InvoicePreviewPane';
import { StampSection } from './StampSection';
import { TemplateCard } from './TemplateCard';
import { TemplateEditorDialog } from './TemplateEditorDialog';
import { useInvoicePreview } from './useInvoicePreview';
import { useFeatureGuard } from '../../../../hooks/useFeatureGuard';

type Template = MODELS.IInvoiceTemplate;

const SETTINGS_SCHEMA = Yup.object({
  vatRate: Yup.number()
    .transform((_, raw) => (raw === '' ? NaN : Number(String(raw).replace(',', '.'))))
    .typeError('Indiquez un taux entre 0 et 100.')
    .min(0, 'Indiquez un taux entre 0 et 100.')
    .max(100, 'Indiquez un taux entre 0 et 100.'),
  invoicePrefix: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9]{1,8}$/, '1 à 8 lettres ou chiffres, sans espace.'),
});

/** Réglages de facturation : TVA et préfixe des numéros (owner ; lecture seule pour le staff). */
const InvoiceSettingsCard = ({
  agencyId,
  settings,
  isOwner,
  onSaved,
}: {
  agencyId: string;
  settings: MODELS.IInvoiceSettings;
  isOwner: boolean;
  onSaved: () => void;
}) => {
  const { mutate: save, isPending } = AgencyModule.updateInvoiceSettingsMutation({
    mutationOptions: { onSuccess: onSaved },
  });

  return (
    <Formik
      initialValues={{ vatRate: String(settings.vatRate), invoicePrefix: settings.invoicePrefix }}
      validationSchema={SETTINGS_SCHEMA}
      enableReinitialize
      onSubmit={({ vatRate, invoicePrefix }) =>
        save({
          payload: {
            vatRate: Number(vatRate.replace(',', '.')),
            invoicePrefix: invoicePrefix.trim().toUpperCase(),
          },
          params: { agencyId },
        })
      }
    >
      {({ values, dirty, handleSubmit }) => (
        <Stack gap={4} p={5} rounded="7px" borderWidth="1px" borderColor="border">
          <Stack gap={0}>
            <BaseText fontWeight="semibold">Réglages de facturation</BaseText>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Appliqués aux nouvelles factures ; une facture émise garde ses réglages.
            </BaseText>
          </Stack>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
            <FormTextInput
              name="vatRate"
              label="Taux de TVA (%)"
              inputMode="decimal"
              isDisabled={!isOwner}
              infoMessage="0 % : « TVA non applicable » sur la facture."
            />
            <FormTextInput
              name="invoicePrefix"
              label="Préfixe des numéros"
              maxLength={8}
              textTransform="uppercase"
              isDisabled={!isOwner}
              infoMessage={`Ex. ${values.invoicePrefix.toUpperCase() || 'FAC'}-${new Date().getFullYear()}-0001`}
            />
          </SimpleGrid>
          {isOwner && (
            <HStack justifyContent="flex-end">
              <BaseButton
                colorType="primary"
                isLoading={isPending}
                disabled={!dirty || isPending}
                onClick={() => handleSubmit()}
              >
                Enregistrer les réglages
              </BaseButton>
            </HStack>
          )}
        </Stack>
      )}
    </Formik>
  );
};

/** Aperçu d'un modèle enregistré, dans un pop-up. */
const PreviewModal = ({
  agencyId,
  template,
  onClose,
}: {
  agencyId: string;
  template: Template | null;
  onClose: () => void;
}) => {
  const preview = useInvoicePreview(agencyId, template?.config ?? null, !!template);
  return (
    <BaseDrawer
      isFullHeight
      size="xl"
      icon={<Icons.View />}
      isOpen={!!template}
      onChange={((open: boolean) => !open && onClose()) as ModalOpenProps['onChange']}
      title={template ? `Aperçu : ${template.name}` : ''}
      ignoreFooter
      closeOnInteractOutside={false}
    >
      <InvoicePreviewPane {...preview} />
    </BaseDrawer>
  );
};

/**
 * « Modèles de facture » : les 3 modèles communs et ceux de l'agence, le modèle proposé par
 * défaut, les réglages de facturation et l'éditeur guidé. Gestion réservée à l'owner.
 */
export const InvoiceTemplatesPage = () => {
  const { user } = useUserContext();
  const { user: authUser } = useAuthContext();
  const isOwner = authUser?.role === UserRole.OWNER;
  const { guard, limitModal } = useFeatureGuard('invoice_templates');
  const agencyId = user?.agencyId ?? '';
  const [editor, setEditor] = useState<{ open: boolean; editing: Template | null }>({
    open: false,
    editing: null,
  });
  const [previewed, setPreviewed] = useState<Template | null>(null);
  const [toDelete, setToDelete] = useState<Template | null>(null);

  const { data, isLoading, refetch } = AgencyModule.getInvoiceTemplatesQueries({
    params: { agencyId },
    queryOptions: { enabled: !!agencyId },
  });
  const { mutate: updateSettings } = AgencyModule.updateInvoiceSettingsMutation({
    mutationOptions: { onSuccess: () => refetch() },
  });
  const { mutate: remove, isPending: removing } = AgencyModule.deleteInvoiceTemplateMutation({
    mutationOptions: {
      onSuccess: () => {
        setToDelete(null);
        refetch();
      },
    },
  });

  return (
    <BaseContainer
      title="Modèles de facture"
      description="Choisissez la présentation de vos factures : partez d’un des trois modèles proposés, personnalisez-le ou créez le vôtre."
      border="none"
      gap={6}
    >
      {isLoading || !data ? (
        <VStack
          gap={3}
          mt={'30px'}
          width="full"
          alignItems="flex-start"
          flexDirection={{ base: 'row', sm: 'column' }}
        >
          {[0, 1, 2].map((i) => (
            <CustomSkeletonLoader key={i} type="FORM" width="100%" height="150px" />
          ))}
        </VStack>
      ) : (
        <Stack gap={6} width="full" mt="30px">
          <InvoiceSettingsCard
            key={`${data.settings.vatRate}-${data.settings.invoicePrefix}`}
            agencyId={agencyId}
            settings={data.settings}
            isOwner={isOwner}
            onSaved={() => refetch()}
          />
          <StampSection
            agencyId={agencyId}
            stampUrl={data.settings.stampUrl}
            isOwner={isOwner}
            onChanged={() => refetch()}
          />
          <Flex justifyContent="space-between" alignItems="center" gap={3} wrap="wrap">
            <BaseText fontWeight="semibold">Modèles</BaseText>
            {isOwner && (
              <BaseButton
                colorType="primary"
                onClick={() => guard(() => setEditor({ open: true, editing: null }))}
              >
                Nouveau modèle
              </BaseButton>
            )}
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
            {data.templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isDefaultChoice={template.id === data.settings.defaultTemplateId}
                isOwner={isOwner}
                onPreview={() => setPreviewed(template)}
                // Personnaliser un modèle commun crée une copie : elle compte dans le quota
                onEdit={() =>
                  template.isDefault
                    ? guard(() => setEditor({ open: true, editing: template }))
                    : setEditor({ open: true, editing: template })
                }
                onMakeDefault={() =>
                  updateSettings({
                    payload: { defaultTemplateId: template.id },
                    params: { agencyId },
                  })
                }
                onDelete={() => setToDelete(template)}
              />
            ))}
          </SimpleGrid>
          <TemplateEditorDialog
            agencyId={agencyId}
            open={editor.open}
            onOpenChange={(open) => setEditor((e) => ({ ...e, open }))}
            templates={data.templates}
            editing={editor.editing}
            hasStamp={!!data.settings.stampUrl}
            onSaved={() => refetch()}
          />
        </Stack>
      )}
      {limitModal}
      <PreviewModal agencyId={agencyId} template={previewed} onClose={() => setPreviewed(null)} />
      <BaseModal
        isOpen={!!toDelete}
        onChange={((open: boolean) => !open && setToDelete(null)) as ModalOpenProps['onChange']}
        title="Supprimer ce modèle ?"
        icon={<Icons.Trash />}
        modalType="alertdialog"
        size="sm"
        buttonCancelTitle="Annuler"
        buttonSaveTitle="Supprimer"
        isLoading={removing}
        onClick={() => toDelete && remove({ params: { agencyId, id: toDelete.id } })}
      >
        <BaseText variant={TextVariant.S}>
          « {toDelete?.name} » sera supprimé. Les factures déjà émises avec ce modèle ne changent
          pas. S’il était votre modèle par défaut, le modèle Classique le remplace.
        </BaseText>
      </BaseModal>
    </BaseContainer>
  );
};
