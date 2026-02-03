import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Adresse e-mail invalide")
    .required("Veuillez renseigner votre adresse e-mail"),

  password: Yup.string()
    .required("Veuillez saisir votre mot de passe")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
  //   "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
  // ),
});

export const createUserValidationSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est obligatoire"),
  email: Yup.string()
    .trim()
    .email("Adresse e-mail invalide")
    .required("L’e-mail est obligatoire"),
  password: Yup.string().required("Le mot de passe est obligatoire"),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email("Adresse e-mail invalide")
    .required("Veuillez renseigner votre adresse e-mail"),
});
