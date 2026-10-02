'use client';

import { Field, Flex, HStack, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import {
  BaseButton,
  BaseContainer,
  BaseModal,
  BaseText,
  Icons,
  ModalOpenProps,
  TextVariant,
  CustomSkeletonLoader,
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
  const [vatRate, setVatRate] = useState(String(settings.vatRate));
  const [prefix, setPrefix] = useState(settings.invoicePrefix);
  const { mutate: save, isPending } = AgencyModule.updateInvoiceSettingsMutation({
    mutationOptions: { onSuccess: onSaved },
  });
  const vat = Number(vatRate.replace(',', '.'));
  const vatValid = vatRate.trim() !== '' && vat >= 0 && vat <= 100;
  const prefixValid = /^[A-Za-z0-9]{1,8}$/.test(prefix);
  const changed = vat !== settings.vatRate || prefix.toUpperCase() !== settings.invoicePrefix;

  return (
    <Stack gap={4} p={5} rounded="7px" borderWidth="1px" borderColor="border">
      <Stack gap={0}>
        <BaseText fontWeight="semibold">Réglages de facturation</BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          Appliqués aux nouvelles factures ; une facture émise garde ses réglages.
        </BaseText>
      </Stack>
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
        <Field.Root invalid={!vatValid} disabled={!isOwner}>
          <Field.Label>Taux de TVA (%)</Field.Label>
          <Input inputMode="decimal" value={vatRate} onChange={(e) => setVatRate(e.target.value)} />
          <Field.HelperText>0 % : « TVA non applicable » sur la facture.</Field.HelperText>
        </Field.Root>
        <Field.Root invalid={!prefixValid} disabled={!isOwner}>
          <Field.Label>Préfixe des numéros</Field.Label>
          <Input
            value={prefix}
            maxLength={8}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
          />
          <Field.HelperText>
            Ex. {prefix || 'FAC'}-{new Date().getFullYear()}-0001
          </Field.HelperText>
        </Field.Root>
      </SimpleGrid>
      {isOwner && (
        <HStack justifyContent="flex-end">
          <BaseButton
            colorType="primary"
            isLoading={isPending}
            disabled={!changed || !vatValid || !prefixValid || isPending}
            onClick={() =>
              save({ payload: { vatRate: vat, invoicePrefix: prefix }, params: { agencyId } })
            }
          >
            Enregistrer les réglages
          </BaseButton>
        </HStack>
      )}
    </Stack>
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
    <BaseModal
      isOpen={!!template}
      onChange={((open: boolean) => !open && onClose()) as ModalOpenProps['onChange']}
      title={template ? `Aperçu : ${template.name}` : ''}
      size="lg"
      ignoreFooter
    >
      <InvoicePreviewPane {...preview} />
    </BaseModal>
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
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} aria-busy="true">
          {[0, 1, 2].map((i) => (
            <CustomSkeletonLoader key={i} type="DEFAULT" height="150px" />
          ))}
        </SimpleGrid>
      ) : (
        <Stack gap={6} width="full">
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
