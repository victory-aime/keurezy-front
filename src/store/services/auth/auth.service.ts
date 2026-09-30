import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * AuthService provides methods for handling authentication-related operations
 * such as registering a new user and sending verification emails.
 */
export class AuthService extends BaseApi {
  register_user(data: MODELS.ICreateUser) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().AUTH.REGISTER, data);
  }
  forgot_password(data: MODELS.IForgotPasswordInit) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.FORGET_PASSWORD_INIT,
      data,
    );
  }
  reset_password(data: MODELS.IResetPassword) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().AUTH.RESET_PASSWORD, data);
  }
  /** Récupération (2FA perdue), étape 1 : identifiants, code envoyé par e-mail. */
  two_factor_recovery_request(data: MODELS.ITwoFactorRecoveryRequest) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.TWO_FACTOR_RECOVERY_REQUEST,
      data,
    );
  }
  /** Étape 2 : code valide, désactivation programmée dans 72 h. */
  two_factor_recovery_confirm(data: MODELS.ITwoFactorRecoveryConfirm) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.TWO_FACTOR_RECOVERY_CONFIRM,
      data,
    );
  }
  /** Lien « Ce n'est pas moi » de l'e-mail. */
  two_factor_recovery_cancel(token: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.TWO_FACTOR_RECOVERY_CANCEL,
      { token },
    );
  }
  send_verification_email(data: { email: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AUTH.SEND_EMAIL_VERIFICATION,
      data,
    );
  }
  check_email(email: string) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().AUTH.CHECK_EMAIL, {
      email,
    });
  }
}
