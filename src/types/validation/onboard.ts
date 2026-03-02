import * as Yup from "yup";
import { phoneSchema } from "./phone";

export const onboardUserAccountSchema = Yup.object({
  account: Yup.object({
    name: Yup.string().required("Le nom est obligatoire"),
    email: Yup.string()
      .trim()
      .email("Adresse e-mail invalide")
      .required("L’e-mail est obligatoire"),
    password: Yup.string()
      .required("Le mot de passe est obligatoire")
      .min(12, "Le mot de passe doit contenir au moins 12 caractères")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
      ),
  }),
});

export const onboardUserAgencySchema = Yup.object({
  business: Yup.object({
    name: Yup.string()
      .required("Le nom de l'agence est requise")
      .min(4, "le nom doit contenir au moins 4 caractères")
      .max(20, "le nom ne doit pas depasser 20 caractères"),
    address: Yup.string()
      .required("l'addresse est obligatoire")
      .min(4, "l'addresse ne doit au moins avoir 4 caractères")
      .max(100, "l'addresse ne doit pas depasser 100 caractères"),
    description: Yup.string()
      .required("Description obligatoire")
      .min(20, "la description ne doit au moins avoir 20 caractères"),
    phone: phoneSchema(),
    documents: Yup.array()
      .of(Yup.mixed<File>().required())
      .min(1, "Au moins un document est requis"),
    acceptTerms: Yup.boolean().oneOf(
      [true],
      "Vous devez accepter les conditions",
    ),
  }),
});
