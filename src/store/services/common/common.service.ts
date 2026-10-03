import { BaseApi } from 'rise-core-frontend';

export class CommonService extends BaseApi {
  getAllPacks() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().COMMON.PACKS.ALL_PACKS);
  }

  /** Code promo à l'inscription : montant remisé, ou refus explicite (422). */
  onboardingPromo(params: { planId: string; billingCycle: string; promoCode: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().COMMON.ONBOARDING_PROMO,
      {},
      { params },
    );
  }
  getPaymentPollingStatus(orderId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().COMMON.POLLING_STATUS,
      {},
      { params: { orderId } },
    );
  }
}
