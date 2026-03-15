import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * RentalAgreementService provides methods for handling rentalAgreement-related operations
 * such as fetching all rental and creating a new rental through API endpoints.
 */
export class RentalAgreementService extends BaseApi {
  getRentalAgreementByAgency(params: MODELS.IAgencyFilters) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.GET_AGENCY_LIST,
      {},
      { params },
    );
  }

  approveRequest(data: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.APPROVE,
      {},
      { params: data },
    );
  }
  rejectRequest(data: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.REJECT,
      {},
      { params: data },
    );
  }

  terminateRental(data: MODELS.IAgencyCommonParams) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.TERMINATE,
      {},
      { params: data },
    );
  }
}
