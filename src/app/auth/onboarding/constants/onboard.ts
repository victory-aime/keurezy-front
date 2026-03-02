import { MODELS, VALIDATION } from "_types/*";

const TOTAL_ONBOARD_STEPS = 5;

const onboardStepLabels = [
  "Introduction",
  "Découverte",
  "Compte",
  "Agence",
  "Terminé",
];

const onboardInitialValues: {
  account: MODELS.IAuthSignUp;
  business: MODELS.ICreateAgency;
} = {
  account: {
    name: "",
    email: "",
    password: "",
  },
  business: {
    acceptTerms: false,
    address: "",
    description: "",
    documents: [],
    name: "",
    phone: "",
    userId: "",
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
  null, // final step
];

export {
  TOTAL_ONBOARD_STEPS,
  onboardInitialValues,
  onboardStepValidationSchemas,
  slideVariants,
  onboardStepLabels,
};
