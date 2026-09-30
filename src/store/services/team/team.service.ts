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

  /** Remplace les permissions d'un membre (propriétaire de l'agence uniquement). */
  updatePermissions(data: MODELS.IUpdateStaffPermissions, agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.UPDATE_PERMISSIONS,
      data,
      { params: { agencyId } },
    );
  }

  /** Ce que le retrait d'un membre entraîne (owner uniquement). */
  getMemberImpact(params: { agencyId: string; id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.MEMBER_IMPACT,
      {},
      { params },
    );
  }

  /** Retire un membre : travail désassigné, compte désactivé, sessions fermées. */
  removeMember(params: { agencyId: string; id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.REMOVE_MEMBER,
      {},
      { params },
    );
  }

  /** Réinitialise la 2FA d'un membre (owner uniquement) : sessions fermées, membre prévenu. */
  resetTwoFactor(params: { agencyId: string; id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().TEAM.RESET_TWO_FACTOR,
      {},
      { params },
    );
  }
}
