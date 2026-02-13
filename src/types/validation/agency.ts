import * as Yup from "yup";
import { phoneSchema } from "./phone";

export const createAgencyValidationSchema = Yup.object().shape({
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
});

export const createAgencyStep2Schema = Yup.object().shape({
  agencyLogo: Yup.mixed<File>().required("Le logo est obligatoire"),

  documents: Yup.array()
    .of(Yup.mixed<File>().required())
    .min(1, "Au moins un document est requis"),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    "Vous devez accepter les conditions",
  ),
});

export const updateAgencyValidationSchema = Yup.object().shape({
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
  agencyLogo: Yup.mixed<File>().required("Le logo est obligatoire"),
});
