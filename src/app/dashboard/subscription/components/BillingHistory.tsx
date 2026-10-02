'use client';

import { t } from 'i18next';
import { useMemo, useState } from 'react';
import {
  BaseBadge,
  BaseFormatNumber,
  ColumnsDataTable,
  DataTableContainer,
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
    accessor: 'actions',
    actions: [
      {
        name: 'download',
        title: 'Télécharger le reçu',
        isShown: (p: Payment) => !!p.receiptNumber,
        // Réponse en pièce jointe : le navigateur télécharge sans quitter la page
        handleClick: (p: Payment) => window.location.assign(receiptDownloadUrl(agencyId, p.id)),
      },
    ],
  },
];

/**
 * Historique de facturation (owner) : tableau des paiements, reçu téléchargeable pour chaque
 * paiement payé. Montants, périodes et statuts tels que le backend les renvoie.
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

  return (
    <DataTableContainer
      data={payments}
      columns={columns}
      isLoading={isLoading}
      notFoundTitle="Aucun paiement pour le moment."
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
  );
};
