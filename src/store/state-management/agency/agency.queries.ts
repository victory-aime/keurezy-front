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

/** Devis avec un code promo : vérifié à la demande (« Appliquer »), refus explicite sinon. */
const subscriptionPromoQuoteMutation = (
  args: QUERIES.MutationPayload<MODELS.ISubscriptionTarget, MODELS.ISubscriptionQuote>,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.SUBSCRIPTION_QUOTE, 'promo'],
    mutationFn: ({ payload }) => agencyServiceInstance().subscription_quote(payload!),
    options: args.mutationOptions,
  });

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

/** Modèles de facture et réglages de facturation de l'agence. */
const getInvoiceTemplatesQueries = (
  args: QUERIES.QueryPayload<MODELS.IInvoiceTemplatesResponse, undefined, { agencyId: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { agencyId: string }, MODELS.IInvoiceTemplatesResponse>({
    queryKey: [Constants.AGENCY_KEYS.INVOICE_TEMPLATES, params],
    queryFn: () => agencyServiceInstance().invoice_templates(params!.agencyId),
    options: queryOptions,
  });
};

/** Catalogue des variables insérables (stable : chargé une fois). */
const getInvoiceTemplateVariablesQueries = (args: QUERIES.QueryPayload<MODELS.IInvoiceVariables>) =>
  QUERIES.useCustomQuery<undefined, undefined, MODELS.IInvoiceVariables>({
    queryKey: [Constants.AGENCY_KEYS.INVOICE_TEMPLATE_VARIABLES],
    queryFn: () => agencyServiceInstance().invoice_template_variables(),
    options: { staleTime: Infinity, ...args.queryOptions },
  });

const saveInvoiceTemplateMutation = (
  args: QUERIES.MutationPayload<
    { name?: string; config: MODELS.IInvoiceTemplateConfig },
    MODELS.IInvoiceTemplate,
    { agencyId: string; id?: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.SAVE_INVOICE_TEMPLATE],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().save_invoice_template(params!.agencyId, payload!, params!.id),
    options: args.mutationOptions,
  });

const deleteInvoiceTemplateMutation = (
  args: QUERIES.MutationPayload<unknown, unknown, { agencyId: string; id: string }>,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.DELETE_INVOICE_TEMPLATE],
    mutationFn: ({ params }) =>
      agencyServiceInstance().delete_invoice_template(params!.agencyId, params!.id),
    options: args.mutationOptions,
  });

const updateInvoiceSettingsMutation = (
  args: QUERIES.MutationPayload<
    Partial<MODELS.IInvoiceSettings>,
    MODELS.IInvoiceSettings,
    { agencyId: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.UPDATE_INVOICE_SETTINGS],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().update_invoice_settings(params!.agencyId, payload!),
    options: args.mutationOptions,
  });

/** Envoie le cachet de l'agence (payload : image) ou le retire (payload absent). */
const invoiceStampMutation = (
  args: QUERIES.MutationPayload<
    File | undefined,
    { stampUrl: string | null },
    { agencyId: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.INVOICE_STAMP],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().invoice_stamp(params!.agencyId, payload ?? undefined),
    options: args.mutationOptions,
  });

/** Envoie (ou retire, sans fichier) une pièce justificative ; la réponse dit ce qui manque. */
const legalProofMutation = (
  args: QUERIES.MutationPayload<
    File | undefined,
    MODELS.IAgencyLegalUpdate,
    { agencyId: string; kind: MODELS.LegalProofKind }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.LEGAL_PROOF],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().legal_proof(params!.agencyId, params!.kind, payload ?? undefined),
    options: args.mutationOptions,
  });

/** Factures de l'agence, une page à la fois. */
const getInvoicesQueries = (
  args: QUERIES.QueryPayload<MODELS.IInvoiceList, undefined, MODELS.IInvoiceListParams>,
) =>
  QUERIES.useCustomQuery<undefined, MODELS.IInvoiceListParams, MODELS.IInvoiceList>({
    queryKey: [Constants.AGENCY_KEYS.INVOICES, args.params],
    queryFn: () => agencyServiceInstance().invoices(args.params!),
    options: args.queryOptions,
  });

const getInvoiceQueries = (
  args: QUERIES.QueryPayload<MODELS.IInvoice, undefined, { agencyId: string; id: string }>,
) =>
  QUERIES.useCustomQuery<undefined, { agencyId: string; id: string }, MODELS.IInvoice>({
    queryKey: [Constants.AGENCY_KEYS.INVOICE, args.params],
    queryFn: () => agencyServiceInstance().invoice(args.params!.agencyId, args.params!.id),
    options: args.queryOptions,
  });

const getInvoiceableBookingsQueries = (
  args: QUERIES.QueryPayload<MODELS.IInvoiceableBooking[], undefined, { agencyId: string }>,
) =>
  QUERIES.useCustomQuery<undefined, { agencyId: string }, MODELS.IInvoiceableBooking[]>({
    queryKey: [Constants.AGENCY_KEYS.INVOICEABLE_BOOKINGS, args.params],
    queryFn: () => agencyServiceInstance().invoiceable_bookings(args.params!.agencyId),
    options: args.queryOptions,
  });

const saveInvoiceMutation = (
  args: QUERIES.MutationPayload<
    { bookingId?: string; draft?: MODELS.IInvoiceDraft },
    MODELS.IInvoice,
    { agencyId: string; id?: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.SAVE_INVOICE],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().save_invoice(params!.agencyId, payload!, params!.id),
    options: args.mutationOptions,
  });

const invoiceActionMutation = (
  args: QUERIES.MutationPayload<
    { action: 'issue' | 'pay' | 'cancel' | 'delete' | 'send'; body?: object },
    MODELS.IInvoice,
    { agencyId: string; id: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.INVOICE_ACTION],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().invoice_action(
        params!.agencyId,
        params!.id,
        payload!.action,
        payload!.body,
      ),
    options: args.mutationOptions,
  });

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

/** Informations légales (owner) ; la réponse dit si la vérification a été retirée. */
const updateAgencyLegalMutation = (
  args: QUERIES.MutationPayload<
    Partial<MODELS.IAgencyLegal>,
    MODELS.IAgencyLegalUpdate,
    { agencyId: string }
  >,
) =>
  QUERIES.useCustomMutation({
    mutationKey: [Constants.AGENCY_KEYS.UPDATE_LEGAL],
    mutationFn: ({ payload, params }) =>
      agencyServiceInstance().update_legal(params!.agencyId, payload!),
    options: args.mutationOptions,
  });

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
  updateAgencyLegalMutation,
  getInvoiceTemplatesQueries,
  getInvoiceTemplateVariablesQueries,
  saveInvoiceTemplateMutation,
  deleteInvoiceTemplateMutation,
  updateInvoiceSettingsMutation,
  invoiceStampMutation,
  legalProofMutation,
  getInvoicesQueries,
  getInvoiceQueries,
  getInvoiceableBookingsQueries,
  saveInvoiceMutation,
  invoiceActionMutation,
  getCloseImpactQueries,
  cancelCloseMutation,
  getAgencySubscriptionInfo,
  getAgencySubscriptionQueries,
  getSubscriptionQuoteQueries,
  subscriptionPromoQuoteMutation,
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
