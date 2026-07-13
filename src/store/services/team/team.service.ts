import { MODELS } from '_types/*';
import { BaseApi } from 'rise-core-frontend';

export class TeamService extends BaseApi {
  getAllTeamByAgency(agencyId: string, userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.ALL_TEAMS,
      {},
      { params: { agencyId, userId } },
    );
  }

  changeStatus(
    data: { id: string; userId: string; status: boolean },
    agencyId: string,
    agentId: string,
  ) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().TEAM.CHANGE_STATUS, data, {
      params: { agencyId, agentId },
    });
  }
}
