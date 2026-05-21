import { timeToMinutes } from '_components/custom';
import * as Yup from 'yup';

export const visitSchema = Yup.object({
  title: Yup.string()
    .required('Le titre est obligatoire.')
    .min(4, 'Le titre doit contenir au moins 4 caractères.')
    .max(100, 'Le titre ne doit pas dépasser 100 caractères.'),

  scheduledAt: Yup.string().required('Le date est obligatoire.'),

  leadId: Yup.array()
    .of(Yup.string().required())
    .min(1, 'La demande est obligatoire.')
    .test('not-empty', 'La demande est obligatoire.', (arr) => arr && arr[0] !== ''),
  status: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Le statut du bien est obligatoire.')
    .test('not-empty', 'Le statut du bien est obligatoire.', (arr) => arr && arr[0] !== ''),
  startTime: Yup.string().required("l'heure de début est obligatoire"),
  endTime: Yup.string()
    .required("l'heure de fin est obligatoire")
    .test(
      'is-after-start',
      "L'heure de fin doit être postérieure à l'heure de début",
      function (endTime) {
        const { startTime } = this.parent;

        const start = timeToMinutes(startTime);
        const end = timeToMinutes(endTime);

        if (isNaN(start) || isNaN(end)) return false;

        return end > start;
      },
    ),
});
