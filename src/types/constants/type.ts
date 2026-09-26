import { Icons } from '_components/custom';
import { LandPaymentType, RentalType } from '../enum';

export const landPaymentTypes = [
  { label: 'Cash', value: LandPaymentType.CASH },
  { label: 'Partiel', value: LandPaymentType.PARTIAL },
];

export const propertyTypes = [
  { label: 'Appartement', value: 'APARTMENT' },
  { label: 'Maison', value: 'HOUSE' },
  { label: 'Studio', value: 'STUDIO' },
  // { label: "Villa", value: "VILLA" },
  // { label: "Chambre", value: "CHAMBRE" },
  // { label: "Bureau", value: "BUREAU" },
];

/**
 * Modalités de location proposées pour un bien.
 * `unit` / `unitPlural` : unité du prix et des durées ; `description` : explication affichée à l'agent.
 */
export const rentalTypes = [
  {
    value: RentalType.DAILY,
    label: 'Journalière',
    unit: 'jour',
    unitPlural: 'jours',
    minAvailability: '2 jours (le second peut être le jour de départ)',
    description:
      'Location à la journée, sans nuitée (bureau, salle, espace événementiel). Le prix est fixé par jour et les durées se comptent en jours.',
  },
  {
    value: RentalType.NIGHTLY,
    label: 'Nocturne',
    unit: 'nuit',
    unitPlural: 'nuits',
    minAvailability: '2 jours, soit au moins une nuit',
    description:
      'Séjour court avec nuitées (location saisonnière ou meublé touristique). Le prix est fixé par nuit et les durées se comptent en nuits.',
  },
  {
    value: RentalType.MONTHLY,
    label: 'Mensuelle',
    unit: 'mois',
    unitPlural: 'mois',
    minAvailability: '1 mois',
    description:
      'Bail au mois pour une occupation de moyenne ou longue durée. Le loyer est mensuel et les durées se comptent en mois.',
  },
  {
    value: RentalType.YEARLY,
    label: 'Annuelle',
    unit: 'an',
    unitPlural: 'ans',
    minAvailability: '1 an',
    description:
      'Bail à l’année pour une location longue durée. Le loyer est annuel et les durées se comptent en années.',
  },
];

export const rentalFieldHelp = {
  minDuration: 'Durée minimale d’une réservation pour cette modalité.',
  maxDuration: 'Durée maximale d’une réservation. Laissez vide pour ne pas la limiter.',
  availabilities:
    'Sans période, la modalité est réservable à tout moment. Ajoutez des périodes pour limiter les dates réservables ; les réservations confirmées sont automatiquement déduites.',
};
export const PROPERTY_FEATURES_BY_CATEGORY = [
  {
    category: 'Pièces & Espaces',
    features: [
      { value: 'KITCHEN', label: 'Cuisine' },
      { value: 'LIVING_ROOM', label: 'Salon' },
      { value: 'DINING_ROOM', label: 'Salle à manger' },
      { value: 'OFFICE', label: 'Bureau' },
      { value: 'BASEMENT', label: 'Sous-sol' },
      { value: 'ATTIC', label: 'Grenier' },
      { value: 'STORAGE_ROOM', label: 'Débarras' },
    ],
  },
  {
    category: 'Extérieur',
    features: [
      { value: 'GARDEN', label: 'Jardin' },
      { value: 'TERRACE', label: 'Terrasse' },
      { value: 'BALCONY', label: 'Balcon' },
      { value: 'COURTYARD', label: 'Cour' },
      { value: 'POOL', label: 'Piscine' },
      { value: 'GARAGE', label: 'Garage' },
      { value: 'PARKING', label: 'Parking' },
    ],
  },
  {
    category: 'Équipements',
    features: [
      { value: 'FURNISHED', label: 'Meublé' },
      { value: 'PARTIALLY_FURNISHED', label: 'Partiellement meublé' },
      { value: 'AIR_CONDITIONING', label: 'Climatisation' },
      { value: 'HEATING', label: 'Chauffage' },
      { value: 'FIREPLACE', label: 'Cheminée' },
      { value: 'ELEVATOR', label: 'Ascenseur' },
      { value: 'INTERCOM', label: 'Interphone' },
      { value: 'ALARM_SYSTEM', label: 'Alarme' },
      { value: 'DIGICODE', label: 'Digicode' },
    ],
  },
  {
    category: 'Électroménager',
    features: [
      { value: 'WASHING_MACHINE', label: 'Lave-linge' },
      { value: 'DRYER', label: 'Sèche-linge' },
      { value: 'DISHWASHER', label: 'Lave-vaisselle' },
      { value: 'REFRIGERATOR', label: 'Réfrigérateur' },
      { value: 'OVEN', label: 'Four' },
      { value: 'MICROWAVE', label: 'Micro-ondes' },
      { value: 'TV', label: 'Télévision' },
      { value: 'BBQGRILL', label: 'Barbecue' },
    ],
  },
  {
    category: 'Charges incluses',
    features: [
      { value: 'BILLS_INCLUDED', label: 'Toutes charges incluses' },
      { value: 'WATER_INCLUDED', label: 'Eau incluse' },
      { value: 'ELECTRICITY_INCLUDED', label: 'Électricité incluse' },
      { value: 'GAS_INCLUDED', label: 'Gaz inclus' },
      { value: 'INTERNET_INCLUDED', label: 'Internet inclus' },
      { value: 'CABLE_TV_INCLUDED', label: 'Câble TV inclus' },
      { value: 'CLEANING_INCLUDED', label: 'Ménage inclus' },
    ],
  },
  {
    category: 'Règles & Accès',
    features: [
      { value: 'PETS_ALLOWED', label: 'Animaux acceptés' },
      { value: 'SMOKING_ALLOWED', label: 'Fumeurs acceptés' },
      { value: 'WHEELCHAIR_ACCESSIBLE', label: 'Accès PMR' },
      { value: 'CONCIERGE', label: 'Concierge' },
    ],
  },
];

// Utilitaire : liste plate pour Formik (value = valeur stockée)
export const ALL_FEATURES_FLAT = PROPERTY_FEATURES_BY_CATEGORY.flatMap((cat) => cat.features);
