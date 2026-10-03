import { HStack, SimpleGrid } from '@chakra-ui/react';
import { BaseButton, FormPhonePicker, FormTextInput } from '_components/custom';
import { BANK_FIELD_LABELS, changesIdentity, toPayload } from '_utils/agency-legal';
import { Panel } from './Panel';
import { Formik } from 'formik';
import { MODELS } from '_types/*';
import { AgencyModule } from '_store/state-management';

export const AgencyFacturation = ({
  agency,
  onSaved,
}: {
  agency: MODELS.IAgency | undefined;
  onSaved: () => void;
}) => {
  if (!agency) return;

  const { mutateAsync: save, isPending: saving } = AgencyModule.updateAgencyLegalMutation({
    mutationOptions: {
      onSuccess: () => {
        onSaved();
      },
    },
  });

  const submit = (
    values: Pick<
      MODELS.IAgencyLegal,
      'billingAddress' | 'billingEmail' | 'bankName' | 'bankAccount' | 'mobileMoneyNumber'
    >,
  ) => {
    const payload = toPayload(values);
    if (agency.isVerified && changesIdentity(agency, payload)) {
    } else save({ payload, params: { agencyId: agency.id } });
  };

  return (
    <Formik
      initialValues={{
        billingAddress: agency.billingAddress ?? agency.address ?? '',
        billingEmail: agency.billingEmail ?? agency.email ?? '',
        bankName: agency.bankName ?? '',
        bankAccount: agency.bankAccount ?? '',
        mobileMoneyNumber: agency.mobileMoneyNumber ?? '',
      }}
      onSubmit={submit}
    >
      {({ handleSubmit }) => (
        <>
          <Panel title="Facturation" description="Imprimées sur vos factures.">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <FormTextInput name="billingAddress" label="Adresse de facturation" />
              <FormTextInput name="billingEmail" label="E-mail de facturation" type="email" />
            </SimpleGrid>
          </Panel>
          <Panel
            title="Coordonnées de paiement (facultatif)"
            description="Imprimées sur vos factures quand le modèle affiche ce bloc."
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <FormTextInput name="bankName" label={BANK_FIELD_LABELS.bankName} />
              <FormTextInput
                name="bankAccount"
                label={BANK_FIELD_LABELS.bankAccount}
                placeholder="SN012 01001 012345678901 85"
              />
              <FormPhonePicker
                name="mobileMoneyNumber"
                label={BANK_FIELD_LABELS.mobileMoneyNumber}
                placeholder="+221 77 000 00 00"
                listAvailableCountries={['sn']}
              />
            </SimpleGrid>
            <HStack justifyContent="flex-end" mt={5}>
              <BaseButton
                colorType="primary"
                isLoading={saving}
                disabled={saving}
                onClick={() => handleSubmit()}
              >
                Enregistrer
              </BaseButton>
            </HStack>
          </Panel>
        </>
      )}
    </Formik>
  );
};
