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
  cancel_subscription(agencyId: string) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.SUBSCRIPTION_CANCEL,
      {},
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
  close_agency(data: MODELS.ICloseAgency) {
    return this.apiService.invoke(
      this.applicationContext.getApiConfig().AGENCY.CLOSE_AGENCY,
      {},
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
