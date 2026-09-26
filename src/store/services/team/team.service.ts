import { MODELS } from '_types/*';
import { BaseApi } from 'rise-core-frontend';

export class TeamService extends BaseApi {
  getAllTeamByAgency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.ALL_TEAMS,
      {},
      { params: { agencyId } },
    );
  }

  changeStatus(data: { id: string; status: boolean }, agencyId: string) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().TEAM.CHANGE_STATUS, data, {
      params: { agencyId },
    });
  }
}
