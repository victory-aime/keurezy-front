import { BaseApi } from 'rise-core-frontend';

export class VisitsService extends BaseApi {
  getAllVisits(data: { agencyId: string; userId: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().VISITS.ALL_BY_AGENCY,
      {},
      { params: data },
    );
  }
}
