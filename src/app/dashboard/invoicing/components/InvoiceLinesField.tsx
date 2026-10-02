'use client';

import { Box, Field, Grid, IconButton, Input, Stack } from '@chakra-ui/react';
import { BaseButton, BaseFormatNumber, BaseText, Icons, TextVariant } from '_components/custom';
import { Tooltip } from '_components/ui/tooltip';
import { ENUM, MODELS } from '_types/*';

export const MAX_LINES = 50;
export const EMPTY_LINE: MODELS.IInvoiceLine = {
  description: '',
  period: '',
  quantity: 1,
  unitPrice: 0,
};

/** Une ligne est complète : désignation, quantité positive, prix entier positif ou nul. */
export const lineValid = (l: MODELS.IInvoiceLine) =>
  l.description.trim().length > 0 &&
  Number(l.quantity) > 0 &&
  Number.isInteger(Number(l.unitPrice)) &&
  Number(l.unitPrice) >= 0;

const COLUMNS = { base: '1fr', md: 'minmax(0, 3fr) minmax(0, 2fr) 90px 140px 120px 40px' };

/**
 * Lignes d'une facture : désignation, période (facultative), quantité, prix unitaire HT et
 * total de la ligne. Tableau sur grand écran, cartes empilées sur mobile.
 */
export const InvoiceLinesField = ({
  lines,
  onChange,
}: {
  lines: MODELS.IInvoiceLine[];
  onChange: (lines: MODELS.IInvoiceLine[]) => void;
}) => {
  const update = (index: number, patch: Partial<MODELS.IInvoiceLine>) =>
    onChange(lines.map((l, i) => (i === index ? { ...l, ...patch } : l)));

  return (
    <Stack gap={3} as="fieldset">
      <BaseText as="legend" fontWeight="semibold" mb={2}>
        Lignes
      </BaseText>
      <Grid
        templateColumns={COLUMNS}
        gap={3}
        hideBelow="md"
        px={1}
        color="fg.muted"
        fontSize="xs"
        aria-hidden
      >
        <span>Désignation</span>
        <span>Période (facultatif)</span>
        <span>Qté</span>
        <span>Prix unitaire HT</span>
        <Box textAlign="end">Total HT</Box>
        <span />
      </Grid>
      {lines.map((line, index) => {
        const label = `ligne ${index + 1}`;
        const total = Math.round((Number(line.quantity) || 0) * (Number(line.unitPrice) || 0));
        return (
          <Grid
            key={index}
            templateColumns={COLUMNS}
            gap={3}
            alignItems="center"
            p={{ base: 3, md: 1 }}
            borderWidth={{ base: '1px', md: 0 }}
            borderColor="border"
            rounded="7px"
          >
            <Field.Root required invalid={!line.description.trim()}>
              <Field.Label hideFrom="md">Désignation</Field.Label>
              <Input
                aria-label={`Désignation, ${label}`}
                value={line.description}
                maxLength={200}
                placeholder="Loyer, frais de dossier…"
                onChange={(e) => update(index, { description: e.target.value })}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label hideFrom="md">Période (facultatif)</Field.Label>
              <Input
                aria-label={`Période, ${label}`}
                value={line.period ?? ''}
                maxLength={100}
                placeholder="Du 01/11 au 30/11"
                onChange={(e) => update(index, { period: e.target.value })}
              />
            </Field.Root>
            <Field.Root invalid={!(Number(line.quantity) > 0)}>
              <Field.Label hideFrom="md">Quantité</Field.Label>
              <Input
                aria-label={`Quantité, ${label}`}
                type="number"
                inputMode="decimal"
                min={0.01}
                step="any"
                value={Number.isFinite(line.quantity) ? line.quantity : ''}
                onChange={(e) => update(index, { quantity: e.target.valueAsNumber })}
              />
            </Field.Root>
            <Field.Root invalid={!Number.isInteger(Number(line.unitPrice))}>
              <Field.Label hideFrom="md">Prix unitaire HT (F CFA)</Field.Label>
              <Input
                aria-label={`Prix unitaire HT en francs CFA, ${label}`}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={Number.isFinite(line.unitPrice) ? line.unitPrice : ''}
                onChange={(e) => update(index, { unitPrice: e.target.valueAsNumber })}
              />
            </Field.Root>
            <BaseText
              variant={TextVariant.S}
              fontWeight="medium"
              textAlign={{ base: 'start', md: 'end' }}
            >
              <Box as="span" hideFrom="md" color="fg.muted" fontWeight="normal">
                Total HT :{' '}
              </Box>
              <BaseFormatNumber value={total} currencyCode={ENUM.COMMON.Currency.XOF} />
            </BaseText>
            <Tooltip content="Retirer la ligne" showArrow disabled={lines.length <= 1}>
              <IconButton
                aria-label={`Retirer la ${label}`}
                size="sm"
                variant="ghost"
                colorPalette="red"
                disabled={lines.length <= 1}
                onClick={() => onChange(lines.filter((_, i) => i !== index))}
              >
                <Icons.Trash aria-hidden />
              </IconButton>
            </Tooltip>
          </Grid>
        );
      })}
      <Box>
        <BaseButton
          size="sm"
          variant="outline"
          colorType="primary"
          disabled={lines.length >= MAX_LINES}
          onClick={() => onChange([...lines, { ...EMPTY_LINE }])}
        >
          Ajouter une ligne
        </BaseButton>
      </Box>
    </Stack>
  );
};
