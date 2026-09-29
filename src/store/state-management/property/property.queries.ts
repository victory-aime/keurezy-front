import { ENTITY_QUERY_OPTIONS } from '../query-options';
import * as Constants from './constants';
import { propertyServiceInstance } from './property.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllPropertiesByAgency = (
  args: QUERIES.QueryPayload<
    MODELS.IPaginatedResponse<MODELS.IPropertyResponse>,
    undefined,
    MODELS.IAgencyFilters
  >,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<
    undefined,
    MODELS.IAgencyFilters,
    MODELS.IPaginatedResponse<MODELS.IPropertyResponse>
  >({
    queryKey: [Constants.PROPERTIES_KEYS.ALL_PROPERTIES_BY_AGENCY, params],
    queryFn: () =>
      propertyServiceInstance().getAllPropertyByAgency(params as MODELS.IAgencyFilters),
    options: queryOptions,
  });
};

const getOccupationRateByTypeQueries = (
  args: QUERIES.QueryPayload<MODELS.IOccupationRateStats[], undefined, MODELS.IAgencyFilters>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyFilters, MODELS.IOccupationRateStats[]>({
    queryKey: [Constants.PROPERTIES_KEYS.OCCUPATION_RATE_BY_PROPERTY_TYPE, params],
    queryFn: () =>
      propertyServiceInstance().getOccupationRateByType(params as MODELS.IAgencyCommonParams),
    options: queryOptions,
  });
};
const getMonthlyRevenueQueries = (
  args: QUERIES.QueryPayload<MODELS.IMonthlyRevenueStats[], undefined, MODELS.IAgencyFilters>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<undefined, MODELS.IAgencyFilters, MODELS.IMonthlyRevenueStats[]>({
    queryKey: [Constants.PROPERTIES_KEYS.MONTHLY_REVENUE, params],
    queryFn: () =>
      propertyServiceInstance().getMonthlyRevenue(params as MODELS.IAgencyCommonParams),
    options: queryOptions,
  });
};

const createPropertyMutation = (args: QUERIES.MutationPayload<MODELS.ICreateProperty>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.PROPERTIES_KEYS.CREATE_PROPERTY],
    mutationFn: ({ payload }) => propertyServiceInstance().create_property(payload!),
    options: args.mutationOptions,
  });
};

const updatePropertyMutation = (
  args: QUERIES.MutationPayload<MODELS.ICreateProperty, any, { appartId: string }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.PROPERTIES_KEYS.UPDATE_PROPERTY],
    mutationFn: ({ payload, params }) =>
      propertyServiceInstance().update_property(payload!, params!),
    options: args.mutationOptions,
  });
};

/** Détail d'un bien ; chargé à l'ouverture du panneau. */
const getPropertyDetailQueries = (
  args: QUERIES.QueryPayload<MODELS.IPropertyDetail, undefined, { id: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { id: string }, MODELS.IPropertyDetail>({
    queryKey: [Constants.PROPERTIES_KEYS.PROPERTY_DETAIL, params],
    queryFn: () => propertyServiceInstance().getPropertyDetail(params as { id: string }),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

/** Impact d'une fermeture ou d'une suppression ; chargé à l'ouverture de la confirmation. */
const getPropertyImpactQueries = (
  args: QUERIES.QueryPayload<MODELS.IPropertyImpact, undefined, { id: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { id: string }, MODELS.IPropertyImpact>({
    queryKey: [Constants.PROPERTIES_KEYS.PROPERTY_IMPACT, params],
    queryFn: () => propertyServiceInstance().getPropertyImpact(params as { id: string }),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

const closePropertyMutation = (args: QUERIES.MutationPayload<unknown, unknown, { id: string }>) =>
  QUERIES.useCustomMutation<unknown, unknown, { id: string }>({
    mutationKey: [Constants.PROPERTIES_KEYS.CLOSE_PROPERTY],
    mutationFn: ({ params }) => propertyServiceInstance().close_property(params!),
    options: args.mutationOptions,
  });

const deletePropertyMutation = (args: QUERIES.MutationPayload<unknown, unknown, { id: string }>) =>
  QUERIES.useCustomMutation<unknown, unknown, { id: string }>({
    mutationKey: [Constants.PROPERTIES_KEYS.DELETE_PROPERTY],
    mutationFn: ({ params }) => propertyServiceInstance().delete_property(params!),
    options: args.mutationOptions,
  });

export {
  getPropertyDetailQueries,
  getPropertyImpactQueries,
  closePropertyMutation,
  deletePropertyMutation,
  getAllPropertiesByAgency,
  getMonthlyRevenueQueries,
  getOccupationRateByTypeQueries,
  createPropertyMutation,
  updatePropertyMutation,
};
