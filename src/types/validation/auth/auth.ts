import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Adresse e-mail invalide')
    .required('Veuillez renseigner votre adresse e-mail'),

  password: Yup.string()
    .required('Veuillez saisir votre mot de passe')
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre',
    ),
});

export const createUserValidationSchema = Yup.object().shape({
  name: Yup.string().required('Le nom est obligatoire'),
  email: Yup.string().trim().email('Adresse e-mail invalide').required('L’e-mail est obligatoire'),
  password: Yup.string()
    .required('Le mot de passe est obligatoire')
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre',
    ),
});

/**
 * Demande de lien (mot de passe oublié, vérification d'e-mail) : format seulement. On ne vérifie
 * jamais ici que le compte existe, sinon le formulaire révèle quels e-mails sont inscrits ; le
 * backend répond de la même façon dans les deux cas.
 */
export const resetPasswordInitRequestValidationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Adresse e-mail invalide')
    .required('Veuillez renseigner votre adresse e-mail'),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .trim()
    .required('Veuillez renseigner le nouveau mot de passe')
    .min(12, 'Le mot de passe doit contenir au moins 12 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre',
    ),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
    .required('Veuillez confirmer le mot de passe'),
});
