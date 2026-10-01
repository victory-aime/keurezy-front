'use client';

import { Box, Button, Flex, Skeleton, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import {
  BaseBadge,
  BaseButton,
  BaseFormatNumber,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
  TextVariant,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { receiptDownloadUrl } from '_utils/subscription';

type Payment = MODELS.IAgencyPayment;

const PAGE_SIZE = 10;

const KIND_LABELS: Record<Payment['kind'], string> = {
  ONBOARDING: 'Souscription',
  RENEWAL: 'Renouvellement',
  UPGRADE: 'Changement de plan',
  REACTIVATION: 'Réactivation',
};

const STATUS: Record<Payment['status'], { status: ENUM.COMMON.Status; label: string }> = {
  PAID: { status: ENUM.COMMON.Status.ACTIVE, label: 'Payé' },
  PENDING: { status: ENUM.COMMON.Status.PENDING, label: 'En attente' },
  FAILED: { status: ENUM.COMMON.Status.INACTIVE, label: 'Échoué' },
  CANCELLED: { status: ENUM.COMMON.Status.INACTIVE, label: 'Annulé' },
};

/** « 1 oct. 2026 » */
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const period = (p: Payment) =>
  p.periodStart && p.periodEnd ? `${shortDate(p.periodStart)} → ${shortDate(p.periodEnd)}` : '—';

const Amount = ({ payment }: { payment: Payment }) => (
  <BaseFormatNumber
    value={payment.amount}
    currencyCode={payment.currency as ENUM.COMMON.Currency}
  />
);

const StatusBadge = ({ payment }: { payment: Payment }) => (
  <BaseBadge {...STATUS[payment.status]} variant="subtle" size="sm" />
);

/** Téléchargement du reçu PDF d'un paiement payé ; rien sinon. */
const ReceiptLink = ({ agencyId, payment }: { agencyId: string; payment: Payment }) =>
  payment.receiptNumber ? (
    <Button asChild size="xs" variant="outline">
      <a
        href={receiptDownloadUrl(agencyId, payment.id)}
        download={`recu-${payment.receiptNumber}.pdf`}
        aria-label={`Télécharger le reçu ${payment.receiptNumber}`}
      >
        <Icons.Download aria-hidden />
        Reçu
      </a>
    </Button>
  ) : null;

const columnsFor = (agencyId: string): ColumnsDataTable[] => [
  {
    header: 'Date',
    accessor: 'fullObject',
    cell: (p: Payment) => shortDate(p.paidAt ?? p.createdAt),
  },
  { header: 'Type', accessor: 'kind', cell: (kind: Payment['kind']) => KIND_LABELS[kind] },
  { header: 'Plan', accessor: 'plan', cell: (plan: string) => t(`SUBSCRIPTION.PLANS.${plan}`) },
  { header: 'Période', accessor: 'fullObject', cell: (p: Payment) => period(p) },
  { header: 'Montant', accessor: 'fullObject', cell: (p: Payment) => <Amount payment={p} /> },
  { header: 'Statut', accessor: 'fullObject', cell: (p: Payment) => <StatusBadge payment={p} /> },
  {
    header: 'Reçu',
    accessor: 'fullObject',
    cell: (p: Payment) => <ReceiptLink agencyId={agencyId} payment={p} />,
  },
];

/**
 * Historique de facturation (owner) : tableau sur desktop, liste compacte sur mobile (date et
 * montant d'abord). Montants, périodes et statuts tels que le backend les renvoie.
 */
export const BillingHistory = ({ agencyId }: { agencyId: string }) => {
  const columns = useMemo(() => columnsFor(agencyId), [agencyId]);
  const [page, setPage] = useState(1);
  const { data, isLoading } = AgencyModule.getSubscriptionPaymentsQueries({
    params: { agencyId, initialPage: page, limitPerPage: PAGE_SIZE },
    queryOptions: { enabled: !!agencyId },
  });
  const payments = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (isLoading) {
    return (
      <Stack gap={2} aria-busy="true" aria-label="Chargement de l’historique">
        <Skeleton height="40px" rounded="7px" />
        <Skeleton height="40px" rounded="7px" />
      </Stack>
    );
  }
  if (!payments.length) {
    return (
      <BaseText variant={TextVariant.S} color="fg.muted">
        Aucun paiement pour le moment.
      </BaseText>
    );
  }

  return (
    <>
      <Box hideBelow="md">
        <DataTableContainer
          data={payments}
          columns={columns}
          paginationData={{
            lazy: true,
            currentPage: page,
            totalDataPerPage: PAGE_SIZE,
            totalItems: data?.totalItems,
            totalPages,
            onLazyLoad: (index: number) => setPage(index),
          }}
          hidePagination={totalPages <= 1}
        />
      </Box>

      <Stack hideFrom="md" gap={0} as="ul" listStyleType="none">
        {payments.map((p) => (
          <Stack
            as="li"
            key={p.id}
            gap={1}
            py={3}
            borderBottomWidth="1px"
            borderColor="border"
            _last={{ borderBottomWidth: 0 }}
          >
            <Flex justifyContent="space-between" alignItems="baseline" gap={3}>
              <BaseText variant={TextVariant.S} fontWeight="semibold">
                {shortDate(p.paidAt ?? p.createdAt)}
              </BaseText>
              <BaseText variant={TextVariant.S} fontWeight="semibold">
                <Amount payment={p} />
              </BaseText>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" gap={3}>
              <BaseText variant={TextVariant.XS} color="fg.muted">
                {KIND_LABELS[p.kind]} · {t(`SUBSCRIPTION.PLANS.${p.plan}`)}
                <br />
                {period(p)}
              </BaseText>
              <Flex gap={2} alignItems="center">
                <StatusBadge payment={p} />
                <ReceiptLink agencyId={agencyId} payment={p} />
              </Flex>
            </Flex>
          </Stack>
        ))}
        {totalPages > 1 && (
          <Flex justifyContent="space-between" alignItems="center" pt={3}>
            <BaseButton
              size="sm"
              variant="outline"
              colorType="neutral"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Précédent
            </BaseButton>
            <BaseText variant={TextVariant.XS} color="fg.muted">
              Page {page} sur {totalPages}
            </BaseText>
            <BaseButton
              size="sm"
              variant="outline"
              colorType="neutral"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Suivant
            </BaseButton>
          </Flex>
        )}
      </Stack>
    </>
  );
};
