import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * RentalService provides methods for handling rental-related operations
 * such as fetching all rental and creating a new rental through API endpoints.
 */
export class RentalService extends BaseApi {
  createRequest(data: MODELS.IRentalRequest) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL.CREATE,
      data,
    );
  }
  agencyRentalRequestList(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL.RENTAL_AGENCY_REQUEST_LIST,
      {},
      { params: { agencyId } },
    );
  }

  userRentalRequestList(userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL.RENTAL_USER_REQUEST_LIST,
      {},
      { params: { userId } },
    );
  }
}
