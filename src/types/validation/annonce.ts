import * as Yup from 'yup';

export const annonceSchema = Yup.object().shape({
  title: Yup.string()
    .required("Le titre de l'annonce est obligatoire.")
    .min(4, 'Le titre doit contenir au moins 4 caractères.')
    .max(100, 'Le titre ne doit pas dépasser 100 caractères.'),

  description: Yup.string().required('La description est obligatoire.'),

  status: Yup.array()
    .of(Yup.string().required())
    .min(1, "Le statut de l'annonce est obligatoire.")
    .test('not-empty', "Le statut de l'annonce est obligatoire.", (arr) => arr && arr[0] !== ''),

  propertyId: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Veuillez selectionner une propriété.')
    .test('not-empty', 'La propriéte est obligatoire.', (arr) => arr && arr[0] !== ''),

  galleryImages: Yup.array()
    .of(Yup.mixed<File>().required())
    .min(1, 'Au moins une image de la propriété est requise'),
});
