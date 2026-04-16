import { MODELS } from "_types/*";
import { BaseApi } from "rise-core-frontend";

export class TeamService extends BaseApi {
  getAllTeamByAgency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.ALL_TEAMS,
      {},
      { params: { agencyId } },
    );
  }

  changeStatus(id: string, userId: string, status: boolean) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.CHANGE_STATUS,
      { status },
      { params: { id, userId } },
    );
  }
}
