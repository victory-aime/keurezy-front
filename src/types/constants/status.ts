import { COMMON } from "../enum";

export const propertyStatus = [
  { label: "Disponble", value: "AVAILABLE" },
  { label: "Occupé", value: "RENTED" },
  { label: "Reserver", value: "RESERVED" },
];

export const buildingStatus = [
  { label: "Disponble", value: COMMON.Status.AVAILABLE },
  { label: "Indisponible", value: COMMON.Status.UNAVAILABLE },
  { label: "Maintenance", value: COMMON.Status.MAINTENANCE },
];
