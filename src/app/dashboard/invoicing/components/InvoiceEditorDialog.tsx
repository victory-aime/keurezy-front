'use client';

import { createListCollection, Flex, RadioCard, SimpleGrid, Stack } from '@chakra-ui/react';
import { Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import {
  BaseFormatNumber,
  BaseModal,
  BaseRadioCard,
  BaseText,
  CustomSkeletonLoader,
  FormDatePicker,
  FormSelect,
  FormTextInput,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { ENUM, MODELS } from '_types/*';
import { invoiceTotals, isoDay, shortDate } from '_utils/invoice';
import { EMPTY_LINE, InvoiceLinesField, LINE_SCHEMA } from './InvoiceLinesField';

type Source = 'booking' | 'free';
/** Valeur du sélecteur de modèle pour « modèle par défaut de l'agence » */
const DEFAULT_TEMPLATE = 'DEFAULT';

/** Formulaire d'un brouillon : le modèle est une liste (sélecteur), le reste suit le brouillon. */
type DraftValues = Omit<MODELS.IInvoiceDraft, 'templateId'> & { templateId: string[] };

const DRAFT_SCHEMA = Yup.object({
  client: Yup.object({
    name: Yup.string()
      .trim()
      .required('Indiquez le nom du client.')
      .min(2, 'Indiquez le nom du client.')
      .max(120),
    email: Yup.string().trim().email('Adresse e-mail invalide.').max(254),
    phone: Yup.string().trim().max(30),
    address: Yup.string().trim().max(300),
  }),
  lines: Yup.array().of(LINE_SCHEMA).min(1),
  dueAt: Yup.string().required('Indiquez l’échéance.'),
});

const valuesOf = (invoice: MODELS.IInvoice | null): DraftValues =>
  invoice
    ? {
        templateId: [invoice.templateId ?? DEFAULT_TEMPLATE],
        client: {
          name: invoice.client.name,
          email: invoice.client.email ?? '',
          phone: invoice.client.phone ?? '',
          address: invoice.client.address ?? '',
        },
        lines: invoice.lines.map((l) => ({ ...l, period: l.period ?? '' })),
        dueAt: invoice.dueAt.slice(0, 10),
      }
    : {
        templateId: [DEFAULT_TEMPLATE],
        client: { name: '', email: '', phone: '', address: '' },
        lines: [{ ...EMPTY_LINE }],
        dueAt: isoDay(15),
      };

const payloadOf = (values: DraftValues): MODELS.IInvoiceDraft => ({
  templateId: values.templateId[0] === DEFAULT_TEMPLATE ? undefined : values.templateId[0],
  client: values.client,
  lines: values.lines.map((l) => ({
    ...l,
    quantity: Number(l.quantity),
    unitPrice: Number(l.unitPrice),
    period: l.period?.trim() || null,
  })),
  dueAt: values.dueAt.slice(0, 10),
});

const Money = ({ value }: { value: number }) => (
  <BaseFormatNumber value={value} currencyCode={ENUM.COMMON.Currency.XOF} />
);

const SOURCES = [
  {
    value: 'booking',
    label: 'Depuis une réservation',
    icon: <Icons.Calendar />,
    desc: 'Client, bien, période, montant et caution préremplis.',
  },
  {
    value: 'free',
    label: 'Facture libre',
    icon: <Icons.Edit />,
    desc: 'Toute autre prestation : vous saisissez le client et les lignes.',
  },
];

/**
 * Réservations à facturer : la plus récente d'abord, factures déjà créées signalées. Liste de
 * cartes à choix unique (une description par carte : `BaseRadioCard` n'en montre qu'une).
 */
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
  if (isLoading) return <CustomSkeletonLoader type="DEFAULT" height="120px" />;
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
      colorPalette="primary"
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

/** Totaux d'un brouillon, au taux de TVA de l'agence, recalculés à la saisie. */
const Totals = ({ lines, vatRate }: { lines: MODELS.IInvoiceLine[]; vatRate: number }) => {
  const totals = invoiceTotals(lines, vatRate);
  const row = (label: string, value: number, strong = false) => (
    <Flex justifyContent="space-between" gap={4} pt={strong ? 1 : 0}>
      <BaseText
        as="dt"
        variant={TextVariant.S}
        color={strong ? undefined : 'fg.muted'}
        fontWeight={strong ? 'semibold' : undefined}
      >
        {label}
      </BaseText>
      <BaseText as="dd" variant={TextVariant.S} fontWeight={strong ? 'semibold' : undefined}>
        <Money value={value} />
      </BaseText>
    </Flex>
  );
  return (
    <Stack
      as="dl"
      gap={1}
      minW={{ md: '260px' }}
      p={4}
      rounded="7px"
      bg="bg.muted"
      aria-label="Totaux"
    >
      {row('Total HT', totals.ht)}
      {row(vatRate ? `TVA (${vatRate} %)` : 'TVA non applicable', totals.vat)}
      {row('Total TTC', totals.ttc, true)}
    </Stack>
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

  const { data: templates } = AgencyModule.getInvoiceTemplatesQueries({
    params: { agencyId },
    queryOptions: { enabled: open && !!agencyId },
  });
  const vatRate = templates?.settings.vatRate ?? 0;
  const templateList = useMemo(
    () =>
      createListCollection({
        items: [
          { value: DEFAULT_TEMPLATE, label: 'Modèle par défaut de l’agence' },
          ...(templates?.templates ?? []).map((t) => ({ value: t.id, label: t.name })),
        ],
      }),
    [templates],
  );

  useEffect(() => {
    if (!open) return;
    setCurrent(editing);
    setStep(editing ? 'form' : 'source');
    setSource('booking');
    setBookingId(null);
  }, [open, editing]);

  const { mutate: save, isPending: saving } = AgencyModule.saveInvoiceMutation({
    mutationOptions: {
      onSuccess: (invoice) => {
        if (step === 'source') {
          // Brouillon prérempli depuis la réservation : on passe à sa vérification
          setCurrent(invoice);
          setStep('form');
          return;
        }
        onOpenChange(false);
        onSaved(invoice);
      },
    },
  });

  const onDialogChange = ((o: boolean) =>
    !o && !saving && onOpenChange(false)) as ModalOpenProps['onChange'];
  const context = [
    current ? 'Brouillon de facture' : 'Nouvelle facture',
    current?.bookingReference && `réservation ${current.bookingReference}`,
  ]
    .filter(Boolean)
    .join(' · ');

  if (step === 'source') {
    return (
      <BaseModal
        isOpen={open}
        onChange={onDialogChange}
        size="full"
        title="Que voulez-vous facturer ?"
        description={context}
        icon={<Icons.Payment />}
        buttonCancelTitle="Annuler"
        colorCancelButton="neutral"
        buttonSaveTitle="Continuer"
        saveDisabled={source === 'booking' && !bookingId}
        isLoading={saving}
        onClick={() =>
          source === 'booking' && bookingId
            ? save({ payload: { bookingId }, params: { agencyId } })
            : setStep('form')
        }
      >
        <Stack width="full" maxW="64rem" mx="auto" gap={5}>
          <BaseRadioCard
            items={SOURCES}
            value={source}
            onValueChange={({ value }) => setSource(value as Source)}
            aria-label="Source de la facture"
          />
          {source === 'booking' && (
            <BookingPicker agencyId={agencyId} value={bookingId} onChange={setBookingId} />
          )}
        </Stack>
      </BaseModal>
    );
  }

  return (
    <Formik
      // Remonté quand le brouillon change (création depuis une réservation, autre brouillon)
      key={current?.id ?? 'new'}
      initialValues={valuesOf(current)}
      validationSchema={DRAFT_SCHEMA}
      onSubmit={(values) =>
        save({ payload: { draft: payloadOf(values) }, params: { agencyId, id: current?.id } })
      }
    >
      {({ values, handleSubmit, setFieldValue }) => (
        <BaseModal
          isOpen={open}
          onChange={onDialogChange}
          size="full"
          title="Client, lignes et échéance"
          description={context}
          icon={<Icons.Payment />}
          buttonCancelTitle="Annuler"
          colorCancelButton="neutral"
          buttonRejectTitle={current ? '' : 'Retour'}
          colorRejectButton="neutral"
          onReject={() => setStep('source')}
          buttonSaveTitle="Enregistrer le brouillon"
          isLoading={saving}
          onClick={() => handleSubmit()}
        >
          <Stack width="full" maxW="64rem" mx="auto" gap={8}>
            <Stack gap={4} as="fieldset">
              <BaseText as="legend" fontWeight="semibold" mb={2}>
                Client
              </BaseText>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <FormTextInput
                  required
                  name="client.name"
                  label="Nom ou raison sociale"
                  maxLength={120}
                  autoComplete="off"
                />
                <FormTextInput
                  name="client.email"
                  type="email"
                  label="E-mail"
                  maxLength={254}
                  autoComplete="off"
                  infoMessage="Pour lui envoyer la facture."
                />
                <FormTextInput
                  name="client.phone"
                  type="tel"
                  label="Téléphone"
                  maxLength={30}
                  autoComplete="off"
                />
                <FormTextInput
                  name="client.address"
                  label="Adresse"
                  maxLength={300}
                  autoComplete="off"
                />
              </SimpleGrid>
            </Stack>

            <InvoiceLinesField />

            <Flex gap={8} direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} flex="1" maxW="32rem">
                <FormDatePicker required name="dueAt" label="Échéance" />
                <FormSelect
                  name="templateId"
                  label="Modèle"
                  listItems={templateList}
                  setFieldValue={setFieldValue}
                  isClearable={false}
                />
              </SimpleGrid>
              <Totals lines={values.lines} vatRate={vatRate} />
            </Flex>
          </Stack>
        </BaseModal>
      )}
    </Formik>
  );
};
