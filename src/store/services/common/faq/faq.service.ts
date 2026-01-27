import { BaseApi } from "rise-core-frontend";
import { MODELS } from "_types/index";

/**
 * FaqService provides methods for handling invoice operations
 * such as generating through API endpoints.
 */
export class FaqService extends BaseApi {
  /**
   * Generates a new invoice for payment student.
   *paymentId - The payment id.
   */
  getFaqs() {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().FAQ.GET_FAQS,
    );
  }

  create_faq(payload: MODELS.COMMON.FAQ.IFaq) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().FAQ.CREATE,
      payload,
    );
  }

  update_faq(faqId: string, data: MODELS.COMMON.FAQ.IFaq) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().FAQ.UPDATE,
      data,
      { params: { faqId } },
    );
  }

  delete_faq(faqId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().FAQ.DELETE,
      {},
      { params: { faqId } },
    );
  }
}
