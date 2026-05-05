import { ENUM, MODELS, VALIDATION } from '_types/*';

const TOTAL_ONBOARD_STEPS = 4;

// const onboardStepLabels = ['Introduction', 'Découverte', 'Compte', 'Agence', 'Plan', 'Terminé'];
const onboardStepLabels = ['Compte', 'Agence', 'Plan', 'Terminé'];

const onboardInitialValues: {
  account: MODELS.IAuthSignUp;
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
  business: {
    acceptTerms: false,
    address: '',
    description: '',
    documents: [],
    name: '',
    phone: '',
    userId: '',
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
  VALIDATION.ONBOARD.onboardUserAccountSchema, // step 1
  VALIDATION.ONBOARD.onboardUserAgencySchema, // step 2
  VALIDATION.ONBOARD.onboardUserAgencySelectPlanSchema, // step 3
  null, // final step
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
  TOTAL_ONBOARD_STEPS,
  onboardInitialValues,
  onboardStepValidationSchemas,
  slideVariants,
  onboardStepLabels,
  getMessage,
};
