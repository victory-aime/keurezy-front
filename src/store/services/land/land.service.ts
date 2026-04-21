import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * LandService provides methods for handling land-related operations
 * such as fetching all land and creating a new land through API endpoints.
 */
export class LandService extends BaseApi {
  land_list(data: MODELS.ILandFilter) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().LAND.ALL_LAND_BY_AGENCY,
      {},
      { params: data },
    );
  }
  create_land(data: MODELS.CreateLandDto | FormData) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().LAND.CREATE_LAND, data);
  }
  update_land(data: MODELS.UpdateLandDto | FormData) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().LAND.UPDATE_LAND, data);
  }
  delete_land(data: any) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().LAND.DELETE_LAND,
      {},
      {
        params: data,
      },
    );
  }
}
