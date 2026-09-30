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
  getAgencyStats,
};
