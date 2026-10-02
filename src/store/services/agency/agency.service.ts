import { BaseApi } from 'rise-core-frontend';
import { MODELS } from '_types/index';

/**
 * AgencyService provides methods for handling agency-related operations
 * such as fetching all agency and creating a new agency through API endpoints.
 */
export class AgencyService extends BaseApi {
  agency_info(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.AGENCY_INFO,
      {},
      { params: { agencyId } },
    );
  }
  agency_subscription_info(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.AGENCY_SUBSCRIPTION_INFO,
      {},
      { params: { agencyId } },
    );
  }
  /** Abonnement, consommation et fonctionnalités (owner uniquement). */
  agency_subscription(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.AGENCY_SUBSCRIPTION,
      {},
      { params: { agencyId } },
    );
  }
  /** Ce que la résiliation change à l'échéance (owner uniquement). */
  subscription_cancel_impact(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_CANCEL_IMPACT,
      {},
      { params: { agencyId } },
    );
  }
  /** Résilie l'abonnement à la fin de la période (owner uniquement). */
  cancel_subscription(agencyId: string, feedback?: MODELS.IExitFeedback) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_CANCEL,
      feedback ?? {},
      { params: { agencyId } },
    );
  }
  /** Annule la résiliation programmée (owner uniquement). */
  resume_subscription(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_RESUME,
      {},
      { params: { agencyId } },
    );
  }
  /** Devis d'un changement de plan ou d'un renouvellement (owner uniquement). */
  subscription_quote({ agencyId, planId, billingCycle }: MODELS.ISubscriptionTarget) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_QUOTE,
      {},
      { params: { agencyId, planId, billingCycle } },
    );
  }
  /**
   * Crée (ou retrouve) le checkout NabooPay. `idempotencyKey` : une clé par intention de paiement,
   * renvoyée telle quelle à chaque nouvelle tentative pour ne jamais créer deux paiements.
   */
  subscription_checkout(target: MODELS.ISubscriptionTarget, idempotencyKey: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_CHECKOUT,
      target,
      { headers: { 'Idempotency-Key': idempotencyKey } },
    );
  }
  /** Statut d'un paiement d'abonnement, au retour de NabooPay (owner uniquement). */
  subscription_payment_status(agencyId: string, orderId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_PAYMENT,
      {},
      { params: { agencyId, orderId } },
    );
  }
  /** Limites du plan et usage actif (owner et staff). */
  subscription_limits(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_LIMITS,
      {},
      { params: { agencyId } },
    );
  }
  /** Historique de facturation de l'agence, paginé (owner uniquement). */
  subscription_payments(params: MODELS.IPagination) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_PAYMENTS,
      {},
      { params },
    );
  }
  /** Programme un downgrade pour l'échéance, avec les éléments gardés actifs. */
  schedule_subscription_change(target: MODELS.ISubscriptionTarget) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_SCHEDULE_CHANGE,
      target,
    );
  }
  /** Annule le downgrade programmé. */
  cancel_scheduled_change(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_SCHEDULED_CHANGE,
      {},
      { params: { agencyId } },
    );
  }
  /** Réactive un bien désactivé par un downgrade, dans la limite du plan. */
  activate_asset(agencyId: string, asset: { type: 'PROPERTY' | 'LAND' | 'BUILDING'; id: string }) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_ACTIVATE_ASSET,
      asset,
      { params: { agencyId } },
    );
  }
  create_agency(data: MODELS.ICreateAgency | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CREATE_AGENCY,
      data,
    );
  }
  update_agency(data: MODELS.IUpdateAgency | FormData) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.UPDATE_AGENCY,
      data,
    );
  }
  /** Modèles de facture (communs et de l'agence) et réglages de facturation. */
  invoice_templates(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.INVOICE_TEMPLATES,
      {},
      { params: { agencyId } },
    );
  }
  invoice_template_variables() {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.INVOICE_TEMPLATE_VARIABLES,
    );
  }
  /** Crée un modèle, ou en modifie un si `id` est fourni (un modèle commun est copié). */
  save_invoice_template(
    agencyId: string,
    data: { name?: string; config: MODELS.IInvoiceTemplateConfig },
    id?: string,
  ) {
    const config = this.applicationContext.getApiConfig().AGENCY;
    return this.apiService.invoke(
      id ? config.INVOICE_TEMPLATE_UPDATE : config.INVOICE_TEMPLATE_CREATE,
      data,
      { params: id ? { agencyId, id } : { agencyId } },
    );
  }
  delete_invoice_template(agencyId: string, id: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.INVOICE_TEMPLATE_DELETE,
      {},
      { params: { agencyId, id } },
    );
  }
  update_invoice_settings(agencyId: string, data: Partial<MODELS.IInvoiceSettings>) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.INVOICE_SETTINGS,
      data,
      { params: { agencyId } },
    );
  }
  /** Cachet ou signature scanné (owner) : envoi d'une image, ou retrait si `file` est absent. */
  invoice_stamp(agencyId: string, file?: File) {
    const config = this.applicationContext.getApiConfig().AGENCY;
    if (!file)
      return this.apiService.invoke(config.INVOICE_STAMP_DELETE, {}, { params: { agencyId } });
    const data = new FormData();
    data.append('stamp', file);
    return this.apiService.invoke(config.INVOICE_STAMP_UPLOAD, data, { params: { agencyId } });
  }
  /** Informations légales de l'agence (owner uniquement). */
  update_legal(agencyId: string, data: Partial<MODELS.IAgencyLegal>) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.UPDATE_LEGAL,
      data,
      { params: { agencyId } },
    );
  }
  close_agency(data: MODELS.ICloseAgency) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CLOSE_AGENCY,
      data.feedback ?? {},
      {
        params: { agencyId: data.agencyId },
      },
    );
  }
  /** Annule la fermeture programmée (owner uniquement). */
  cancel_close(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CANCEL_CLOSE,
      {},
      { params: { agencyId } },
    );
  }
  /** Ce que la fermeture de l'agence entraîne (owner uniquement). */
  close_impact(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CLOSE_IMPACT,
      {},
      { params: { agencyId } },
    );
  }
  check_name(name: string) {
    return this.apiService.invoke(this.applicationContext.getApiConfig().AGENCY.CHECK_NAME, {
      name,
    });
  }

  stats_agency(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.STATS,
      {},
      {
        params: { agencyId },
      },
    );
  }
}
