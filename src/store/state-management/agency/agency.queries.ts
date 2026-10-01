import * as Constants from './constants';
import { agencyServiceInstance } from './agency.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';
import { ENTITY_QUERY_OPTIONS } from '../query-options';

const getAgencyInfo = (
  args: QUERIES.QueryPayload<MODELS.IAgency, undefined, MODELS.IAgencyCommonParams>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IAgencyCommonParams, undefined, MODELS.IAgency>({
    queryKey: [Constants.AGENCY_KEYS.AGENCY_INFO, params],
    queryFn: () => agencyServiceInstance().agency_info(params?.agencyId!),
    options: queryOptions,
  });
};

const getAgencySubscriptionInfo = (
  args: QUERIES.QueryPayload<MODELS.IAgencySubscriptionInfo, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<{ agencyId: string }, undefined, MODELS.IAgencySubscriptionInfo>({
    queryKey: [Constants.AGENCY_KEYS.AGENCY_SUBSCRIPTION_INFO, params],
    queryFn: () => agencyServiceInstance().agency_subscription_info(params?.agencyId!),
    options: queryOptions,
  });
};

/** Page « Mon abonnement » : souscription, consommation et fonctionnalités (owner). */
const getAgencySubscriptionQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencySubscriptionOverview, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<
    undefined,
    { agencyId: string },
    MODELS.IAgencySubscriptionOverview
  >({
    queryKey: [Constants.AGENCY_KEYS.AGENCY_SUBSCRIPTION, params],
    queryFn: () => agencyServiceInstance().agency_subscription(params?.agencyId!),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

/** Impact de la résiliation ; chargé à l'ouverture de la confirmation. */
const getSubscriptionCancelImpactQueries = (
  args: QUERIES.QueryPayload<MODELS.ISubscriptionCancelImpact, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { agencyId: string }, MODELS.ISubscriptionCancelImpact>({
    queryKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_CANCEL_IMPACT, params],
    queryFn: () => agencyServiceInstance().subscription_cancel_impact(params?.agencyId!),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

/** Résilie l'abonnement à la fin de la période. */
const cancelSubscriptionMutation = (
  args: QUERIES.MutationPayload<
    MODELS.ISubscriptionCancellation,
    unknown,
    { agencyId: string; feedback?: MODELS.IExitFeedback }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CANCEL_SUBSCRIPTION],
    mutationFn: ({ params }) =>
      agencyServiceInstance().cancel_subscription(params!.agencyId, params!.feedback),
    options: args.mutationOptions,
  });

/** Annule la résiliation programmée (sans paiement). */
const resumeSubscriptionMutation = (
  args: QUERIES.MutationPayload<MODELS.ISubscriptionCancellation, unknown, { agencyId: string }>,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.RESUME_SUBSCRIPTION],
    mutationFn: ({ params }) => agencyServiceInstance().resume_subscription(params!.agencyId),
    options: args.mutationOptions,
  });

/** Devis du plan et du cycle visés ; recalculé quand la sélection change. */
const getSubscriptionQuoteQueries = (
  args: QUERIES.QueryPayload<MODELS.ISubscriptionQuote, undefined, MODELS.ISubscriptionTarget>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, MODELS.ISubscriptionTarget, MODELS.ISubscriptionQuote>({
    queryKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_QUOTE, params],
    queryFn: () => agencyServiceInstance().subscription_quote(params!),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

/** Statut d'un paiement d'abonnement (suivi au retour de NabooPay). */
const getSubscriptionPaymentQueries = (
  args: QUERIES.QueryPayload<
    MODELS.ISubscriptionPaymentStatus,
    undefined,
    { agencyId: string; orderId: string }
  >,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<
    undefined,
    { agencyId: string; orderId: string },
    MODELS.ISubscriptionPaymentStatus
  >({
    queryKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_PAYMENT, params],
    queryFn: () =>
      agencyServiceInstance().subscription_payment_status(params!.agencyId, params!.orderId),
    options: queryOptions,
  });
};

/** Limites du plan et usage actif ; partagé par tous les boutons « Ajouter ». */
const getSubscriptionLimitsQueries = (
  args: QUERIES.QueryPayload<MODELS.ISubscriptionLimits, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { agencyId: string }, MODELS.ISubscriptionLimits>({
    queryKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_LIMITS, params],
    queryFn: () => agencyServiceInstance().subscription_limits(params!.agencyId),
    options: queryOptions,
  });
};

/** Historique de facturation, une page à la fois. */
const getSubscriptionPaymentsQueries = (
  args: QUERIES.QueryPayload<
    MODELS.IPaginatedResponse<MODELS.IAgencyPayment>,
    undefined,
    MODELS.IPagination
  >,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<
    undefined,
    MODELS.IPagination,
    MODELS.IPaginatedResponse<MODELS.IAgencyPayment>
  >({
    queryKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_PAYMENTS, params],
    queryFn: () => agencyServiceInstance().subscription_payments(params!),
    options: queryOptions,
  });
};

