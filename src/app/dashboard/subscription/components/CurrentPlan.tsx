import { Box, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { BaseBadge, BaseFormatNumber, BaseText, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';

type Subscription = NonNullable<MODELS.IAgencySubscriptionOverview['subscription']>;

/** « 30 octobre 2026 » */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

/** Montant et cycle, ex. « 10 000 F CFA / mois » ; rien si le prix est inconnu. */
const Price = ({ subscription }: { subscription: Subscription }) => {
  if (subscription.price === null) return null;
  return (
    <Flex alignItems="baseline" gap={1}>
      <BaseText variant={TextVariant.XL} fontWeight="semibold">
        <BaseFormatNumber
          value={subscription.price}
          currencyCode={(subscription.currency ?? undefined) as ENUM.COMMON.Currency | undefined}
        />
      </BaseText>
      {subscription.billingCycle && (
        <BaseText variant={TextVariant.S} color="fg.muted">
          {subscription.billingCycle === 'YEARLY' ? '/ an' : '/ mois'}
        </BaseText>
      )}
    </Flex>
  );
};

/** Statut affiché : le backend expose ACTIVE / INACTIVE et le drapeau de résiliation. */
const StatusBadge = ({ subscription }: { subscription: Subscription }) => {
  if (subscription.status === 'INACTIVE') {
    return (
      <BaseBadge status={ENUM.COMMON.Status.INACTIVE} label="Inactif" variant="subtle" size="sm" />
    );
  }
  if (subscription.cancelAtPeriodEnd) {
    return (
      <BaseBadge
        status={ENUM.COMMON.Status.PENDING}
        label="Résiliation programmée"
        variant="subtle"
        size="sm"
      />
    );
  }
  return <BaseBadge status={ENUM.COMMON.Status.ACTIVE} label="Actif" variant="subtle" size="sm" />;
};

/** Petit libellé au-dessus d'une valeur. */
const Eyebrow = ({ children }: { children: string }) => (
  <BaseText
    variant={TextVariant.XS}
    color="fg.muted"
    textTransform="uppercase"
    letterSpacing="wide"
  >
    {children}
  </BaseText>
);

/**
 * Plan actuel et échéance, côte à côte à partir de `md`. Aucun montant n'est calculé ici :
 * prix, cycle et dates sont ceux de la souscription renvoyée par le backend.
 */
export const CurrentPlan = ({ subscription }: { subscription: Subscription }) => {
  const { currentPeriodStart: start, currentPeriodEnd: end } = subscription;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      <Stack gap={2} p={4} rounded="7px" bg="bg.subtle">
        <Eyebrow>Plan actuel</Eyebrow>
        <Flex alignItems="center" gap={3} wrap="wrap">
          <BaseText variant={TextVariant.L} fontWeight="semibold">
            {t(`SUBSCRIPTION.PLANS.${subscription.plan.name}`)}
          </BaseText>
          <StatusBadge subscription={subscription} />
        </Flex>
        <BaseText variant={TextVariant.S} color="fg.muted">
          {t(`SUBSCRIPTION.PLANS.DESCRIPTIONS.${subscription.plan.name}`)}
        </BaseText>
        <Price subscription={subscription} />
        {start && end && (
          <BaseText variant={TextVariant.S} color="fg.muted">
            Période du {formatDate(start)} au {formatDate(end)}
          </BaseText>
        )}
      </Stack>

      <Stack gap={2} p={4} rounded="7px" borderWidth="1px" borderColor="border" role="status">
        {subscription.status === 'INACTIVE' ? (
          <>
            <Eyebrow>Abonnement inactif</Eyebrow>
            <BaseText variant={TextVariant.M} fontWeight="semibold">
              {end ? `Terminé le ${formatDate(end)}` : 'Aucune période en cours'}
            </BaseText>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Votre tableau de bord reste consultable.
            </BaseText>
          </>
        ) : subscription.cancelAtPeriodEnd ? (
          <>
            <Eyebrow>Résiliation programmée</Eyebrow>
            <BaseText variant={TextVariant.M} fontWeight="semibold">
              {end
                ? `Votre abonnement reste actif jusqu’au ${formatDate(end)}.`
                : 'Votre abonnement reste actif jusqu’à la fin de la période.'}
            </BaseText>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Aucun renouvellement ne sera demandé.
            </BaseText>
          </>
        ) : (
          <>
            <Eyebrow>Prochaine échéance</Eyebrow>
            {end ? (
              <BaseText variant={TextVariant.XL} fontWeight="semibold">
                {formatDate(end)}
              </BaseText>
            ) : (
              <BaseText variant={TextVariant.S} color="fg.muted">
                Aucune échéance n’est enregistrée pour cet abonnement.
              </BaseText>
            )}
            <Box>
              <Price subscription={subscription} />
            </Box>
            {subscription.billingCycle && (
              <BaseText variant={TextVariant.S} color="fg.muted">
                Renouvellement{' '}
                {t(`SUBSCRIPTION.BILLING_CYCLE.${subscription.billingCycle}`).toLowerCase()}
              </BaseText>
            )}
          </>
        )}
      </Stack>
    </SimpleGrid>
  );
};
