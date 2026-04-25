import { BaseApi } from 'rise-core-frontend';

export class CommonService extends BaseApi {
  getAllPacks() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().COMMON.PACKS.ALL_PACKS);
  }
}
