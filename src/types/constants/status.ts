import { COMMON } from '../enum';

export const propertyStatus = [
  { label: 'Disponble', value: 'AVAILABLE' },
  { label: 'Occupé', value: 'RENTED' },
  { label: 'Reserver', value: 'RESERVED' },
];

export const buildingStatus = [
  { label: 'Disponble', value: COMMON.Status.AVAILABLE },
  { label: 'Indisponible', value: COMMON.Status.UNAVAILABLE },
  { label: 'Maintenance', value: COMMON.Status.MAINTENANCE },
];

export const landStatus = [
  { label: 'Disponble', value: COMMON.Status.AVAILABLE },
  { label: 'En cours de vente', value: COMMON.Status.CURRENTLY_ON_SALE },
  { label: 'Vendu', value: COMMON.Status.SOLD },
];

export const annonceStatus = [
  { label: 'Publié', value: COMMON.Status.ACTIVE },
  { label: 'Fermé', value: COMMON.Status.INACTIVE },
];
