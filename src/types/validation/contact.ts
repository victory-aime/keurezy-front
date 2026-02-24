import * as Yup from "yup";
import { phoneSchema } from "./phone";

export const ContactValidationSchema = Yup.object({
  fullName: Yup.string()
    .required("Le nom est obligatoire")
    .min(4, "le nom doit contenir au moins 4 caractères")
    .max(50, "le nom ne doit pas depasser 50 caractères"),
  email: Yup.string()
    .trim()
    .email("Adresse e-mail invalide")
    .required("Veuillez renseigner votre adresse e-mail"),
  phone: phoneSchema(),
  subject: Yup.string()
    .required("Le sujet est obligatoire")
    .min(4, "le sujet doit contenir au moins 4 caractères")
    .max(50, "le sujet ne doit pas depasser 50 caractères"),
  message: Yup.string()
    .required("Le message est obligatoire")
    .min(50, "le message doit contenir au moins 50 caractères")
    .max(1000, "le message ne doit pas depasser 20 caractères"),
});
