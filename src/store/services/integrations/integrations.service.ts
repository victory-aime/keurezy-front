import { BaseApi } from 'rise-core-frontend';

export class IntegrationsService extends BaseApi {
  connect(provider: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.CONNECT,
      {},
      { params: { provider } },
    );
  }
  disconnect(provider: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.DISCONNECT,
      {},
      { params: { provider } },
    );
  }
  status(provider: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.GET_STATUS,
      {},
      { params: { provider } },
    );
  }

  upload_file(file: string, provider: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.UPLOAD_FILE,
      file,
      { params: { provider } },
    );
  }
  list_files(provider: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.FILES_LIST,
      {},
      { params: { provider } },
    );
  }
  trashed_list_files(provider: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.TRASHED_FILES_LIST,
      {},
      { params: { provider } },
    );
  }
  trashed(provider: string, fileId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.TRASHED,
      {},
      { params: { provider, fileId } },
    );
  }
  delete_file(provider: string, fileId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().INTEGRATIONS_PROVIDER.DELETE_FILE,
      {},
      { params: { provider, fileId } },
    );
  }
}
