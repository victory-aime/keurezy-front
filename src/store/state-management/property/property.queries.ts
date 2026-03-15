import * as Constants from "./constants";
import { propertyServiceInstance } from "./property.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getAllPublicProperties = (args: QUERIES.QueryPayload) => {
  const { queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IProperty[]>({
    queryKey: [Constants.PROPERTIES_KEYS.ALL_PROPERTIES_PUBLIC],
    queryFn: () => propertyServiceInstance().allPublicProperties(),
    options: queryOptions,
  });
};

const getAllPropertiesByAgency = (
  args: QUERIES.QueryPayload<MODELS.IAgencyFilters>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IPropertyResponse>({
    queryKey: [Constants.PROPERTIES_KEYS.ALL_PROPERTIES_BY_AGENCY, params],
    queryFn: () =>
      propertyServiceInstance().getAllPropertyByAgency(
        params as MODELS.IAgencyFilters,
      ),
    options: queryOptions,
  });
};

const getOccupationRateByTypeQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyFilters>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IOccupationRateStats[]>({
    queryKey: [
      Constants.PROPERTIES_KEYS.OCCUPATION_RATE_BY_PROPERTY_TYPE,
      params,
    ],
    queryFn: () =>
      propertyServiceInstance().getOccupationRateByType(
        params as MODELS.IAgencyFilters,
      ),
    options: queryOptions,
  });
};
const getMonthlyRevenueQueries = (
  args: QUERIES.QueryPayload<MODELS.IAgencyFilters>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IMonthlyRevenueStats[]>({
    queryKey: [Constants.PROPERTIES_KEYS.MONTHLY_REVENUE, params],
    queryFn: () =>
      propertyServiceInstance().getMonthlyRevenue(
        params as MODELS.IAgencyFilters,
      ),
    options: queryOptions,
  });
};

const createPropertyMutation = (
  args: QUERIES.MutationPayload<MODELS.IProperty>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.PROPERTIES_KEYS.CREATE_PROPERTY],
    mutationFn: ({ payload, params }) =>
      propertyServiceInstance().create_property(payload!, params),
    options: args.mutationOptions,
  });
};

const updatePropertyMutation = (
  args: QUERIES.MutationPayload<MODELS.IProperty>,
) => {
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
  getAllPublicProperties,
};
