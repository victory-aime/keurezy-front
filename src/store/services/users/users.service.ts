import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * UserService provides methods for handling user-related operations
 * such as fetching all users and creating a new user through API endpoints.
 */
export class UserService extends BaseApi {
  user_info(userId: MODELS.IUser) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().USER.INFO,
      { userId },
    );
  }

  regenerate_password(data: MODELS.IUser) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().USER.REGENERATE_PASSWORD,
      data,
    );
  }

  reset_password(data: MODELS.IUser) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.RESET_PASSWORD,
      data,
    );
  }
  check_email(email: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().USER.CHECK_EMAIL,
      { email },
    );
  }
}
