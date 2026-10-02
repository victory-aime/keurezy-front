import { Flex, Stack } from '@chakra-ui/react';
import {
  BaseButton,
  BaseFormatNumber,
  BaseText,
  TextVariant,
  CustomSkeletonLoader,
} from '_components/custom';
import { ENUM, MODELS } from '_types/*';
import { formatLongDate } from '_utils/subscription';
import { KeepSelection } from './KeepSelection';

interface QuoteReviewProps {
  quote: MODELS.ISubscriptionQuote | undefined;
  isLoading: boolean;
  isError: boolean;
  isRetrying?: boolean;
  onRetry: () => void;
  planName: string;
  /** Échéance actuelle, pour dire si elle change */
  currentPeriodEnd: string | null;
  keep: Record<string, string[]>;
  onKeepChange: (keep: Record<string, string[]>) => void;
  /** Le plan visé est le Gratuit (ni paiement, ni échéance) */
  targetFree?: boolean;
  /** L'agence quitte le Gratuit : un changement de plan, pas une réactivation */
  fromFree?: boolean;
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
  isRetrying = false,
  onRetry,
  planName,
  currentPeriodEnd,
  keep,
  onKeepChange,
  targetFree = false,
  fromFree = false,
}: QuoteReviewProps) => {
  if (isLoading) {
    return (
      <Stack gap={3} aria-busy="true" aria-label="Calcul du montant">
        <CustomSkeletonLoader type="DEFAULT" height="24px" width="60%" />
        <CustomSkeletonLoader type="DEFAULT" height="72px" />
      </Stack>
    );
  }
  if (isError || !quote) {
    return (
      <Stack gap={3} alignItems="flex-start" role="alert">
        <BaseText variant={TextVariant.S} color="fg.muted">
          Impossible de calculer le montant pour le moment.
        </BaseText>
        <BaseButton
          variant="outline"
          colorType="primary"
          size="sm"
          isLoading={isRetrying}
          disabled={isRetrying}
          onClick={onRetry}
        >
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
    REACTIVATION:
      fromFree || targetFree
        ? `Passage au plan ${planName}`
        : `Réactivation sur le plan ${planName}`,
    DOWNGRADE: `Passage au plan ${planName} le ${start}`,
  };

  return (
    <Stack gap={5}>
      <BaseText variant={TextVariant.L} fontWeight="semibold">
        {titles[quote.kind]}
      </BaseText>

      <Stack gap={2} p={4} rounded="7px" bg="bg.subtle">
        {quote.kind === 'DOWNGRADE' ? (
          <>
            <Line label="À payer aujourd’hui">
              <Amount quote={{ ...quote, amount: 0 }} />
            </Line>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Vous gardez votre plan actuel jusqu’au {start}.{' '}
              {targetFree
                ? 'Le plan Gratuit prend le relais à cette date, sans paiement ni échéance.'
                : 'Le nouveau plan sera à renouveler à cette date.'}
            </BaseText>
          </>
        ) : targetFree ? (
          <>
            <Line label="À payer aujourd’hui">
              <Amount quote={{ ...quote, amount: 0 }} />
            </Line>
            <BaseText variant={TextVariant.S} color="fg.muted">
              Votre agence repasse en ligne dès la confirmation. Le plan Gratuit n’a pas d’échéance.
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
          effectiveLabel={
            quote.kind === 'DOWNGRADE'
              ? `le ${start}`
              : targetFree
                ? 'dès la confirmation'
                : 'dès le paiement'
          }
        />
      )}
    </Stack>
  );
};
