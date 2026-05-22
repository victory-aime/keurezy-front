import { Icons } from '_components/custom';
import { LandPaymentType } from '../enum';

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
