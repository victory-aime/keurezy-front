import * as Yup from "yup";

export const createBuildingSchema = Yup.object().shape({
  name: Yup.string()
    .required("Le nom du bâtiment du bien est obligatoire.")
    .min(4, "Le nom doit contenir au moins 4 caractères.")
    .max(100, "Le nom ne doit pas dépasser 50 caractères."),

  buildingOwner: Yup.string().required(
    "Le nom du propriétaire du bâtiment est obligatoire.",
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
