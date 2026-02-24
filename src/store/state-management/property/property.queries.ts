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
  args: QUERIES.QueryPayload<{ agencyId: string }>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IProperty[]>({
    queryKey: [Constants.PROPERTIES_KEYS.ALL_PROPERTIES_BY_AGENCY],
    queryFn: () =>
      propertyServiceInstance().getAllPropertyByAgency(params?.agencyId),
    options: queryOptions,
  });
};

const createPropertyMutation = (
  args: QUERIES.MutationPayload<MODELS.IProperty>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.PROPERTIES_KEYS.CREATE_PROPERTY],
    mutationFn: ({ payload }) =>
      propertyServiceInstance().create_property(payload!),
    options: args.mutationOptions,
  });
};

export {
  getAllPropertiesByAgency,
  createPropertyMutation,
  getAllPublicProperties,
};
