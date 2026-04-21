import { ITourStep } from '../dashboard/Layout/interface/types';

export const tourSteps: ITourStep[] = [
  {
    target: "[data-tour='header']",
    title: 'Bienvenue sur votre Dashboard',
    description: 'Ici vous trouverez la recherche globale, vos notifications et votre profil.',
    position: 'bottom',
  },
  {
    target: "[data-tour='sidebar']",
    title: 'Navigation principale',
    description: 'Accédez à vos propriétés, locataires, paiements et paramètres.',
    position: 'right',
  },
  {
    target: "[data-tour='kpis']",
    title: 'Indicateurs clés (KPIs)',
    description:
      'Suivez en temps réel vos propriétés, revenus, locataires actifs et tendances de performance.',
    position: 'bottom',
  },
  {
    target: "[data-tour='quick-actions']",
    title: 'Actions rapides',
    description: 'Ajoutez une propriété, un locataire ou enregistrez un paiement en un seul clic.',
    position: 'left',
  },
  {
    target: "[data-tour='charts']",
    title: 'Analytiques & Graphiques',
    description:
      "Surveillez vos revenus mensuels et votre taux d'occupation avec des graphiques interactifs.",
    position: 'bottom',
  },
  {
    target: "[data-tour='activity']",
    title: 'Gardez un œil sur l’activité',
    description:
      'Cette section vous permet de suivre en temps réel les actions importantes liées à vos propriétés.',
    position: 'right',
  },
  {
    target: "[data-tour='finish']",
    title: 'Bienvenue dans votre dashboard',
    description:
      'Vous êtes prêt à commencer. Ajoutez vos propriétés, suivez vos locations et gérez tout facilement depuis votre tableau de bord.',
    position: 'center',
  },
];
