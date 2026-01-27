import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email().required("veuillez renseigner votre e-mail"),
  password: Yup.string().required("veuillez saisir le mot de passe"),
});
