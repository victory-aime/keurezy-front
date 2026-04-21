import * as Constants from './constants';
import { propertyServiceInstance } from './property.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllPropertiesByAgency = (args: QUERIES.QueryPayload<MODELS.IAgencyFilters>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IPaginatedResponse<MODELS.IPropertyResponse>>({
    queryKey: [Constants.PROPERTIES_KEYS.ALL_PROPERTIES_BY_AGENCY, params],
    queryFn: () =>
      propertyServiceInstance().getAllPropertyByAgency(params as MODELS.IAgencyFilters),
    options: queryOptions,
  });
};

const getOccupationRateByTypeQueries = (args: QUERIES.QueryPayload<MODELS.IAgencyFilters>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IOccupationRateStats[]>({
    queryKey: [Constants.PROPERTIES_KEYS.OCCUPATION_RATE_BY_PROPERTY_TYPE, params],
    queryFn: () =>
      propertyServiceInstance().getOccupationRateByType(params as MODELS.IAgencyCommonParams),
    options: queryOptions,
  });
};
const getMonthlyRevenueQueries = (args: QUERIES.QueryPayload<MODELS.IAgencyFilters>) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IMonthlyRevenueStats[]>({
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

const updatePropertyMutation = (args: QUERIES.MutationPayload<MODELS.ICreateProperty>) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.PROPERTIES_KEYS.UPDATE_PROPERTY],
    mutationFn: ({ payload, params }) =>
      propertyServiceInstance().update_property(payload!, params),
    options: args.mutationOptions,
  });
};

export {
  getAllPropertiesByAgency,
  getMonthlyRevenueQueries,
  getOccupationRateByTypeQueries,
  createPropertyMutation,
  updatePropertyMutation,
};
