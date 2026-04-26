import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/*';

export class AnnoncesService extends BaseApi {
  get_annonces_by_agency(agencyId: string, userId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().ANNONCES.FIND_BY_AGENCY,
      {},
      { params: { agencyId, userId } },
    );
  }

  create_annonce(data: MODELS.ICreateAnnonce) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().ANNONCES.CREATE, data);
  }

  update_annonce(data: MODELS.IUpdateAnnonce) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().ANNONCES.UPDATE, data);
  }

  delete_annonce(id: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().ANNONCES.DELETE,
      {},
      { params: { id } },
    );
  }
}
