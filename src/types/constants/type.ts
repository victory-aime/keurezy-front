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
