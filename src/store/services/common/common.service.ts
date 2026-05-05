import { BaseApi } from 'rise-core-frontend';

export class CommonService extends BaseApi {
  getAllPacks() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().COMMON.PACKS.ALL_PACKS);
  }

  getPaymentPollingStatus(orderId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().COMMON.POLLING_STATUS,
      {},
      { params: { orderId } },
    );
  }
}
