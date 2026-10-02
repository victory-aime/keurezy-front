'use client';

import { Box, Grid, Stack } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import * as Yup from 'yup';
import {
  BaseButton,
  BaseFormatNumber,
  BaseIconButton,
  BaseText,
  FormTextInput,
  Icons,
  TextVariant,
} from '_components/custom';
import { ENUM, MODELS } from '_types/*';

export const MAX_LINES = 50;
export const EMPTY_LINE: MODELS.IInvoiceLine = {
  description: '',
  period: '',
  quantity: 1,
  unitPrice: 0,
};

/** Une ligne : désignation, quantité positive, prix entier positif ou nul (comme le backend). */
export const LINE_SCHEMA = Yup.object({
  description: Yup.string().trim().required('Indiquez la désignation.').max(200),
  period: Yup.string().nullable().max(100),
  quantity: Yup.number()
    .typeError('Quantité invalide.')
    .moreThan(0, 'Quantité positive.')
    .required('Quantité requise.'),
  unitPrice: Yup.number()
    .typeError('Prix invalide.')
    .integer('Prix en francs entiers.')
    .min(0, 'Prix positif ou nul.')
    .required('Prix requis.'),
});

const COLUMNS = { base: '1fr', md: 'minmax(0, 3fr) minmax(0, 2fr) 90px 140px 120px 40px' };

/**
 * Lignes d'une facture dans le formulaire Formik parent (`lines`) : désignation, période
 * (facultative), quantité, prix unitaire HT et total de la ligne. Une rangée par ligne sur grand
 * écran, des cartes empilées sur mobile.
 */
export const InvoiceLinesField = () => {
  const { values, setFieldValue } = useFormikContext<{ lines: MODELS.IInvoiceLine[] }>();
  const lines = values.lines;

  return (
    <Stack gap={3} as="fieldset">
      <BaseText as="legend" fontWeight="semibold" mb={2}>
        Lignes
      </BaseText>
      {lines.map((line, index) => {
        const name = `lines.${index}`;
        const total = Math.round((Number(line.quantity) || 0) * (Number(line.unitPrice) || 0));
        return (
          <Grid
            key={index}
            templateColumns={COLUMNS}
            gap={3}
            alignItems="end"
            p={{ base: 3, md: 1 }}
            borderWidth={{ base: '1px', md: 0 }}
            borderColor="border"
            rounded="7px"
          >
            <FormTextInput
              required
              name={`${name}.description`}
              label="Désignation"
              maxLength={200}
              placeholder="Loyer, frais de dossier…"
            />
            <FormTextInput
              name={`${name}.period`}
              label="Période (facultatif)"
              maxLength={100}
              placeholder="Du 01/11 au 30/11"
            />
            <FormTextInput
              required
              name={`${name}.quantity`}
              label="Qté"
              type="number"
              inputMode="decimal"
              min={0.01}
              step="any"
            />
            <FormTextInput
              required
              name={`${name}.unitPrice`}
              label="Prix unitaire HT"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
            />
            <BaseText
              variant={TextVariant.S}
              fontWeight="medium"
              textAlign={{ base: 'start', md: 'end' }}
              pb={2}
            >
              <Box as="span" hideFrom="md" color="fg.muted" fontWeight="normal">
                Total HT :{' '}
              </Box>
              <BaseFormatNumber value={total} currencyCode={ENUM.COMMON.Currency.XOF} />
            </BaseText>
            <BaseIconButton
              label={`Retirer la ligne ${index + 1}`}
              colorType="danger"
              disabled={lines.length <= 1}
              mb={1}
              onClick={() =>
                setFieldValue(
                  'lines',
                  lines.filter((_, i) => i !== index),
                )
              }
            >
              <Icons.Trash aria-hidden />
            </BaseIconButton>
          </Grid>
        );
      })}
      <Box>
        <BaseButton
          size="sm"
          variant="outline"
          colorType="primary"
          disabled={lines.length >= MAX_LINES}
          onClick={() => setFieldValue('lines', [...lines, { ...EMPTY_LINE }])}
        >
          Ajouter une ligne
        </BaseButton>
      </Box>
    </Stack>
  );
};
