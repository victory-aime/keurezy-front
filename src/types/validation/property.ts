import * as Yup from "yup";

export const createPropertySchema = Yup.object().shape({
  title: Yup.string()
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

  price: Yup.number()
    .typeError("Le montant doit être un nombre")
    .required("Les frais de location sont obligatoires"),
  rooms: Yup.number()
    .typeError("La valeur doit être un nombre")
    .required("Le nombre de chambre est obligatoire"),
  surface: Yup.number()
    .typeError("La superficie doit être un nombre")
    .required("La superficie de la propriété est obligatoire"),
  type: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le type de location est obligatoire")
    .test(
      "not-empty",
      "Le type de location est obligatoire",
      (arr) => arr && arr[0] !== "",
    ),
  country: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le pays est obligatoire")
    .test(
      "not-empty",
      "Le pays est obligatoire",
      (arr) => arr && arr[0] !== "",
    ),

  city: Yup.array()
    .of(Yup.string().required())
    .min(1, "La ville est obligatoire")
    .test(
      "not-empty",
      "La ville est obligatoire",
      (arr) => arr && arr[0] !== "",
    ),
  galleryImages: Yup.array()
    .of(Yup.mixed<File>().required())
    .min(1, "Au moins une image de la propriété est requise"),
});
