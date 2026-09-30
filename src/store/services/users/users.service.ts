import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * UserService provides methods for handling user-related operations
 * such as fetching all users and creating a new user through API endpoints.
 */
export class UserService extends BaseApi {
  user_info() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().USER.INFO);
  }
  update_user_info(data: MODELS.IUser) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().USER.UPDATE_USER, data);
  }

  backup_codes_remaining() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().USER.BACKUP_CODES_REMAINING);
  }
  passkey_session_list() {
    return this.apiService.invoke(this.applicationContext.getApiConfig().USER.PASSKEY_SESSION);
  }

  check_email(email: string) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().USER.CHECK_EMAIL, {
      email,
    });
  }
}
