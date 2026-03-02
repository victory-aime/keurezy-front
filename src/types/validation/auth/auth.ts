import * as Yup from "yup";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Adresse e-mail invalide")
    .required("Veuillez renseigner votre adresse e-mail"),

  password: Yup.string()
    .required("Veuillez saisir votre mot de passe")
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
    ),
});

export const createUserValidationSchema = Yup.object().shape({
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
});

export const resetPasswordInitRequestValidationSchema = (
  checkEmail: (email: string) => Promise<boolean>,
) =>
  Yup.object({
    email: Yup.string()
      .trim()
      .email("Adresse e-mail invalide")
      .required("Veuillez renseigner votre adresse e-mail")
      .test(
        "email-exists",
        "Aucun compte associé à cet email",
        async function (value) {
          if (!value) return true;
          try {
            const emailExists = await checkEmail(value);
            return emailExists;
          } catch {
            return this.createError({
              message:
                "Impossible de vérifier cette adresse e-mail pour le moment",
            });
          }
        },
      ),
  });

export const resetPasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .trim()
    .required("Veuillez renseigner le nouveau mot de passe")
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Le mot de passe doit contenir une majuscule, une minuscule et un chiffre",
    ),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("newPassword")], "Les mots de passe ne correspondent pas")
    .required("Veuillez confirmer le mot de passe"),
});
