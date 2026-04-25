import { BaseApi } from 'rise-core-frontend';

export class PermissionService extends BaseApi {
  getAllPerms(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().COMMON.PERMS.ALL_PERMS,
      {},
      { params: { agencyId } },
    );
  }
}