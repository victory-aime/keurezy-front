import * as Yup from 'yup';
import { phoneSchema } from './phone';

export const createAgencyValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Le nom de l'agence est requise")
    .min(4, 'le nom doit contenir au moins 4 caractères')
    .max(20, 'le nom ne doit pas depasser 20 caractères'),
  address: Yup.string()
    .required("l'addresse est obligatoire")
    .min(4, "l'addresse ne doit au moins avoir 4 caractères")
    .max(100, "l'addresse ne doit pas depasser 100 caractères"),
  description: Yup.string()
    .required('Description obligatoire')
    .min(20, 'la description ne doit au moins avoir 20 caractères'),
  phone: phoneSchema(),
  documents: Yup.array().of(Yup.mixed<File>().required()).min(1, 'Au moins un document est requis'),
  acceptTerms: Yup.boolean().oneOf([true], 'Vous devez accepter les conditions'),
});

export const createAgencyStep2Schema = Yup.object().shape({});

export const updateAgencyValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Le nom de l'agence est requise")
    .min(4, 'le nom doit contenir au moins 4 caractères')
    .max(20, 'le nom ne doit pas depasser 20 caractères'),
  address: Yup.string()
    .required("l'addresse est obligatoire")
    .min(4, "l'addresse ne doit au moins avoir 4 caractères")
    .max(100, "l'addresse ne doit pas depasser 100 caractères"),
  description: Yup.string()
    .required('Description obligatoire')
    .min(20, 'la description ne doit au moins avoir 20 caractères'),
  phone: phoneSchema(),
});

/** Mêmes formats que le backend (qui revalide) ; tous facultatifs à l'enregistrement. */
export const agencyLegalInfoValidations = Yup.object({
  companyName: Yup.string().trim().min(3, '3 caractères minimum').max(150),
  ninea: Yup.string()
    .transform((v) => v?.replace(/\s+/g, '').toUpperCase())
    .matches(/^[0-9A-Z]{7,14}$/, {
      message: '7 à 14 chiffres ou lettres',
      excludeEmptyString: true,
    }),
  rccm: Yup.string()
    .transform((v) => v?.replace(/\s+/g, '').toUpperCase())
    .matches(/^[0-9A-Z][0-9A-Z./-]{5,39}$/, {
      message: 'Format attendu : SN-DKR-2020-B-12345',
      excludeEmptyString: true,
    }),
});

export const agencyFacturationValidations = Yup.object({
  billingAddress: Yup.string().trim().min(5, '5 caractères minimum').max(255),
  billingEmail: Yup.string().trim().email('E-mail invalide'),
  bankName: Yup.string().trim().min(2, '2 caractères minimum').max(100),
  bankAccount: Yup.string()
    .trim()
    .matches(/^[0-9A-Za-z ]{10,40}$/, {
      message: '10 à 40 chiffres ou lettres',
      excludeEmptyString: true,
    }),
  mobileMoneyNumber: phoneSchema(),
});
