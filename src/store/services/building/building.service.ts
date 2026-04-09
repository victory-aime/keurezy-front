import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * BuildingService provides methods for handling Building-related operations
 * such as fetching all Building and creating a new Building through API endpoints.
 */
export class BuildingService extends BaseApi {
  building_list(data: MODELS.IBuildingFilter) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().BUILDING.ALL_BUILDING_BY_AGENCY,
      {},
      { params: data },
    );
  }
  create_building(data: MODELS.CreateBuildingDto | FormData, ownerId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().BUILDING.CREATE_BUILDING,
      data,
      { params: { ownerId } },
    );
  }
  update_building(data: MODELS.UpdateBuildingDto | FormData, ownerId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().BUILDING.UPDATE_BUILDING,
      data,
      { params: { ownerId } },
    );
  }
  delete_building(data: MODELS.IDeleteBuilding) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().BUILDING.DELETE_BUILDING,
      {},
      {
        params: data,
      },
    );
  }
}
