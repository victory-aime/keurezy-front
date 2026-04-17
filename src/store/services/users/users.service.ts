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
  update_user_info(data: MODELS.IUser) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().USER.UPDATE_USER,
      data,
    );
  }

  register_user(data: MODELS.ICreateUser) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().USER.REGISTER,
      data,
    );
  }

  resend_email_verification(data: { email: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.RESEND_EMAIL_VERIFICATION,
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
