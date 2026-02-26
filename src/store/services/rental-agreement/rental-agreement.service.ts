import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * RentalAgreementService provides methods for handling rentalAgreement-related operations
 * such as fetching all rental and creating a new rental through API endpoints.
 */
export class RentalAgreementService extends BaseApi {
  approveRequest(data: { requestId: string; agencyId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.APPROVE,
      {},
      { params: data },
    );
  }
  rejectRequest(data: { requestId: string; agencyId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.REJECT,
      {},
      { params: data },
    );
  }

  terminateRental(data: { propertyId: string; agencyId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().RENTAL_AGREEMENT.TERMINATE,
      {},
      { params: data },
    );
  }
}
