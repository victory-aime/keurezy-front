import * as Yup from "yup";

export const createLandSchema = Yup.object().shape({
  title: Yup.string()
    .required("Le titre du bien est obligatoire.")
    .min(4, "Le titre doit contenir au moins 4 caractères.")
    .max(50, "Le titre ne doit pas dépasser 50 caractères."),

  area: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("La superficie est obligatoire.")
    .positive("La superficie doit être un nombre positif."),

  purchasePrice: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("Le prix de vente est obligatoire.")
    .positive("Le prix doit être un nombre positif."),

  landOwner: Yup.string(),

  status: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le statut du bien est obligatoire.")
    .test(
      "not-empty",
      "Le statut du bien est obligatoire.",
      (arr) => arr && arr[0] !== "",
    ),

  address: Yup.string()
    .required("L’adresse est obligatoire.")
    .min(4, "L’adresse doit contenir au moins 4 caractères.")
    .max(100, "L’adresse ne doit pas dépasser 100 caractères."),

  district: Yup.string().min(
    5,
    "Le quartier doit contenir au moins 5 caractères.",
  ),

  city: Yup.array()
    .of(Yup.string().required())
    .min(1, "La ville est obligatoire.")
    .test(
      "not-empty",
      "La ville est obligatoire.",
      (arr) => arr && arr[0] !== "",
    ),
});
