import { APIS } from "_store/endpoints";
import { ApplicationContext } from "rise-core-frontend";
import { handleApiError } from "_utils/handleApiError";
import { handleApiSuccess } from "_utils/handleApiSuccess";
import { AxiosError } from "axios";

/**
 * @class.ts GlobalApplicationContext
 * @extends
 * This is where to keep all UI project specific configs and implementation
 * to be used by the underlying layers (StateManagement, Business and Core)
 */
export class GlobalApplicationContext extends ApplicationContext {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
  }

  /**
   * Holds all possible API configs to be used within the app
   */
  getApiConfig(): any {
    return APIS(this.baseUrl);
  }

  handleError(response: AxiosError | any): void {
    const statusCode = (response?.response?.data as { statusCode?: number })
      ?.statusCode;
    const message = (response?.response?.data as { message?: string })?.message;
    const code = (response?.response?.data as { code?: number })?.code;
    if (code === 101 || code === 103) {
      this.setToken("");
      this.setRefreshToken("");
    } else {
      handleApiError({
        message: message ?? "",
        status: statusCode ?? 400,
      });
    }
  }

  handleInfo(response: { data: any; status: number }) {
    const message = response?.data?.message;
    const status = response?.status;
    handleApiSuccess({
      message,
      status,
    });
  }

  setToken(token: string): void {
    super.setToken(token);
  }
  setRefreshToken(refreshToken: string) {
    super.setRefreshToken(refreshToken);
  }
}
