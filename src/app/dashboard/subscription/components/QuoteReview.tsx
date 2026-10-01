import { Flex, Skeleton, Stack } from '@chakra-ui/react';
import { BaseButton, BaseFormatNumber, BaseText, TextVariant } from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { formatLongDate } from '_utils/subscription';
import { KeepSelection } from './KeepSelection';

interface QuoteReviewProps {
  quote: MODELS.ISubscriptionQuote | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  planName: string;
  /** Échéance actuelle, pour dire si elle change */
  currentPeriodEnd: string | null;
  keep: Record<string, string[]>;
  onKeepChange: (keep: Record<string, string[]>) => void;
}

const Amount = ({ quote }: { quote: MODELS.ISubscriptionQuote }) => (
  <BaseFormatNumber value={quote.amount} currencyCode={quote.currency as ENUM.COMMON.Currency} />
);

/** Ligne « libellé : valeur » du récapitulatif. */
const Line = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Flex justifyContent="space-between" gap={4} wrap="wrap">
    <BaseText variant={TextVariant.S} color="fg.muted">
      {label}
    </BaseText>
    <BaseText variant={TextVariant.S} fontWeight="semibold">
      {children}
    </BaseText>
  </Flex>
);

/**
 * Étape « Vérifier » : récapitulatif du devis renvoyé par le backend (montant et dates), sans
 * aucun calcul local. Downgrade et réactivation sur un plan plus petit : choix des éléments gardés.
 */
export const QuoteReview = ({
  quote,
  isLoading,
  isError,
  onRetry,
  planName,
  currentPeriodEnd,
  keep,
  onKeepChange,
}: QuoteReviewProps) => {
  if (isLoading) {
    return (
      <Stack gap={3} aria-busy="true" aria-label="Calcul du montant">
        <Skeleton height="24px" width="60%" />
        <Skeleton height="72px" rounded="7px" />
      </Stack>
    );
  }
  if (isError || !quote) {
    return (
      <Stack gap={3} alignItems="flex-start" role="alert">
        <BaseText variant={TextVariant.S} color="fg.muted">
          Impossible de calculer le montant pour le moment.
        </BaseText>
        <BaseButton variant="outline" colorType="primary" size="sm" onClick={onRetry}>
          Réessayer
        </BaseButton>
      </Stack>
    );
  }

  const start = formatLongDate(quote.effectiveAt);
  const end = formatLongDate(quote.newPeriodEnd);
  const titles: Record<MODELS.SubscriptionQuoteKind, string> = {
    UPGRADE: `Passage au plan ${planName}`,
    RENEWAL: `Renouvellement du plan ${planName}`,
    REACTIVATION: `Réactivation sur le plan ${planName}`,
    DOWNGRADE: `Passage au plan ${planName} le ${start}`,
  };

  return (
    <Stack gap={5}>
      <BaseText as="h3" variant={TextVariant.L} fontWeight="semibold">
        {titles[quote.kind]}
      </BaseText>

      <Stack gap={2} p={4} rounded="7px" bg="bg.subtle">
        {quote.kind === 'DOWNGRADE' ? (
          <>
            <Line label="À payer aujourd’hui">Rien</Line>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Vous gardez votre plan actuel jusqu’au {start}. Le nouveau plan sera à renouveler à
              cette date.
            </BaseText>
          </>
        ) : (
          <>
            <Line label="À payer aujourd’hui">
              <Amount quote={quote} />
            </Line>
            {quote.kind === 'UPGRADE' && quote.newPeriodEnd === currentPeriodEnd ? (
              <Line label="Prochaine échéance inchangée">{end}</Line>
            ) : (
              <Line label="Nouvelle période">
                du {start} au {end}
              </Line>
            )}
            {quote.kind === 'UPGRADE' && (
              <BaseText variant={TextVariant.XS} color="fg.muted">
                Les nouvelles limites s’appliquent dès la confirmation du paiement. Le montant tient
                compte des jours restants sur votre période.
              </BaseText>
            )}
            <BaseText variant={TextVariant.XS} color="fg.muted">
              Paiement par Wave ou Orange Money sur la page sécurisée de NabooPay.
            </BaseText>
          </>
        )}
      </Stack>

      {quote.excess.length > 0 && (
        <KeepSelection
          excess={quote.excess}
          keep={keep}
          onChange={onKeepChange}
          effectiveLabel={quote.kind === 'DOWNGRADE' ? `le ${start}` : 'dès le paiement'}
        />
      )}
    </Stack>
  );
};
