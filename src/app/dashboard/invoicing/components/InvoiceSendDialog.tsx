'use client';

import { Field, Input, Stack, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { BaseModal, BaseText, Icons, ModalOpenProps, TextVariant } from '_components/custom';
import { MODELS } from '_types/*';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
}) => {
  const [to, setTo] = useState(invoice.client.email ?? '');
  const [message, setMessage] = useState('');
  const valid = EMAIL.test(to.trim());
  const resend = !!invoice.emails?.length;

  return (
    <BaseModal
      isOpen
      onChange={((o: boolean) => !o && onClose()) as ModalOpenProps['onChange']}
      title={resend ? 'Renvoyer la facture' : 'Envoyer la facture'}
      icon={<Icons.Send />}
      size="sm"
      buttonCancelTitle="Annuler"
      buttonSaveTitle="Envoyer"
      isLoading={isSubmitting}
      saveDisabled={!valid}
      onClick={() => valid && onConfirm({ to: to.trim(), message: message.trim() || undefined })}
    >
      <Stack gap={4}>
        <BaseText variant={TextVariant.S}>
          La facture {invoice.number} est envoyée en PDF. Le client pourra répondre directement à
          l’agence.
        </BaseText>
        <Field.Root required invalid={!!to && !valid}>
          <Field.Label>Destinataire</Field.Label>
          <Input
            type="email"
            value={to}
            maxLength={254}
            placeholder="client@exemple.sn"
            onChange={(e) => setTo(e.target.value)}
          />
          <Field.ErrorText>Adresse e-mail invalide.</Field.ErrorText>
        </Field.Root>
        <Field.Root>
          <Field.Label>Message (facultatif)</Field.Label>
          <Textarea
            value={message}
            maxLength={1000}
            rows={4}
            placeholder="Ex. : Merci pour votre confiance."
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field.Root>
      </Stack>
    </BaseModal>
  );
};