/** Checkout NabooPay d'un renouvellement, d'un upgrade ou d'une réactivation. */
const subscriptionCheckoutMutation = (
  args: QUERIES.MutationPayload<
    { target: MODELS.ISubscriptionTarget; idempotencyKey: string },
    MODELS.ISubscriptionCheckout
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_CHECKOUT],
    mutationFn: ({ payload }) =>
      agencyServiceInstance().subscription_checkout(payload!.target, payload!.idempotencyKey),
    options: args.mutationOptions,
  });

/** Programme un downgrade pour l'échéance. */
const scheduleSubscriptionChangeMutation = (
  args: QUERIES.MutationPayload<MODELS.ISubscriptionTarget>,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.SCHEDULE_SUBSCRIPTION_CHANGE],
    mutationFn: ({ payload }) => agencyServiceInstance().schedule_subscription_change(payload!),
    options: args.mutationOptions,
  });

/** Annule le downgrade programmé. */
const cancelScheduledChangeMutation = (
  args: QUERIES.MutationPayload<unknown, unknown, { agencyId: string }>,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CANCEL_SCHEDULED_CHANGE],
    mutationFn: ({ params }) => agencyServiceInstance().cancel_scheduled_change(params!.agencyId),
    options: args.mutationOptions,
  });

/** Réactive un bien désactivé par un downgrade. */
const activateAssetMutation = (
  args: QUERIES.MutationPayload<
    { type: 'PROPERTY' | 'LAND' | 'BUILDING'; id: string },
    unknown,
    { agencyId: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.ACTIVATE_ASSET],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().activate_asset(params!.agencyId, payload!),
    options: args.mutationOptions,
  });

/** Impact de la fermeture ; chargé à l'ouverture de la confirmation. */
const getCloseImpactQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyCloseImpact, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { agencyId: string }, MODELS.IAgencyCloseImpact>({
    queryKey: [Constants.AGENCY_KEYS.CLOSE_IMPACT, params],
    queryFn: () => agencyServiceInstance().close_impact(params?.agencyId!),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

const createAgencyMutation = (args: QUERIES.MutationPayload) => {
  return QUERIES.useCustomMutation<
    { data: MODELS.ICreateAgency },
    {
      message: string | { checkout_url: string; order_id: string };
    }
  >({
    mutationKey: [Constants.AGENCY_KEYS.CREATE_AGENCY],
    mutationFn: ({ payload }) => agencyServiceInstance().create_agency(payload?.data!),
    options: args.mutationOptions,
  });
};

const updateAgencyMutation = (args: QUERIES.MutationPayload<MODELS.IUpdateAgency>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.UPDATE_AGENCY],
    mutationFn: ({ payload }) => agencyServiceInstance().update_agency(payload!),
    options: args.mutationOptions,
  });
};

const closeAgencyMutation = (args: QUERIES.MutationPayload<any, any, MODELS.ICloseAgency>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CLOSE_AGENCY],
    mutationFn: ({ params }) => agencyServiceInstance().close_agency(params!),
    options: args.mutationOptions,
  });
};

/** Annule la fermeture programmée de l'agence. */
const cancelCloseMutation = (
  args: QUERIES.MutationPayload<unknown, unknown, MODELS.ICloseAgency>,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CANCEL_CLOSE],
    mutationFn: ({ params }) => agencyServiceInstance().cancel_close(params!.agencyId),
    options: args.mutationOptions,
  });

const checkNameMutation = (args: QUERIES.MutationPayload<{ name: string }>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.CHECK_NAME],
    mutationFn: ({ payload }) => agencyServiceInstance().check_name(payload?.name!),
    options: args.mutationOptions,
  });
};

const getAgencyStats = (
  args: QUERIES.QueryPayload<MODELS.IAgencyStats, undefined, MODELS.IAgencyCommonParams>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyCommonParams, MODELS.IAgencyStats>({
    queryKey: [Constants.AGENCY_KEYS.GET_STATS, params],
    queryFn: () => agencyServiceInstance().stats_agency(params?.agencyId!),
    options: queryOptions,
  });
};

export {
  createAgencyMutation,
  checkNameMutation,
  getAgencyInfo,
  updateAgencyMutation,
  closeAgencyMutation,
  getCloseImpactQueries,
  cancelCloseMutation,
  getAgencySubscriptionInfo,
  getAgencySubscriptionQueries,
  getSubscriptionQuoteQueries,
  getSubscriptionPaymentQueries,
  getSubscriptionPaymentsQueries,
  getSubscriptionLimitsQueries,
  subscriptionCheckoutMutation,
  scheduleSubscriptionChangeMutation,
  cancelScheduledChangeMutation,
  activateAssetMutation,
  getSubscriptionCancelImpactQueries,
  cancelSubscriptionMutation,
  resumeSubscriptionMutation,
  getAgencyStats,
};
