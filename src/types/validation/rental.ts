import * as Yup from "yup";
import { phoneSchema } from "./phone";

export const createRentalRequestSchema = Yup.object().shape({
  message: Yup.string()
    .required("Le message est obligatoire.")
    .min(4, "Le message doit contenir au moins 4 caractères.")
    .max(1000, "Le message ne doit pas dépasser 1000 caractères."),
  startDate: Yup.string().required("La date est obligatoire"),
  phone: phoneSchema(),
});
