import { ITourStep } from "../dashboard/Layout/interface/types";

export const tourSteps: ITourStep[] = [
  {
    target: "[data-tour='header']",
    title: "Bienvenue sur votre Dashboard",
    description:
      "Ici vous trouverez la recherche globale, vos notifications et votre profil.",
    position: "bottom",
  },
  {
    target: "[data-tour='sidebar']",
    title: "Navigation principale",
    description:
      "Accédez à vos propriétés, locataires, paiements et paramètres.",
    position: "right",
  },
];
