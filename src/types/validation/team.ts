import * as Yup from 'yup';

export const inviteTeamStep1SchemaValidation = Yup.object({
  account: Yup.object({
    name: Yup.string().required('Le nom est obligatoire'),
    email: Yup.string()
      .trim()
      .email('Adresse e-mail invalide')
      .required('L’e-mail est obligatoire'),
  }),
});
export const inviteTeamStep2SchemaValidation = Yup.object({
  permissions: Yup.array()
    .min(1, 'Veuillez sélectionner au moins une permission')
    .required('Les permissions sont requises'),
});
