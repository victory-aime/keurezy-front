import { ENTITY_QUERY_OPTIONS } from '../query-options';
import * as Constants from './constants';
import { buildingServiceInstance } from './building.service-instance';
import { MODELS } from '_types/index';
import { QUERIES } from 'rise-core-frontend';

const getAllBuildingByAgencyQueries = (
  args: QUERIES.QueryPayload<
    MODELS.IPaginatedResponse<MODELS.IBuilding>,
    undefined,
    MODELS.IBuildingFilter
  >,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<
    MODELS.IBuildingFilter,
    undefined,
    MODELS.IPaginatedResponse<MODELS.IBuilding>
  >({
    queryKey: [Constants.BUILDING_KEYS.ALL_BUILDING_BY_AGENCY, params],
    queryFn: () => buildingServiceInstance().building_list(params as MODELS.IBuildingFilter),
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
    mutationFn: ({ payload }) => buildingServiceInstance().create_building(payload?.data!),
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
    mutationFn: ({ payload }) => buildingServiceInstance().update_building(payload?.data!),
    options: args.mutationOptions,
  });
};

const deleteBuildingMutation = (
  args: QUERIES.MutationPayload<any, any, MODELS.IDeleteBuilding>,
) => {
  return QUERIES.useCustomMutation({
    mutationKey: [Constants.BUILDING_KEYS.DELETE_BUILDING],
    mutationFn: ({ params }) => buildingServiceInstance().delete_building(params!),
    options: args.mutationOptions,
  });
};

/** Impact d'une suppression de bâtiment ; chargé à l'ouverture de la confirmation. */
const getBuildingImpactQueries = (
  args: QUERIES.QueryPayload<MODELS.IBuildingImpact, undefined, { id: string }>,
) => {
  const { params, queryOptions } = args;
  return QUERIES.useCustomQuery<undefined, { id: string }, MODELS.IBuildingImpact>({
    queryKey: [Constants.BUILDING_KEYS.BUILDING_IMPACT, params],
    queryFn: () => buildingServiceInstance().getBuildingImpact(params as { id: string }),
    options: { ...ENTITY_QUERY_OPTIONS, ...queryOptions },
  });
};

export {
  getBuildingImpactQueries,
  createBuildingMutation,
  getAllBuildingByAgencyQueries,
  updateBuildingMutation,
  deleteBuildingMutation,
};
