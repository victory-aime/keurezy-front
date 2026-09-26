import * as Yup from 'yup';
import { minAvailabilityEndDate } from '_utils/rental-availability';
import { rentalTypes } from '../constants/type';
import { RentalType } from '../enum';

// Champ numérique vidé ('' en saisie) → null : message « obligatoire » ou champ facultatif, pas « doit être un nombre »
const optionalNumber = () =>
  Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .nullable()
    .typeError('Ce champ doit être un nombre.');

const formatDate = (value: string) => value.split('-').reverse().join('/');

// Une période couvre au moins une unité du type de location (règle portée par le backend)
const availabilitySchema = (rentalType: RentalType) =>
  Yup.object({
    startDate: Yup.string().required('La date de début est obligatoire.'),
    endDate: Yup.string()
      .required('La date de fin est obligatoire.')
      .test(
        'after-start',
        'La date de fin doit être postérieure ou égale à la date de début.',
        function (endDate) {
          const { startDate } = this.parent as { startDate?: string };
          return !startDate || !endDate || endDate.slice(0, 10) >= startDate.slice(0, 10);
        },
      )
      .test('min-span', function (endDate) {
        const { startDate } = this.parent as { startDate?: string };
        const minEndDate = minAvailabilityEndDate(rentalType, startDate);
        if (!minEndDate || !endDate || endDate.slice(0, 10) >= minEndDate) return true;

        const meta = rentalTypes.find((type) => type.value === rentalType);
        return this.createError({
          message: `La période doit couvrir au moins ${meta?.minAvailability} : fin au plus tôt le ${formatDate(minEndDate)}.`,
        });
      }),
  });

// Règles identiques à RentalConfigService côté backend (source de vérité)
export const rentalConfigSchema = Yup.object({
  rentalType: Yup.string().required(),
  price: optionalNumber()
    .required('Le prix est obligatoire.')
    .positive('Le prix doit être un nombre positif.'),
  deposit: optionalNumber().min(0, 'La caution ne peut pas être négative.'),
  minDuration: optionalNumber()
    .integer('La durée doit être un nombre entier.')
    .min(1, 'La durée minimale doit être au moins 1.'),
  maxDuration: optionalNumber()
    .integer('La durée doit être un nombre entier.')
    .min(1, 'La durée maximale doit être au moins 1.')
    .test(
      'gte-min',
      'La durée maximale doit être supérieure ou égale à la durée minimale.',
      function (maxDuration) {
        const { minDuration } = this.parent as { minDuration?: number | null };
        return !maxDuration || !minDuration || maxDuration >= minDuration;
      },
    ),
  isActive: Yup.boolean(),
  availabilities: Yup.array().when('rentalType', ([rentalType], schema) =>
    schema.of(availabilitySchema(rentalType as RentalType)),
  ),
});

export const createPropertySchema = Yup.object().shape({
  title: Yup.string()
    .required('Le titre du bien est obligatoire.')
    .min(4, 'Le titre doit contenir au moins 4 caractères.')
    .max(50, 'Le titre ne doit pas dépasser 50 caractères.'),

  rooms: optionalNumber()
    .required('Le nombre de chambres est obligatoire.')
    .min(1, 'Le bien doit contenir au moins une chambre.'),

  bathrooms: optionalNumber()
    .required('Le nombre de salles de bain est obligatoire.')
    .min(1, 'Le bien doit contenir au moins une salle de bain.'),

  area: optionalNumber()
    .required('La superficie est obligatoire.')
    .positive('La superficie doit être un nombre positif.'),

  type: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Le type du bien est obligatoire.')
    .test('not-empty', 'Le type du bien est obligatoire.', (arr) => arr && arr[0] !== ''),

  status: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Le statut du bien est obligatoire.')
    .test('not-empty', 'Le statut du bien est obligatoire.', (arr) => arr && arr[0] !== ''),

  // Le prix et la caution du bien sont dérivés des modalités de location (backend)
  rentalConfigs: Yup.array()
    .of(rentalConfigSchema)
    .min(1, 'Sélectionnez au moins une modalité de location.')
    .required('Sélectionnez au moins une modalité de location.'),

  hasBatiment: Yup.boolean().required(),

  batimentId: Yup.array().when('hasBatiment', {
    is: (val: boolean) => val === true,
    then: (schema) =>
      schema
        .of(Yup.string().required())
        .test('not-empty', 'Le bâtiment est obligatoire.', (arr) => arr && arr[0] !== ''),
    otherwise: (schema) => schema.nullable(),
  }),

  propertyNumber: Yup.string().when('hasBatiment', {
    is: (val: boolean) => val === true,
    then: (schema) => schema.required('Le numéro est obligatoire.'),
    otherwise: (schema) => schema.nullable(),
  }),

  propertyOwner: Yup.string().when('hasBatiment', {
    is: (val: boolean) => val === false,
    then: (schema) => schema.required('Le nom du propriétaire est obligatoire.'),
    otherwise: (schema) => schema.nullable(),
  }),

  address: Yup.string().when('hasBatiment', {
    is: (val: boolean) => val === false,
    then: (schema) =>
      schema
        .required('L’adresse est obligatoire.')
        .min(4, 'L’adresse doit contenir au moins 4 caractères.')
        .max(100, 'L’adresse ne doit pas dépasser 100 caractères.'),
    otherwise: (schema) => schema.nullable(),
  }),

  district: Yup.string().when('hasBatiment', {
    is: (val: boolean) => val === false,
    then: (schema) =>
      schema
        .required('Le quartier est obligatoire.')
        .min(4, 'Le quartier doit contenir au moins 5 caractères.')
        .max(100, 'Le quartier ne doit pas dépasser 100 caractères.'),
    otherwise: (schema) => schema.nullable(),
  }),

  city: Yup.array().when('hasBatiment', {
    is: (val: boolean) => val === false,
    then: (schema) =>
      schema
        .of(Yup.string().required())
        .min(1, 'La ville est obligatoire.')
        .test('not-empty', 'La ville est obligatoire.', (arr) => arr && arr[0] !== ''),
    otherwise: (schema) => schema.nullable(),
  }),
});
