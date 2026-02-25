import * as Yup from "yup";
import { phoneSchema } from "./phone";

export const createRentalRequestSchema = Yup.object().shape({
  message: Yup.string()
    .required("L’adresse est obligatoire.")
    .min(4, "L’adresse doit contenir au moins 4 caractères.")
    .max(100, "L’adresse ne doit pas dépasser 100 caractères."),

  phone: phoneSchema(),
});
