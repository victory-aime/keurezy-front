'use client';

import {
  Box,
  Button,
  Field,
  Flex,
  Grid,
  Input,
  NativeSelect,
  Skeleton,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  BaseBadge,
  BaseButton,
  BaseFormatNumber,
  BaseModal,
  BaseText,
  BaseToast,
  Icons,
  ModalOpenProps,
  TextVariant,
  ToastStatus,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import {
  INVOICE_STATUS,
  invoicePdfUrl,
  isOverdue,
  isoDay,
  PAYMENT_METHODS,
  shortDate,
} from '_utils/invoice';
import { invoiceCancelImpact, invoiceDeleteImpact, invoiceIssueImpact } from '_utils/impact';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';
import { InvoicePreviewPane } from '../templates/components/InvoicePreviewPane';
import { InvoiceSendDialog } from './InvoiceSendDialog';
import { usePdfDocument } from './usePdfDocument';
import { useFeatureGuard } from '../../../hooks/useFeatureGuard';
import { usePermissions } from '../../../hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';

type Action = 'issue' | 'pay' | 'cancel' | 'delete' | 'send';

const Money = ({ value }: { value: number }) => (
  <BaseFormatNumber value={value} currencyCode={ENUM.COMMON.Currency.XOF} />
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Flex justifyContent="space-between" gap={4} alignItems="baseline">
    <BaseText as="dt" variant={TextVariant.S} color="fg.muted" flexShrink={0}>
      {label}
    </BaseText>
    <BaseText as="dd" variant={TextVariant.S} textAlign="end" minW={0}>
      {children}
    </BaseText>
  </Flex>
);

/** Paiement reçu : date (ni future, ni avant l'émission) et moyen. */
const PayDialog = ({
  invoice,
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: {
  invoice: MODELS.IInvoice;
  open: boolean;
  onClose: () => void;
  onConfirm: (body: { paidAt: string; method: MODELS.InvoicePaymentMethod }) => void;
  isSubmitting: boolean;
}) => {
  const today = isoDay();
  const min = invoice.issuedAt?.slice(0, 10);
  const [paidAt, setPaidAt] = useState(today);
  const [method, setMethod] = useState<MODELS.InvoicePaymentMethod>('BANK_TRANSFER');
  const valid = !!paidAt && paidAt <= today && (!min || paidAt >= min);
  return (
    <BaseModal
      isOpen={open}
      onChange={((o: boolean) => !o && onClose()) as ModalOpenProps['onChange']}
      title="Marquer comme payée"
      icon={<Icons.Check />}
      size="sm"
      buttonCancelTitle="Annuler"
      buttonSaveTitle="Enregistrer le paiement"
      isLoading={isSubmitting}
      saveDisabled={!valid}
      onClick={() => valid && onConfirm({ paidAt, method })}
    >
      <Stack gap={4}>
        <BaseText variant={TextVariant.S}>
          Facture {invoice.number} · <Money value={invoice.totals.ttc} />
        </BaseText>
        <Field.Root required invalid={!valid}>
          <Field.Label>Date du paiement</Field.Label>
          <Input
            type="date"
            value={paidAt}
            max={today}
            min={min}
            onChange={(e) => setPaidAt(e.target.value)}
          />
          {!valid && (
            <Field.ErrorText>
              Entre l’émission ({min && shortDate(min)}) et aujourd’hui.
            </Field.ErrorText>
          )}
        </Field.Root>
        <Field.Root required>
          <Field.Label>Moyen de paiement</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={method}
              onChange={(e) => setMethod(e.target.value as MODELS.InvoicePaymentMethod)}
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Field.Root>
      </Stack>
    </BaseModal>
  );
};

/**
 * Détail d'une facture : PDF (brouillon : mention BROUILLON), informations et actions selon le
 * statut. Brouillon : modifier, supprimer, émettre. Émise : payée, annuler. Payée : annuler.
 * Émise ou payée : envoi (et renvoi) par e-mail au client, PDF joint.
 * Chaque action irréversible montre d'abord ce qu'elle entraîne.
 */
export const InvoiceDetailDialog = ({
  agencyId,
  invoiceId,
  onClose,
  onEdit,
  onChanged,
}: {
  agencyId: string;
  invoiceId: string | null;
  onClose: () => void;
  onEdit: (invoice: MODELS.IInvoice) => void;
  onChanged: () => void;
}) => {
  const [action, setAction] = useState<Action | null>(null);
  // Lecture seule sans `manage_invoices` ; quota mensuel contrôlé avant d'ouvrir l'émission
  const canManage = usePermissions().hasPermission(AppPermissions.INVOICES.MANAGE);
  const { guard, limitModal } = useFeatureGuard('manage_invoices');
  const [reason, setReason] = useState('');
  const { data: invoice, refetch } = AgencyModule.getInvoiceQueries({
    params: { agencyId, id: invoiceId ?? '' },
    queryOptions: { enabled: !!invoiceId, refetchOnMount: 'always' },
  });
  const { data: templates } = AgencyModule.getInvoiceTemplatesQueries({
    params: { agencyId },
    queryOptions: { enabled: !!invoiceId },
  });
  const pdf = usePdfDocument(
    invoiceId ? { url: invoicePdfUrl(agencyId, invoiceId) } : null,
    !!invoiceId,
  );
  const { mutate, isPending } = AgencyModule.invoiceActionMutation({
    mutationOptions: {
      onSuccess: () => {
        const done = action;
        setAction(null);
        setReason('');
        onChanged();
        if (done === 'delete') return onClose();
        refetch();
        if (done === 'send') {
          return BaseToast({ title: 'Facture envoyée', type: ToastStatus.SUCCESS });
        }
        pdf.retry();
      },
    },
  });
  const run = (body?: object) =>
    action &&
    invoiceId &&
    mutate({ payload: { action, body }, params: { agencyId, id: invoiceId } });

  const status = invoice ? INVOICE_STATUS[invoice.status] : null;
  const closeAction = (() => setAction(null)) as ModalOpenProps['onChange'];

  return (
    <BaseModal
      isOpen={!!invoiceId}
      onChange={((o: boolean) => !o && onClose()) as ModalOpenProps['onChange']}
      title={invoice ? (invoice.number ?? 'Brouillon de facture') : 'Facture'}
      size="full"
      ignoreFooter
    >
      {!invoice || !status ? (
        <Skeleton height="420px" rounded="7px" />
      ) : (
        <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) 320px' }} gap={6}>
          <InvoicePreviewPane {...pdf} caption="Document PDF" />

          <Stack gap={5}>
            <Flex gap={2} wrap="wrap">
              <BaseBadge status={status.status} label={status.label} variant="subtle" size="sm" />
              {isOverdue(invoice) && (
                <BaseBadge
                  status={ENUM.COMMON.Status.WARNING}
                  label="En retard"
                  variant="subtle"
                  size="sm"
                />
              )}
            </Flex>

            <Stack as="dl" gap={2}>
              <Row label="Client">{invoice.client.name}</Row>
              {invoice.client.email && <Row label="E-mail">{invoice.client.email}</Row>}
              {invoice.bookingReference && (
                <Row label="Réservation">{invoice.bookingReference}</Row>
              )}
              <Row label={invoice.issuedAt ? 'Émise le' : 'Créée le'}>
                {shortDate(invoice.issuedAt ?? invoice.createdAt)}
              </Row>
              <Row label="Échéance">{shortDate(invoice.dueAt)}</Row>
              {invoice.templateName && <Row label="Modèle">{invoice.templateName}</Row>}
              <Row label="Total TTC">
                <Money value={invoice.totals.ttc} />
              </Row>
              {invoice.paidAt && (
                <Row label="Payée le">
                  {shortDate(invoice.paidAt)} ·{' '}
                  {PAYMENT_METHODS.find((m) => m.value === invoice.paymentMethod)?.label}
                </Row>
              )}
              {invoice.cancelledAt && (
                <Row label="Annulée le">{shortDate(invoice.cancelledAt)}</Row>
              )}
              {invoice.emails?.[0] && (
                <Row label="Envoyée le">
                  {shortDate(invoice.emails[0].sentAt)} à {invoice.emails[0].recipient}
                  {invoice.emails.length > 1 && ` (${invoice.emails.length} envois)`}
                </Row>
              )}
            </Stack>
            {invoice.cancelReason && (
              <Box p={3} rounded="7px" bg="bg.muted">
                <BaseText variant={TextVariant.XS} color="fg.muted">
                  Motif de l’annulation
                </BaseText>
                <BaseText variant={TextVariant.S}>{invoice.cancelReason}</BaseText>
              </Box>
            )}

            <Stack gap={2}>
              {canManage && invoice.status === 'DRAFT' && (
                <>
                  <BaseButton colorType="primary" onClick={() => guard(() => setAction('issue'))}>
                    Émettre la facture
                  </BaseButton>
                  <BaseButton variant="outline" colorType="primary" onClick={() => onEdit(invoice)}>
                    <Icons.Edit aria-hidden />
                    Modifier le brouillon
                  </BaseButton>
                  <BaseButton colorType="danger" onClick={() => setAction('delete')}>
                    <Icons.Trash aria-hidden />
                    Supprimer le brouillon
                  </BaseButton>
                </>
              )}
              {canManage && invoice.status === 'ISSUED' && (
                <BaseButton colorType="primary" onClick={() => setAction('pay')}>
                  <Icons.Check aria-hidden />
                  Marquer comme payée
                </BaseButton>
              )}
              {canManage && (invoice.status === 'ISSUED' || invoice.status === 'PAID') && (
                <BaseButton variant="outline" colorType="primary" onClick={() => setAction('send')}>
                  <Icons.Send aria-hidden />
                  {invoice.emails?.length ? 'Renvoyer par e-mail' : 'Envoyer par e-mail'}
                </BaseButton>
              )}
              {invoice.number && (
                <Button asChild variant="outline" size="sm">
                  <a
                    href={invoicePdfUrl(agencyId, invoice.id, true)}
                    download={`${invoice.number}.pdf`}
                  >
                    <Icons.Download aria-hidden />
                    Télécharger le PDF
                  </a>
                </Button>
              )}
              {canManage && (invoice.status === 'ISSUED' || invoice.status === 'PAID') && (
                <BaseButton variant="ghost" colorType="danger" onClick={() => setAction('cancel')}>
                  Annuler la facture
                </BaseButton>
              )}
            </Stack>
          </Stack>

          {limitModal}
          <ActionImpactDialog
            isOpen={action === 'issue'}
            onChange={closeAction}
            title="Émettre cette facture"
            subject={invoice.client.name}
            summary={invoiceIssueImpact({
              ttc: invoice.totals.ttc,
              prefix: templates?.settings.invoicePrefix ?? 'FAC',
            })}
            isSubmitting={isPending}
            confirmTitle="Émettre"
            confirmColor="primary"
            onConfirm={() => run()}
          />
          <ActionImpactDialog
            isOpen={action === 'delete'}
            onChange={closeAction}
            title="Supprimer ce brouillon"
            subject={invoice.client.name}
            summary={invoiceDeleteImpact({
              clientName: invoice.client.name,
              ttc: invoice.totals.ttc,
            })}
            isSubmitting={isPending}
            confirmTitle="Supprimer"
            onConfirm={() => run()}
          />
          {invoice.number && (
            <ActionImpactDialog
              isOpen={action === 'cancel'}
              onChange={closeAction}
              title="Annuler cette facture"
              subject={invoice.number}
              summary={invoiceCancelImpact({
                number: invoice.number,
                ttc: invoice.totals.ttc,
                paid: invoice.status === 'PAID',
              })}
              isSubmitting={isPending}
              confirmTitle="Annuler la facture"
              confirmDisabled={reason.trim().length < 3}
              onConfirm={() => run({ reason: reason.trim() })}
            >
              <Field.Root required>
                <Field.Label>Motif de l’annulation</Field.Label>
                <Textarea
                  value={reason}
                  maxLength={500}
                  rows={3}
                  placeholder="Ex. : montant erroné, facture remplacée"
                  onChange={(e) => setReason(e.target.value)}
                />
                <Field.HelperText>
                  Conservé avec la facture (3 caractères au moins).
                </Field.HelperText>
              </Field.Root>
            </ActionImpactDialog>
          )}
          {action === 'send' && (
            <InvoiceSendDialog
              invoice={invoice}
              onClose={() => setAction(null)}
              onConfirm={(body) => run(body)}
              isSubmitting={isPending}
            />
          )}
          {action === 'pay' && (
            <PayDialog
              invoice={invoice}
              open
              onClose={() => setAction(null)}
              onConfirm={(body) => run(body)}
              isSubmitting={isPending}
            />
          )}
        </Grid>
      )}
    </BaseModal>
  );
};
