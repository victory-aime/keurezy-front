import * as Yup from "yup";
import { phoneSchema } from "../phone";

export const createUserValidationSchema = Yup.object().shape({
  lastName: Yup.string().required("Le nom est obligatoire"),
  firstName: Yup.string().required("Le prénom est obligatoire"),
  email: Yup.string()
    .trim()
    .email("Adresse e-mail invalide")
    .required("L’e-mail est obligatoire"),
  phone: phoneSchema(),
  password: Yup.string().required("veuillez saisir le mot de passe"),
});

export const passwordValidations = (password: string = "") => [
  { label: "Au moins 12 caractères", test: password.length >= 12 },
  { label: "Une lettre majuscule (A-Z)", test: /[A-Z]/.test(password) },
  { label: "Une lettre minuscule (a-z)", test: /[a-z]/.test(password) },
  { label: "Un chiffre (0-9)", test: /\d/.test(password) },
  {
    label: "Un caractère spécial (!@#$%^&*)",
    test: /[!@#$%^&*]/.test(password),
  },
];
