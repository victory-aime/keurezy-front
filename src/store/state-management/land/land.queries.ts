import * as Constants from "./constants";
import { landServiceInstance } from "./land.service-instance";
import { MODELS } from "_types/index";
import { QUERIES } from "rise-core-frontend";

const getAllLandsByAgencyQueries = (
  args: QUERIES.QueryPayload<MODELS.ILandFilter>,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<
    MODELS.IPaginatedResponse<MODELS.LandResponseDto>
  >({
    queryKey: [Constants.LAND_KEYS.ALL_LAND_BY_AGENCY, params],
    queryFn: () =>
      landServiceInstance().land_list(params as MODELS.ILandFilter),
    options: queryOptions,
  });
};

const createLandMutation = (
  args: QUERIES.MutationPayload<{
    data: MODELS.CreateLandDto;
  }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.LAND_KEYS.CREATE_LAND],
    mutationFn: ({ payload }) =>
      landServiceInstance().create_land(payload?.data!),
    options: args.mutationOptions,
  });
};

const updateLandMutation = (
  args: QUERIES.MutationPayload<{
    data: MODELS.UpdateLandDto;
  }>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.LAND_KEYS.UPDATE_LAND],
    mutationFn: ({ payload }) =>
      landServiceInstance().update_land(payload?.data!),
    options: args.mutationOptions,
  });
};

const deleteLandMutation = (
  args: QUERIES.MutationPayload<MODELS.IDeleteBuilding>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.LAND_KEYS.DELETE_LAND],
    mutationFn: ({ params }) => landServiceInstance().delete_land(params!),
    options: args.mutationOptions,
  });
};

export {
  createLandMutation,
  updateLandMutation,
  getAllLandsByAgencyQueries,
  deleteLandMutation,
};
