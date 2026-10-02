'use client';

import { Stack } from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  BaseModal,
  BaseText,
  FormTextArea,
  FormTextInput,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { MODELS } from '_types/*';

const sendSchema = Yup.object({
  to: Yup.string()
    .trim()
    .required('Indiquez le destinataire.')
    .email('Adresse e-mail invalide.')
    .max(254, 'Adresse trop longue.'),
  message: Yup.string().trim().max(1000, 'Le message ne doit pas dépasser 1 000 caractères.'),
});

/**
 * Envoi d'une facture émise ou payée par e-mail, PDF joint : destinataire prérempli avec
 * l'e-mail du client (modifiable) et message facultatif. Le client répond à l'agence.
 */
export const InvoiceSendDialog = ({
  invoice,
  onClose,
  onConfirm,
  isSubmitting,
}: {
  invoice: MODELS.IInvoice;
  onClose: () => void;
  onConfirm: (body: { to: string; message?: string }) => void;
  isSubmitting: boolean;
}) => (
  <Formik
    initialValues={{ to: invoice.client.email ?? '', message: '' }}
    validationSchema={sendSchema}
    onSubmit={({ to, message }) =>
      onConfirm({ to: to.trim(), message: message.trim() || undefined })
    }
  >
    {({ handleSubmit }) => (
      <BaseModal
        isOpen
        onChange={((o: boolean) => !o && onClose()) as ModalOpenProps['onChange']}
        title={invoice.emails?.length ? 'Renvoyer la facture' : 'Envoyer la facture'}
        icon={<Icons.Send />}
        size="sm"
        buttonCancelTitle="Annuler"
        buttonSaveTitle="Envoyer"
        isLoading={isSubmitting}
        onClick={() => handleSubmit()}
      >
        <Stack gap={4}>
          <BaseText variant={TextVariant.S}>
            La facture {invoice.number} est envoyée en PDF. Le client pourra répondre directement à
            l’agence.
          </BaseText>
          <FormTextInput
            required
            name="to"
            type="email"
            label="Destinataire"
            placeholder="client@exemple.sn"
          />
          <FormTextArea
            name="message"
            label="Message (facultatif)"
            placeholder="Ex. : Merci pour votre confiance."
            maxCharacters={1000}
          />
        </Stack>
      </BaseModal>
    )}
  </Formik>
);
