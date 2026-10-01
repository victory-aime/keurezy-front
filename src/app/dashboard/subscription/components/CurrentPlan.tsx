import { Box, Flex, SimpleGrid, Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { BaseBadge, BaseButton, BaseFormatNumber, BaseText, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { canRenew, formatLongDate, isFreePlan } from '_utils/subscription';

type Subscription = NonNullable<MODELS.IAgencySubscriptionOverview['subscription']>;

const formatDate = formatLongDate;

/** Montant et cycle, ex. « 10 000 F CFA / mois » ; rien si le prix est inconnu. */
const Price = ({ subscription }: { subscription: Subscription }) => {
  if (subscription.price === null) return null;
  if (isFreePlan(subscription.plan)) {
    return (
      <BaseText variant={TextVariant.XL} fontWeight="semibold">
        Gratuit
      </BaseText>
    );
  }
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
export const CurrentPlan = ({
  subscription,
  onRenew,
}: {
  subscription: Subscription;
  /** Ouvre le paiement du renouvellement (ou de la réactivation après expiration) */
  onRenew: () => void;
}) => {
  const { currentPeriodStart: start, currentPeriodEnd: end } = subscription;
  const renewable = canRenew(subscription, new Date());

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
              Votre tableau de bord reste consultable. Réactivez votre abonnement pour remettre vos
              annonces en ligne.
            </BaseText>
            <Box>
              <BaseButton colorType="primary" size="sm" onClick={onRenew}>
                Réactiver mon abonnement
              </BaseButton>
            </Box>
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
        ) : isFreePlan(subscription.plan) ? (
          <>
            <Eyebrow>Sans échéance</Eyebrow>
            <BaseText variant={TextVariant.M} fontWeight="semibold">
              Le plan Gratuit n’expire pas.
            </BaseText>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Aucun paiement n’est demandé. Passez à un plan supérieur pour lever ses limites.
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
            {renewable && (
              <Box>
                <BaseButton colorType="primary" size="sm" onClick={onRenew}>
                  Renouveler
                </BaseButton>
              </Box>
            )}
          </>
        )}
      </Stack>
    </SimpleGrid>
  );
};
