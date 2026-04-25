import { ENUM, MODELS, VALIDATION } from '_types/*';

const TOTAL_ONBOARD_STEPS = 6;

const onboardStepLabels = ['Introduction', 'Découverte', 'Compte', 'Agence', 'Plan', 'Terminé'];

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
  null, // step 1
  null, // step 2
  VALIDATION.ONBOARD.onboardUserAccountSchema, // step 3
  VALIDATION.ONBOARD.onboardUserAgencySchema, // step 4
  VALIDATION.ONBOARD.onboardUserAgencySelectPlanSchema, // step 5
  null, // final step
];

export {
  TOTAL_ONBOARD_STEPS,
  onboardInitialValues,
  onboardStepValidationSchemas,
  slideVariants,
  onboardStepLabels,
};
