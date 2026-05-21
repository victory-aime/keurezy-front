import { BaseApi } from 'rise-core-frontend';

export class StatsService extends BaseApi {
  stats_agency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().STATS.AGENCY,
      {},
      {
        params: { agencyId },
      },
    );
  }
}
