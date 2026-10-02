'use client';

import { Badge, Box, Flex, Input, InputGroup, Skeleton, Stack } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import {
  BaseBadge,
  BaseButton,
  BaseContainer,
  BaseFormatNumber,
  BaseText,
  ColumnsDataTable,
  DataTableContainer,
  Icons,
  TextVariant,
} from '_components/custom';
import { useUserContext } from '_context/user-context';
import { AgencyModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { INVOICE_STATUS, isOverdue, shortDate } from '_utils/invoice';
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
    <BaseBadge {...INVOICE_STATUS[item.status]} variant="subtle" size="sm" />
    {isOverdue(item) && (
      <BaseBadge status={ENUM.COMMON.Status.WARNING} label="En retard" variant="subtle" size="sm" />
    )}
  </Flex>
);

const Total = ({ item }: { item: Item }) => (
  <BaseFormatNumber value={item.totalTtc} currencyCode={ENUM.COMMON.Currency.XOF} />
);

const columnsFor = (open: (id: string) => void): ColumnsDataTable[] => [
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
];

/**
 * « Factures » : factures de l'agence à ses clients, filtrées par statut ou recherchées par
 * numéro ou client. Création depuis une réservation ou libre ; détail avec PDF et actions.
 */
export const InvoicesPage = () => {
  const { user } = useUserContext();
  const agencyId = user?.agencyId ?? '';
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
  const columns = useMemo(() => columnsFor(open), []);
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
      <Flex justifyContent="space-between" gap={3} wrap="wrap" width="full">
        <InputGroup
          startElement={<Icons.Search aria-hidden />}
          maxW={{ base: 'full', sm: '320px' }}
        >
          <Input
            type="search"
            aria-label="Rechercher une facture"
            placeholder="Numéro ou client"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <BaseButton colorType="primary" onClick={() => setEditor({ open: true, editing: null })}>
          Nouvelle facture
        </BaseButton>
      </Flex>

      <Flex gap={2} flexWrap="wrap" role="group" aria-label="Filtrer par statut">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <BaseButton
              key={f.value}
              size="sm"
              colorType="primary"
              variant={active ? 'solid' : 'outline'}
              aria-pressed={active}
              onClick={() => {
                setFilter(f.value);
                setPage(1);
              }}
            >
              {f.label}
              <Badge
                ml={1}
                size="sm"
                variant={active ? 'solid' : 'subtle'}
                colorPalette={active ? 'whiteAlpha' : 'gray'}
              >
                {f.value === 'ALL' ? all : (counts[f.value] ?? 0)}
              </Badge>
            </BaseButton>
          );
        })}
      </Flex>

      {isLoading ? (
        <Stack gap={2} width="full" aria-busy="true" aria-label="Chargement des factures">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height="44px" rounded="7px" />
          ))}
        </Stack>
      ) : !items.length ? (
        <Stack gap={3} py={10} alignItems="center" textAlign="center" width="full" role="status">
          <BaseText fontWeight="semibold">
            {q || filter !== 'ALL'
              ? 'Aucune facture ne correspond'
              : 'Aucune facture pour le moment'}
          </BaseText>
          <BaseText variant={TextVariant.S} color="fg.muted" maxW="28rem">
            {q || filter !== 'ALL'
              ? 'Modifiez la recherche ou le filtre.'
              : 'Créez votre première facture depuis une réservation confirmée, ou une facture libre.'}
          </BaseText>
        </Stack>
      ) : (
        <Box width="full">
          <Box hideBelow="md">
            <DataTableContainer
              data={items}
              columns={columns}
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
          </Box>
          <Stack hideFrom="md" gap={0} as="ul" listStyleType="none">
            {items.map((i) => (
              <Box
                as="li"
                key={i.id}
                borderBottomWidth="1px"
                borderColor="border"
                _last={{ borderBottomWidth: 0 }}
              >
                <Stack
                  as="button"
                  width="full"
                  textAlign="start"
                  gap={1}
                  py={3}
                  onClick={() => open(i.id)}
                  aria-label={`Ouvrir la facture ${i.number ?? 'brouillon'} de ${i.clientName}`}
                >
                  <Flex justifyContent="space-between" alignItems="baseline" gap={3}>
                    <BaseText variant={TextVariant.S} fontWeight="semibold">
                      {i.number ?? 'Brouillon'}
                    </BaseText>
                    <BaseText variant={TextVariant.S} fontWeight="semibold">
                      <Total item={i} />
                    </BaseText>
                  </Flex>
                  <Flex justifyContent="space-between" alignItems="center" gap={3}>
                    <BaseText variant={TextVariant.XS} color="fg.muted">
                      {i.clientName} · échéance {shortDate(i.dueAt)}
                    </BaseText>
                    <StatusBadges item={i} />
                  </Flex>
                </Stack>
              </Box>
            ))}
            {(data?.totalPages ?? 1) > 1 && (
              <Flex mt={3} gap={2} justifyContent="space-between" alignItems="center">
                <BaseButton
                  size="sm"
                  variant="outline"
                  colorType="neutral"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Précédente
                </BaseButton>
                <BaseText variant={TextVariant.XS} color="fg.muted">
                  Page {page} sur {data?.totalPages}
                </BaseText>
                <BaseButton
                  size="sm"
                  variant="outline"
                  colorType="neutral"
                  disabled={page >= (data?.totalPages ?? 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Suivante
                </BaseButton>
              </Flex>
            )}
          </Stack>
        </Box>
      )}

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
