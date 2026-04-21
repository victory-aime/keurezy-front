/**
 * Map des noms de champs vers des labels lisibles en français.
 * Étends cette map selon les champs de l'application.
 */
const FIELD_LABELS: Record<string, string> = {
  // Land
  title: 'Nom du terrain',
  city: 'Ville',
  district: 'Quartier',
  address: 'Adresse complète',
  purchasePrice: 'Prix de vente',
  area: 'Surface (m²)',
  status: 'Statut',
  landOwner: 'Propriétaire',
  documents: 'Fichiers juridiques',

  // Building
  buildingName: 'Nom du bâtiment',
  floors: "Nombre d'étages",
  buildingType: 'Type de bâtiment',

  // Common
  name: 'Nom',
  email: 'Email',
  phone: 'Téléphone',
  description: 'Description',
  price: 'Prix',
  firstName: 'Prénom',
  lastName: 'Nom de famille',
  password: 'Mot de passe',
  confirmPassword: 'Confirmation du mot de passe',
};

/**
 * Aplatit les erreurs Formik imbriquées en une liste de messages lisibles.
 * Supporte les objets, tableaux et chaînes d'erreurs.
 */
export const flattenErrors = (errors: Record<string, unknown>, prefix = ''): string[] => {
  return Object.entries(errors).flatMap(([key, value]) => {
    const fieldKey = prefix ? `${prefix}.${key}` : key;
    const label = FIELD_LABELS[key] ?? FIELD_LABELS[fieldKey] ?? key;

    if (typeof value === 'string') {
      return [`• ${label} : ${value}`];
    }

    if (Array.isArray(value)) {
      return value.flatMap((item, index) => {
        if (typeof item === 'string') return [`• ${label}[${index + 1}] : ${item}`];
        if (item && typeof item === 'object') {
          return flattenErrors(item as Record<string, unknown>, `${fieldKey}[${index}]`);
        }
        return [];
      });
    }

    if (value && typeof value === 'object') {
      return flattenErrors(value as Record<string, unknown>, fieldKey);
    }

    return [];
  });
};
