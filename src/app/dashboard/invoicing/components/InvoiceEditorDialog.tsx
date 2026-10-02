'use client';

import {
  Box,
  Field,
  Flex,
  Input,
  NativeSelect,
  RadioCard,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { BaseButton, BaseFormatNumber, BaseText, TextVariant } from '_components/custom';
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
import { ENUM, MODELS } from '_types/*';
import { invoiceTotals, isoDay, shortDate } from '_utils/invoice';
import { EMPTY_LINE, InvoiceLinesField, lineValid } from './InvoiceLinesField';

type Source = 'booking' | 'free';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyDraft = (): MODELS.IInvoiceDraft => ({
  client: { name: '', email: '', phone: '', address: '' },
  lines: [{ ...EMPTY_LINE }],
  dueAt: isoDay(15),
});

const draftOf = (invoice: MODELS.IInvoice): MODELS.IInvoiceDraft => ({
  templateId: invoice.templateId ?? undefined,
  client: { ...invoice.client },
  lines: invoice.lines.map((l) => ({ ...l })),
  dueAt: invoice.dueAt.slice(0, 10),
});

const Money = ({ value }: { value: number }) => (
  <BaseFormatNumber value={value} currencyCode={ENUM.COMMON.Currency.XOF} />
);

/** Réservations à facturer : la plus récente d'abord, factures déjà créées signalées. */
const BookingPicker = ({
  agencyId,
  value,
  onChange,
}: {
  agencyId: string;
  value: string | null;
  onChange: (id: string) => void;
}) => {
  const { data, isLoading } = AgencyModule.getInvoiceableBookingsQueries({
    params: { agencyId },
    queryOptions: { enabled: !!agencyId },
  });
  if (isLoading) return <Skeleton height="120px" rounded="7px" />;
  if (!data?.length) {
    return (
      <BaseText variant={TextVariant.S} color="fg.muted">
        Aucune réservation confirmée à facturer. Choisissez « Facture libre ».
      </BaseText>
    );
  }
  return (
    <RadioCard.Root
      value={value}
      onValueChange={(e) => e.value && onChange(e.value)}
      aria-label="Réservation à facturer"
      size="sm"
    >
      <Stack gap={2} maxH="420px" overflowY="auto" pr={1}>
        {data.map((b) => (
          <RadioCard.Item key={b.id} value={b.id}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemContent>
                <RadioCard.ItemText>
                  {b.clientName ?? 'Client'} · {b.propertyTitle}
                </RadioCard.ItemText>
                <RadioCard.ItemDescription>
                  {b.reference} · {shortDate(b.startDate)} → {shortDate(b.endDate)} ·{' '}
                  <Money value={b.totalAmount} />
                  {b.invoiceCount > 0 &&
                    ` · déjà ${b.invoiceCount} facture${b.invoiceCount > 1 ? 's' : ''}`}
                </RadioCard.ItemDescription>
              </RadioCard.ItemContent>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
  );
};

interface InvoiceEditorDialogProps {
  agencyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Brouillon modifié ; absent pour une nouvelle facture (choix de la source d'abord) */
  editing: MODELS.IInvoice | null;
  onSaved: (invoice: MODELS.IInvoice) => void;
}

/**
 * Création ou modification d'un brouillon, plein écran. Nouvelle facture : depuis une
 * réservation (brouillon prérempli par le backend, puis ajustable) ou libre. Les totaux suivent
 * la saisie au taux de TVA de l'agence ; le PDF est visible depuis le détail de la facture.
 */
export const InvoiceEditorDialog = ({
  agencyId,
  open,
  onOpenChange,
  editing,
  onSaved,
}: InvoiceEditorDialogProps) => {
  const [current, setCurrent] = useState<MODELS.IInvoice | null>(null);
  const [step, setStep] = useState<'source' | 'form'>('source');
  const [source, setSource] = useState<Source>('booking');
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MODELS.IInvoiceDraft>(emptyDraft);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { data: templates } = AgencyModule.getInvoiceTemplatesQueries({
    params: { agencyId },
    queryOptions: { enabled: open && !!agencyId },
  });
  const vatRate = templates?.settings.vatRate ?? 0;

  useEffect(() => {
    if (!open) return;
    setCurrent(editing);
    setStep(editing ? 'form' : 'source');
    setSource('booking');
    setBookingId(null);
    setDraft(editing ? draftOf(editing) : emptyDraft());
  }, [open, editing]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const { mutate: save, isPending: saving } = AgencyModule.saveInvoiceMutation({
    mutationOptions: {
      onSuccess: (invoice) => {
        if (step === 'source') {
          // Brouillon prérempli depuis la réservation : on passe à sa vérification
          setCurrent(invoice);
          setDraft(draftOf(invoice));
          setStep('form');
          return;
        }
        onOpenChange(false);
        onSaved(invoice);
      },
    },
  });

  const totals = invoiceTotals(draft.lines, vatRate);
  const email = draft.client.email?.trim() ?? '';
  const blockedReason =
    step === 'source'
      ? source === 'booking' && !bookingId
        ? 'Choisissez une réservation.'
        : ''
      : draft.client.name.trim().length < 2
        ? 'Indiquez le nom du client.'
        : email && !EMAIL.test(email)
          ? 'Adresse e-mail du client invalide.'
          : !draft.lines.every(lineValid)
            ? 'Complétez chaque ligne (désignation, quantité, prix entier).'
            : !draft.dueAt
              ? 'Indiquez l’échéance.'
              : '';

  const next = () => {
    if (blockedReason) return;
    if (step === 'source') {
      if (source === 'booking' && bookingId) {
        save({ payload: { bookingId }, params: { agencyId } });
      } else {
        setStep('form');
      }
      return;
    }
    const payload: MODELS.IInvoiceDraft = {
      ...draft,
      templateId: draft.templateId || undefined,
      lines: draft.lines.map((l) => ({ ...l, period: l.period?.trim() || null })),
    };
    save({ payload: { draft: payload }, params: { agencyId, id: current?.id } });
  };

  const setClient = (patch: Partial<MODELS.IInvoiceClient>) =>
    setDraft((d) => ({ ...d, client: { ...d.client, ...patch } }));

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
          <Stack gap={0} width="full" maxW="64rem" mx="auto" pr={10}>
            <BaseText variant={TextVariant.XS} color="fg.muted">
              {current ? 'Brouillon de facture' : 'Nouvelle facture'}
              {current?.bookingReference && ` · réservation ${current.bookingReference}`}
            </BaseText>
            <DialogTitle asChild>
              <BaseText
                as="h2"
                ref={headingRef}
                tabIndex={-1}
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="semibold"
                outline="none"
              >
                {step === 'source' ? 'Que voulez-vous facturer ?' : 'Client, lignes et échéance'}
              </BaseText>
            </DialogTitle>
          </Stack>
          <DialogCloseTrigger disabled={saving} top="4" insetEnd="4" aria-label="Fermer" />
        </DialogHeader>

        <DialogBody py={{ base: 6, md: 8 }}>
          <Stack width="full" maxW="64rem" mx="auto" gap={8}>
            {step === 'source' ? (
              <Stack gap={5}>
                <RadioCard.Root
                  value={source}
                  onValueChange={(e) => e.value && setSource(e.value as Source)}
                  aria-label="Source de la facture"
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                    <RadioCard.Item value="booking">
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemContent>
                          <RadioCard.ItemText>Depuis une réservation</RadioCard.ItemText>
                          <RadioCard.ItemDescription>
                            Client, bien, période, montant et caution préremplis.
                          </RadioCard.ItemDescription>
                        </RadioCard.ItemContent>
                        <RadioCard.ItemIndicator />
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                    <RadioCard.Item value="free">
                      <RadioCard.ItemHiddenInput />
                      <RadioCard.ItemControl>
                        <RadioCard.ItemContent>
                          <RadioCard.ItemText>Facture libre</RadioCard.ItemText>
                          <RadioCard.ItemDescription>
                            Toute autre prestation : vous saisissez le client et les lignes.
                          </RadioCard.ItemDescription>
                        </RadioCard.ItemContent>
                        <RadioCard.ItemIndicator />
                      </RadioCard.ItemControl>
                    </RadioCard.Item>
                  </SimpleGrid>
                </RadioCard.Root>
                {source === 'booking' && (
                  <BookingPicker agencyId={agencyId} value={bookingId} onChange={setBookingId} />
                )}
              </Stack>
            ) : (
              <>
                <Stack gap={4} as="fieldset">
                  <BaseText as="legend" fontWeight="semibold" mb={2}>
                    Client
                  </BaseText>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Field.Root required>
                      <Field.Label>
                        Nom ou raison sociale <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        value={draft.client.name}
                        maxLength={120}
                        autoComplete="off"
                        onChange={(e) => setClient({ name: e.target.value })}
                      />
                    </Field.Root>
                    <Field.Root invalid={!!email && !EMAIL.test(email)}>
                      <Field.Label>E-mail</Field.Label>
                      <Input
                        type="email"
                        value={draft.client.email ?? ''}
                        maxLength={254}
                        autoComplete="off"
                        onChange={(e) => setClient({ email: e.target.value })}
                      />
                      <Field.HelperText>Pour lui envoyer la facture.</Field.HelperText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Téléphone</Field.Label>
                      <Input
                        type="tel"
                        value={draft.client.phone ?? ''}
                        maxLength={30}
                        autoComplete="off"
                        onChange={(e) => setClient({ phone: e.target.value })}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Adresse</Field.Label>
                      <Input
                        value={draft.client.address ?? ''}
                        maxLength={300}
                        autoComplete="off"
                        onChange={(e) => setClient({ address: e.target.value })}
                      />
                    </Field.Root>
                  </SimpleGrid>
                </Stack>

                <InvoiceLinesField
                  lines={draft.lines}
                  onChange={(lines) => setDraft((d) => ({ ...d, lines }))}
                />

                <Flex
                  gap={8}
                  direction={{ base: 'column', md: 'row' }}
                  justifyContent="space-between"
                >
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} flex="1" maxW="32rem">
                    <Field.Root required>
                      <Field.Label>
                        Échéance <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="date"
                        value={draft.dueAt}
                        onChange={(e) => setDraft((d) => ({ ...d, dueAt: e.target.value }))}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Modèle</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          value={draft.templateId ?? ''}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, templateId: e.target.value || undefined }))
                          }
                        >
                          <option value="">Modèle par défaut de l’agence</option>
                          {templates?.templates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Field.Root>
                  </SimpleGrid>

                  <Stack
                    as="dl"
                    gap={1}
                    minW={{ md: '260px' }}
                    p={4}
                    rounded="7px"
                    bg="bg.muted"
                    aria-label="Totaux"
                  >
                    <Flex justifyContent="space-between" gap={4}>
                      <BaseText as="dt" variant={TextVariant.S} color="fg.muted">
                        Total HT
                      </BaseText>
                      <BaseText as="dd" variant={TextVariant.S}>
                        <Money value={totals.ht} />
                      </BaseText>
                    </Flex>
                    <Flex justifyContent="space-between" gap={4}>
                      <BaseText as="dt" variant={TextVariant.S} color="fg.muted">
                        {vatRate ? `TVA (${vatRate} %)` : 'TVA non applicable'}
                      </BaseText>
                      <BaseText as="dd" variant={TextVariant.S}>
                        <Money value={totals.vat} />
                      </BaseText>
                    </Flex>
                    <Flex justifyContent="space-between" gap={4} pt={1}>
                      <BaseText as="dt" fontWeight="semibold">
                        Total TTC
                      </BaseText>
                      <BaseText as="dd" fontWeight="semibold">
                        <Money value={totals.ttc} />
                      </BaseText>
                    </Flex>
                  </Stack>
                </Flex>
              </>
            )}
          </Stack>
        </DialogBody>

        <DialogFooter borderTopWidth="1px" borderColor="border" bg="bg" py={3}>
          <Flex
            width="full"
            maxW="64rem"
            mx="auto"
            gap={3}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              {step === 'form' && !current && (
                <BaseButton
                  variant="outline"
                  colorType="neutral"
                  disabled={saving}
                  onClick={() => setStep('source')}
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
              <BaseButton
                colorType="primary"
                isLoading={saving}
                disabled={!!blockedReason || saving}
                onClick={next}
              >
                {step === 'source' ? 'Continuer' : 'Enregistrer le brouillon'}
              </BaseButton>
            </Flex>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
