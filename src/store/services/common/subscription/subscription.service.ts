import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * SubscriptionService provides methods for handling One-Time Password (OTP) operations
 * such as codes through API endpoints.
 */
export class SubscriptionService extends BaseApi {
  get_plans() {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().SUBSCRIPTION.GET_PLANS,
    );
  }

  onboarding_owner(data: MODELS.COMMON.SUBSCRIPTION.ICreateSimpleUserDto) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().SUBSCRIPTION.ONBOARD_USER.OWNER,
      data,
    );
  }
}
