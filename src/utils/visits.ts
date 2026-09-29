/** Valeur d'un `FormSelect` Chakra : une liste d'identifiants (un seul ici). */
type SelectValue = string[] | undefined;

/** Références d'une visite telles que saisies dans le formulaire (listes de sélection). */
export interface VisitFormRefs {
  clientId?: SelectValue;
  propertyId?: SelectValue;
  agentId?: SelectValue;
  status?: SelectValue;
  [key: string]: unknown;
}

/**
 * Identifiants à envoyer à `visits/create` / `visits/update`, extraits des sélections du
 * formulaire. Seuls client, bien, agent (facultatif) et statut sont repris : tout autre champ
 * (ex. un ancien `leadId`) est ignoré, le backend ne le connaît plus.
 */
export function pickVisitRefs(values: VisitFormRefs) {
  return {
    clientId: values.clientId?.[0],
    propertyId: values.propertyId?.[0],
    agentId: values.agentId?.[0] || undefined,
    status: values.status?.[0],
  };
}
