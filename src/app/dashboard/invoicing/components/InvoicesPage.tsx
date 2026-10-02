'use client';

import { Box, Flex } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import {
  BaseButton,
  BaseContainer,
  BaseFormatNumber,
  BaseTag,
  ColumnsDataTable,
  DataTableContainer,
  FormTextInput,
  Icons,
} from '_components/custom';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { INVOICE_STATUS, invoicePdfUrl, isOverdue, shortDate } from '_utils/invoice';
import { usePermissions } from '../../../hooks/usePermissions';
import { AppPermissions } from '_utils/app-permissions';
import { InvoiceDetailDialog } from './InvoiceDetailDialog';
import { InvoiceEditorDialog } from './InvoiceEditorDialog';

type Item = MODELS.IInvoiceListItem;
type Filter = MODELS.InvoiceStatus | 'ALL';

const PAGE_SIZE = 20;
const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'Toutes' },
  ...(['DRAFT', 'ISSUED', 'PAID', 'CANCELLED'] as const).map((s) => ({
    value: s,
    label: INVOICE_STATUS[s].plural,
  })),
];

const StatusBadges = ({ item }: { item: Item }) => (
  <Flex gap={1} wrap="wrap">
    <BaseTag {...INVOICE_STATUS[item.status]} size="sm" />
    {isOverdue(item) && <BaseTag status={ENUM.COMMON.Status.WARNING} label="En retard" size="sm" />}
  </Flex>
);

const Total = ({ item }: { item: Item }) => (
  <BaseFormatNumber value={item.totalTtc} currencyCode={ENUM.COMMON.Currency.XOF} />
);

const columnsFor = (open: (id: string) => void, agencyId: string): ColumnsDataTable[] => [
  {
    header: 'Numéro',
    accessor: 'fullObject',
    cell: (i: Item) => (
      <BaseButton variant="plain" colorType="primary" size="sm" px={0} onClick={() => open(i.id)}>
        {i.number ?? 'Brouillon'}
      </BaseButton>
    ),
  },
  { header: 'Client', accessor: 'clientName' },
  {
    header: 'Date',
    accessor: 'fullObject',
    cell: (i: Item) => shortDate(i.issuedAt ?? i.createdAt),
  },
  { header: 'Échéance', accessor: 'fullObject', cell: (i: Item) => shortDate(i.dueAt) },
  { header: 'Total TTC', accessor: 'fullObject', cell: (i: Item) => <Total item={i} /> },
  { header: 'Statut', accessor: 'fullObject', cell: (i: Item) => <StatusBadges item={i} /> },
  {
    header: 'Action',
    accessor: 'actions',
    actions: [
      {
        name: 'download',
        title: 'Télécharger le PDF',
        isShown: (i: Item) => !!i.number,
        // Réponse en pièce jointe : le navigateur télécharge sans quitter la page
        handleClick: (i: Item) => window.location.assign(invoicePdfUrl(agencyId, i.id, true)),
      },
    ],
  },
];

/**
 * « Factures » : factures de l'agence à ses clients, filtrées par statut ou recherchées par
 * numéro ou client. Création depuis une réservation ou libre ; détail avec PDF et actions.
 */
export const InvoicesPage = () => {
  const { user } = useUserContext();
  const agencyId = user?.agencyId ?? '';
  const canManage = usePermissions().hasPermission(AppPermissions.INVOICES.MANAGE);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<{ open: boolean; editing: MODELS.IInvoice | null }>({
    open: false,
    editing: null,
  });
  // `key` du détail : remonté après une modification, pour recharger son PDF
  const [detail, setDetail] = useState<{ id: string | null; key: number }>({ id: null, key: 0 });

  // Recherche lancée 300 ms après la frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, refetch } = AgencyModule.getInvoicesQueries({
    params: {
      agencyId,
      status: filter === 'ALL' ? undefined : filter,
      q: q || undefined,
      page,
      pageSize: PAGE_SIZE,
    },
    queryOptions: { enabled: !!agencyId },
  });
  const open = (id: string) => setDetail((d) => ({ id, key: d.key + 1 }));
  const columns = useMemo(() => columnsFor(open, agencyId), [agencyId]);
  const items = data?.content ?? [];
  const counts = data?.counts ?? {};
  const all = Object.values(counts).reduce((sum, n) => sum + (n ?? 0), 0);

  return (
    <BaseContainer
      title="Factures"
      description="Facturez vos clients depuis une réservation ou pour toute autre prestation. Un brouillon se modifie librement ; une fois émise, la facture est numérotée et figée."
      border="none"
      gap={6}
    >
      <Flex justifyContent="space-between" gap={3} wrap="wrap" width="full" p={4}>
        <Formik initialValues={{ search: '' }} onSubmit={() => undefined}>
          <Box width={{ base: 'full', sm: '320px' }}>
            <FormTextInput
              name="search"
              type="search"
              aria-label="Rechercher une facture"
              placeholder="Numéro ou client"
              leftAccessory={<Icons.Search aria-hidden />}
              onChangeFunction={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </Box>
        </Formik>
        {canManage && (
          <BaseButton colorType="primary" onClick={() => setEditor({ open: true, editing: null })}>
            Nouvelle facture
          </BaseButton>
        )}
      </Flex>

      <Flex gap={2} flexWrap="wrap" role="group" aria-label="Filtrer par statut">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <BaseButton
              key={f.value}
              colorType={active ? 'primary' : 'neutral'}
              variant={active ? 'solid' : 'outline'}
              aria-pressed={active}
              onClick={() => {
                setFilter(f.value);
                setPage(1);
              }}
            >
              {f.label}
              <BaseTag
                ml={1}
                size="sm"
                colorPalette={active ? 'primary' : 'gray'}
                variant={active ? 'surface' : 'subtle'}
                label={String(f.value === 'ALL' ? all : (counts[f.value] ?? 0))}
              />
            </BaseButton>
          );
        })}
      </Flex>

      <DataTableContainer
        data={items}
        columns={columns}
        isLoading={isLoading}
        isOpenSelect
        onOpenSelectRow={(i: Item) => open(i.id)}
        notFoundTitle={
          q || filter !== 'ALL'
            ? 'Aucune facture ne correspond : modifiez la recherche ou le filtre.'
            : 'Aucune facture pour le moment. Créez la première depuis une réservation confirmée, ou une facture libre.'
        }
        paginationData={{
          lazy: true,
          currentPage: page,
          totalDataPerPage: PAGE_SIZE,
          totalItems: data?.totalItems,
          totalPages: data?.totalPages,
          onLazyLoad: (index: number) => setPage(index),
        }}
        hidePagination={(data?.totalPages ?? 1) <= 1}
      />

      <InvoiceEditorDialog
        agencyId={agencyId}
        open={editor.open}
        onOpenChange={(o) => {
          setEditor((e) => ({ ...e, open: o }));
          // Un brouillon créé depuis une réservation existe déjà, même sans enregistrement final
          if (!o) refetch();
        }}
        editing={editor.editing}
        onSaved={(invoice) => open(invoice.id)}
      />
      <InvoiceDetailDialog
        key={detail.key}
        agencyId={agencyId}
        invoiceId={detail.id}
        onClose={() => setDetail((d) => ({ ...d, id: null }))}
        onEdit={(invoice) => {
          setDetail((d) => ({ ...d, id: null }));
          setEditor({ open: true, editing: invoice });
        }}
        onChanged={() => refetch()}
      />
    </BaseContainer>
  );
};
