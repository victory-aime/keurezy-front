import * as Constants from './constants';
import { landServiceInstance } from './land.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllLandsByAgencyQueries = (
  args: QUERIES.QueryPayload<
    MODELS.IPaginatedResponse<MODELS.LandResponseDto>,
    undefined,
    MODELS.ILandFilter
  >,
) => {
  const { params, queryOptions } = args;

  return QUERIES.useCustomQuery<
    undefined,
    MODELS.ILandFilter,
    MODELS.IPaginatedResponse<MODELS.LandResponseDto>
  >({
    queryKey: [Constants.LAND_KEYS.ALL_LAND_BY_AGENCY, params],
    queryFn: () => landServiceInstance().land_list(params as MODELS.ILandFilter),
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
    mutationFn: ({ payload }) => landServiceInstance().create_land(payload?.data!),
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
    mutationFn: ({ payload }) => landServiceInstance().update_land(payload?.data!),
    options: args.mutationOptions,
  });
};

const deleteLandMutation = (
  args: QUERIES.MutationPayload<unknown, unknown, MODELS.IDeleteBuilding>,
) => {
  return QUERIES.useCustomMutation<unknown, unknown, MODELS.IDeleteBuilding>({
    mutationKey: [Constants.LAND_KEYS.DELETE_LAND],
    mutationFn: ({ params }) => landServiceInstance().delete_land(params!),
    options: args.mutationOptions,
  });
};

/** Impact d'une suppression de terrain ; chargé à l'ouverture de la confirmation. */
const getLandImpactQueries = (
  args: QUERIES.QueryPayload<MODELS.ILandImpact, undefined, { id: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { id: string }, MODELS.ILandImpact>({
    queryKey: [Constants.LAND_KEYS.LAND_IMPACT, params],
    queryFn: () => landServiceInstance().getLandImpact(params as { id: string }),
    options: queryOptions,
  });
};

export {
  createLandMutation,
  updateLandMutation,
  getAllLandsByAgencyQueries,
  deleteLandMutation,
  getLandImpactQueries,
};
