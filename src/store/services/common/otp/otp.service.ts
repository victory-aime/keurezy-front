import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * OtpService provides methods for handling One-Time Password (OTP) operations
 * such as generating, renewing, and validating OTP codes through API endpoints.
 */
export class OtpService extends BaseApi {
  /**
   * Generates a new OTP for the user.
   *email - The OTP request email data.
   */
  generateOtp(email: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().OTP.GENERATE,
      {
        email,
      },
    );
  }

  /**
   * Validates a submitted OTP for the user.
   *
   * @param {MODELS.COMMON.OTP.IOtp} payload - The OTP validation request payload.
   * @returns {Promise<any>} - A promise resolving to the result of the OTP validation.
   */
  validateOtp(payload: MODELS.COMMON.OTP.IOtp) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().OTP.VALIDATE,
      payload,
    );
  }
}
