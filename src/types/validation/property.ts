import * as Yup from "yup";

export const createPropertySchema = Yup.object().shape({
  title: Yup.string()
    .required("Le titre du bien est obligatoire.")
    .min(4, "Le titre doit contenir au moins 4 caractères.")
    .max(50, "Le titre ne doit pas dépasser 50 caractères."),

  address: Yup.string()
    .required("L’adresse est obligatoire.")
    .min(4, "L’adresse doit contenir au moins 4 caractères.")
    .max(100, "L’adresse ne doit pas dépasser 100 caractères."),

  description: Yup.string()
    .required("La description est obligatoire.")
    .min(20, "La description doit contenir au moins 20 caractères."),

  price: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("Le prix de location est obligatoire.")
    .positive("Le prix doit être un nombre positif."),

  locationCaution: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("La caution est obligatoire.")
    .min(0, "La caution ne peut pas être négative."),

  rooms: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("Le nombre de chambres est obligatoire.")
    .min(1, "Le bien doit contenir au moins une chambre."),

  sdb: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("Le nombre de salles de bain est obligatoire.")
    .min(1, "Le bien doit contenir au moins une salle de bain."),

  surface: Yup.number()
    .typeError("Ce champ doit être un nombre.")
    .required("La superficie est obligatoire.")
    .positive("La superficie doit être un nombre positif."),

  type: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le type du bien est obligatoire.")
    .test(
      "not-empty",
      "Le type du bien est obligatoire.",
      (arr) => arr && arr[0] !== "",
    ),

  status: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le statut du bien est obligatoire.")
    .test(
      "not-empty",
      "Le statut du bien est obligatoire.",
      (arr) => arr && arr[0] !== "",
    ),

  country: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le pays est obligatoire.")
    .test(
      "not-empty",
      "Le pays est obligatoire.",
      (arr) => arr && arr[0] !== "",
    ),

  postalCode: Yup.number()
    .typeError("Le code postal doit être un nombre.")
    .required("Le code postal est obligatoire."),

  city: Yup.array()
    .of(Yup.string().required())
    .min(1, "La ville est obligatoire.")
    .test(
      "not-empty",
      "La ville est obligatoire.",
      (arr) => arr && arr[0] !== "",
    ),

  galleryImages: Yup.array()
    .of(Yup.mixed<File>().required())
    .min(1, "Au moins une image du bien est requise."),
});
