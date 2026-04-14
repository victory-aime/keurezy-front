import * as Constants from "./constants";
import { buildingServiceInstance } from "./building.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getAllBuildingByAgencyQueries = (
  args: QUERIES.QueryPayload<MODELS.IBuildingFilter>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<MODELS.IPaginatedResponse<MODELS.IBuilding>>({
    queryKey: [Constants.BUILDING_KEYS.ALL_BUILDING_BY_AGENCY, params],
    queryFn: () =>
      buildingServiceInstance().building_list(params as MODELS.IBuildingFilter),
    options: queryOptions,
  });
};

const createBuildingMutation = (
  args: QUERIES.MutationPayload<{
    data: MODELS.CreateBuildingDto;
  }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.BUILDING_KEYS.CREATE_BUILDING],
    mutationFn: ({ payload }) =>
      buildingServiceInstance().create_building(payload?.data!),
    options: args.mutationOptions,
  });
};

const updateBuildingMutation = (
  args: QUERIES.MutationPayload<{
    data: MODELS.UpdateBuildingDto;
  }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.BUILDING_KEYS.UPDATE_BUILDING],
    mutationFn: ({ payload }) =>
      buildingServiceInstance().update_building(payload?.data!),
    options: args.mutationOptions,
  });
};

const deleteBuildingMutation = (
  args: QUERIES.MutationPayload<MODELS.IDeleteBuilding>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.BUILDING_KEYS.DELETE_BUILDING],
    mutationFn: ({ params }) =>
      buildingServiceInstance().delete_building(params!),
    options: args.mutationOptions,
  });
};

export {
  createBuildingMutation,
  getAllBuildingByAgencyQueries,
  updateBuildingMutation,
  deleteBuildingMutation,
};
