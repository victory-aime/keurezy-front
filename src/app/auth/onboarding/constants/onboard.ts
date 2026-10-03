import { ENUM, MODELS, VALIDATION } from '_types/*';

const TOTAL_ONBOARD_STEPS = 5;

// const onboardStepLabels = ['Introduction', 'Découverte', 'Compte', 'Agence', 'Plan', 'Terminé'];
// Compte d'abord : l'e-mail est vérifié (code) avant de créer l'agence
const onboardStepLabels = ['Compte', 'Vérification', 'Agence', 'Plan', 'Terminé'];

/** Index des étapes, pour ne pas dépendre de nombres magiques. */
const ONBOARD_STEP = { ACCOUNT: 0, VERIFY: 1, BUSINESS: 2, PLAN: 3, DONE: 4 } as const;

const onboardInitialValues: {
  account: MODELS.IAuthSignUp;
  otp: string;
  /** Code promo accepté à l'étape « Plan » (revérifié par le backend) */
  promoCode: string;
  /** Le code accepté couvre tout le prix : pas de redirection vers le paiement */
  promoFree: boolean;
  business: MODELS.ICreateAgency;
  plan: {
    planId: string;
    paymentMode: ENUM.BillingCycle;
  };
} = {
  account: {
    name: '',
    email: '',
    password: '',
  },
  otp: '',
  promoCode: '',
  promoFree: false,
  business: {
    acceptTerms: false,
    address: '',
    name: '',
    phone: '',
  },
  plan: {
    planId: '',
    paymentMode: 'MONTHLY',
  },
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0 }),
};

const onboardStepValidationSchemas = [
  VALIDATION.ONBOARD.onboardUserAccountSchema,
  VALIDATION.ONBOARD.onboardVerifyEmailSchema,
  VALIDATION.ONBOARD.onboardUserAgencySchema,
  VALIDATION.ONBOARD.onboardUserAgencySelectPlanSchema,
  null, // fin
];

const getMessage = (local_status: string, naboo_status: string) => {
  if (!local_status || !naboo_status) {
    return {
      title: 'Initialisation du paiement...',
      description: 'Veuillez patienter...',
    };
  }

  if (local_status === 'PENDING' && naboo_status === 'pending') {
    return {
      title: 'En attente de paiement',
      description: 'Veuillez finaliser votre paiement pour continuer.',
    };
  }

  if (local_status === 'PENDING' && naboo_status === 'paid') {
    return {
      title: 'Validation en cours...',
      description: 'Nous confirmons votre paiement, cela peut prendre quelques secondes.',
    };
  }

  if (local_status === 'PAID') {
    return {
      title: 'Paiement confirmé',
      description: 'Votre espace est en cours de création...',
    };
  }

  return {
    title: 'Erreur de paiement',
    description: 'Une erreur est survenue.',
  };
};

export {
  ONBOARD_STEP,
  TOTAL_ONBOARD_STEPS,
  onboardInitialValues,
  onboardStepValidationSchemas,
  slideVariants,
  onboardStepLabels,
  getMessage,
};
