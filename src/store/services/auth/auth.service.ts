import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * AuthService provides methods for handling authentication-related operations
 * such as registering a new user and sending verification emails.
 */
export class AuthService extends BaseApi {
  register_user(data: MODELS.ICreateUser) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.REGISTER,
      data,
    );
  }
  forgot_password(data: MODELS.IForgotPasswordInit) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.FORGET_PASSWORD_INIT,
      data,
    );
  }
  reset_password(data: MODELS.IResetPassword) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.RESET_PASSWORD,
      data,
    );
  }
  send_verification_email(data: { email: string; callbackURL: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.SEND_EMAIL_VERIFICATION,
      data,
    );
  }
  check_email(email: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.CHECK_EMAIL,
      { email },
    );
  }
}
