'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box, Progress, Flex, HStack, Span } from '@chakra-ui/react';
import {
  BaseButton,
  BaseModal,
  BaseText,
  BaseToast,
  FloatSwitchColorMode,
  GlobalLoader,
  Icons,
  TextVariant,
} from '_components/custom';
import { useRouter } from 'next/navigation';
import { StepUserAccount } from './StepUserAccount';
import { StepBusiness } from './StepBusiness';
import { ASSETS } from '_assets/images';
import { APP_ROUTES } from '_config/routes';
import { ENUM, MODELS } from '_types/*';
import { OnboardFinish } from './FinalStep';
import { Formik } from 'formik';
import { authClient } from '../../../lib/auth-client';
import { handleApiError } from '_utils/handleApiError';
import { StepVerifyEmail } from './StepVerifyEmail';
import { AgencyModule, CommonModule } from '_store/state-management';
import { AgencyNameWatcher } from '../../components/AgencyNameWatcher';
import {
  ONBOARD_STEP,
  TOTAL_ONBOARD_STEPS,
  getMessage,
  onboardInitialValues,
  onboardStepLabels,
  onboardStepValidationSchemas,
  slideVariants,
} from '../constants/onboard';
import { StorageKey } from '_constants/StorageKeys';
import { MotionBox } from '_constants/motion';
import { useColorMode } from '_components/ui/color-mode';
import { StepPlanSelection } from './StepPlanSelection';
import { useAgencyCheck } from '_context/agency-context';
import Image from 'next/image';
import Link from 'next/link';
import { clientRedirect } from '_utils/client-navigate';
import { isFreePlan } from '_utils/subscription';

/** Message d'erreur Better Auth lisible (repli générique). */
const authMessage = (error: { message?: string } | null | undefined, fallback: string) =>
  error?.message || fallback;

/**
 * Inscription d'une agence, « compte d'abord » : 1) compte, 2) e-mail vérifié par un code,
 * 3) agence, 4) plan, 5) fin. Le compte et la session existent avant l'agence : aucun mot de
 * passe ne transite par le paiement. Un utilisateur connecté sans agence reprend où il en était.
 */
export const MainOnboarding = ({
  planId,
  billingCycle,
  payment,
}: {
  planId?: string;
  billingCycle?: ENUM.BillingCycle;
  payment?: string;
}) => {
  const { isCheckingName, nameAlreadyExists } = useAgencyCheck();
  const { colorMode } = useColorMode();
  const navigate = useRouter();
  const {
    data: session,
    isPending: sessionPending,
    refetch: refetchSession,
  } = authClient.useSession();
  const [step, setStep] = useState<number>(ONBOARD_STEP.ACCOUNT);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingPayment, setIsValidatingPayment] = useState(false);
  const [openAgreePayment, setOpenAgreePayment] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const resumed = useRef(false);
  const formikRef = useRef<any>(null);

  const { mutateAsync: verifiedAgencyName } = AgencyModule.checkNameMutation({});
  const { data: allPacks } = CommonModule.getAllPacksQueries({});
  const { mutateAsync: createAgency } = AgencyModule.createAgencyMutation({
    mutationOptions: {
      onSuccess: async (data) => {
        // Plan payant → paiement NabooPay ; le retour reprend ici (?payment=…)
        if (data?.checkout_url) {
          localStorage.setItem(StorageKey.ONBOARD_PENDING_FORM, data.order_id);
          clientRedirect(data.checkout_url);
          return;
        }
        // Plan Gratuit → agence créée : la session porte désormais le rôle OWNER
        await refetchSession();
        goTo(ONBOARD_STEP.DONE);
      },
    },
  });
  const { data: paymentStatus } = CommonModule.getPaymentStatusQueries({
    params: { orderId: orderId! },
    queryOptions: {
      enabled: !!orderId && !!session?.user,
      refetchInterval: (query: any) =>
        ['PAID', 'FAILED', 'CANCELLED'].includes(query?.state?.data?.local_status) ? false : 3000,
    },
  });

  const goTo = (target: number) => {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  const stepsConfig = useMemo(
    () => [
      { component: () => <StepUserAccount />, blocking: true },
      {
        component: () => (
          <StepVerifyEmail
            email={session?.user?.email ?? formikRef.current?.values?.account?.email ?? ''}
            onResend={sendCode}
          />
        ),
        blocking: true,
      },
      { component: () => <StepBusiness initialDocUrls={[]} />, blocking: true },
      {
        component: () => (
          <StepPlanSelection
            allPacks={allPacks ?? []}
            value={{ selectedPlanId: planId!, billingCycle }}
          />
        ),
        blocking: true,
      },
      { component: () => <OnboardFinish />, blocking: false },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPacks, planId, billingCycle, session?.user?.email],
  );

  // Reprise : un utilisateur connecté reprend à l'étape qui manque (une seule fois)
  useEffect(() => {
    if (sessionPending || resumed.current || payment) return;
    resumed.current = true;
    const user = session?.user;
    if (!user) return;
    if (user.role === 'OWNER' || user.role === 'AGENT') {
      navigate.replace(APP_ROUTES.DASHBOARD);
      return;
    }
    formikRef.current?.setFieldValue('account.email', user.email);
    formikRef.current?.setFieldValue('account.name', user.name);
    setStep(user.emailVerified ? ONBOARD_STEP.BUSINESS : ONBOARD_STEP.VERIFY);
  }, [session, sessionPending, payment]);

  // Retour du paiement : suivi par la route authentifiée, jusqu'au statut final
  useEffect(() => {
    if (!payment) return;
    setStep(ONBOARD_STEP.PLAN);
    setIsValidatingPayment(true);
    setOrderId(localStorage.getItem(StorageKey.ONBOARD_PENDING_FORM));
  }, [payment]);

  useEffect(() => {
    if (!paymentStatus) return;
    const { local_status, naboo_status } = paymentStatus;
    if (local_status === 'PAID') {
      localStorage.removeItem(StorageKey.ONBOARD_PENDING_FORM);
      setIsValidatingPayment(false);
      refetchSession();
      setStep(ONBOARD_STEP.DONE);
    } else if (local_status === 'FAILED' || naboo_status === 'cancelled') {
      setIsValidatingPayment(false);
      BaseToast({
        title: 'Paiement non validé',
        description: 'Votre agence n’a pas été créée. Vous pouvez choisir un plan à nouveau.',
      });
    }
  }, [paymentStatus]);

  /** Envoie (ou renvoie) le code de vérification à l'adresse du compte. */
  async function sendCode(): Promise<boolean> {
    const email = session?.user?.email ?? formikRef.current?.values?.account?.email;
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    });
    if (error) {
      handleApiError({ status: error.status, message: authMessage(error, 'Envoi impossible.') });
      return false;
    }
    return true;
  }

  /** Étape 1 : crée le compte (sans session tant que l'e-mail n'est pas vérifié), envoie le code. */
  const createAccount = async () => {
    const { name, email, password } = formikRef.current.values.account;
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      handleApiError({
        status: error.status,
        message:
          error.code === 'USER_ALREADY_EXISTS' ||
          error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'
            ? 'Un compte existe déjà avec cet e-mail : connectez-vous pour reprendre votre inscription.'
            : authMessage(error, 'Création du compte impossible.'),
      });
      return false;
    }
    return sendCode();
  };

  /** Étape 2 : vérifie le code ; la session s'ouvre (ou on se connecte avec le mot de passe saisi). */
  const verifyCode = async () => {
    const { account, otp } = formikRef.current.values;
    const email = session?.user?.email ?? account.email;
    const { error } = await authClient.emailOtp.verifyEmail({ email, otp });
    if (error) {
      formikRef.current.setFieldError('otp', authMessage(error, 'Code invalide ou expiré.'));
      return false;
    }
    const { data } = await authClient.getSession();
    if (!data?.user && account.password) {
      await authClient.signIn.email({ email, password: account.password });
    }
    await refetchSession();
    return true;
  };

  /** Étape 4 : inscription de l'agence (Gratuit : créée ; payant : lien de paiement). */
  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      const { business, plan } = formikRef.current.values;
      const payload: MODELS.ICreateAgency = {
        name: business.name,
        email: business.email,
        description: business.description,
        address: business.address,
        phone: business.phone,
        acceptTerms: business.acceptTerms,
        plan: { planId: plan?.planId, billingCycle: plan?.paymentMode },
      };
      const formData = new FormData();
      formData.append('data', JSON.stringify(payload));
      (business.documents ?? []).forEach((file: File) => formData.append('documents', file));
      await createAgency({ payload: { data: formData as MODELS.ICreateAgency } });
    } finally {
      setIsLoading(false);
    }
  };

  const markAllTouched = (errors: any): any => {
    if (typeof errors !== 'object' || errors === null) return true;
    return Object.keys(errors).reduce((acc: any, key) => {
      acc[key] = markAllTouched(errors[key]);
      return acc;
    }, {});
  };

  const canNavigateToStep = async (targetStep: number) => {
    if (!formikRef.current) return false;
    if (targetStep <= step) return true;

    for (let i = 0; i < targetStep; i++) {
      if (!stepsConfig[i].blocking) continue;
      const schema = onboardStepValidationSchemas[i];
      if (!schema) continue;

      try {
        await schema.validate(formikRef.current.values, { abortEarly: false });
      } catch (err: any) {
        const touched = markAllTouched(
          err.inner?.reduce((acc: any, e: any) => {
            acc[e.path] = e.message;
            return acc;
          }, {}),
        );
        formikRef.current.setTouched(touched);
        return false;
      }
    }
    return true;
  };

  const nexStep = async () => {
    const schema = onboardStepValidationSchemas[step];
    if (schema && formikRef.current) {
      const errors = await formikRef.current.validateForm();
      if (Object.keys(errors).length > 0) {
        const touched = markAllTouched(errors);
        formikRef.current.setTouched(touched);
        return;
      }
    }

    setIsLoading(true);
    try {
      // Compte : déjà créé si l'utilisateur est connecté (reprise)
      if (step === ONBOARD_STEP.ACCOUNT && !session?.user) {
        if (!(await createAccount())) return;
      }
      if (step === ONBOARD_STEP.VERIFY && !(await verifyCode())) return;

      if (step === ONBOARD_STEP.PLAN) {
        const plan = formikRef.current?.values?.plan;
        const selectedPlan = allPacks?.find((p: any) => p.id === plan?.planId);
        // Payant : confirmation avant la redirection ; Gratuit : création directe
        if (!isFreePlan(selectedPlan)) setOpenAgreePayment(true);
        else await completeOnboarding();
        return;
      }

      if (step === ONBOARD_STEP.DONE) {
        localStorage.setItem(StorageKey.ENABLED_GUIDED_TOUR, 'true');
        navigate.push(APP_ROUTES.DASHBOARD);
        return;
      }
      goTo(step + 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Retour en arrière : jamais avant la vérification une fois le compte créé, ni après la fin
  const firstReachable = session?.user
    ? session.user.emailVerified
      ? ONBOARD_STEP.BUSINESS
      : ONBOARD_STEP.VERIFY
    : ONBOARD_STEP.ACCOUNT;

  const prevStep = () => {
    if (step === ONBOARD_STEP.DONE || step <= firstReachable) return;
    goTo(step - 1);
  };

  const goToStep = async (i: number) => {
    // Pas de navigation après la fin, ni vers une étape déjà franchie côté serveur
    if (step === ONBOARD_STEP.DONE || i < firstReachable || i > step) return;
    const allowed = await canNavigateToStep(i);
    if (!allowed) return;
    setDirection(i > step ? 1 : -1);
    setStep(i);
  };

  const progress = ((step + 1) / TOTAL_ONBOARD_STEPS) * 100;
  const CurrentStep = useMemo(() => stepsConfig[step].component, [stepsConfig, step]);

  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={onboardInitialValues}
      validationSchema={onboardStepValidationSchemas[step]}
      validateOnMount
      validate={() => {
        const errors: any = {};
        if (step === 1 && nameAlreadyExists && !isCheckingName) {
          errors.business = { name: "Impossible d'utiliser ce nom veuillez changer" };
        }
        return errors;
      }}
      onSubmit={() => {}}
    >
      <Flex direction="column" minH="100vh">
        <AgencyNameWatcher verifiedAgencyName={verifiedAgencyName} />
        {isValidatingPayment && (
          <GlobalLoader
            loader
            renderSpinnerContent={
              <>
                <BaseText color="white" variant={TextVariant.H3}>
                  {getMessage(paymentStatus?.local_status!, paymentStatus?.naboo_status!).title}
                </BaseText>
                <BaseText color="white">
                  {
                    getMessage(paymentStatus?.local_status!, paymentStatus?.naboo_status!)
                      .description
                  }
                </BaseText>
              </>
            }
          />
        )}

        {/* Header */}
        <Box
          as="header"
          borderBottom="1px solid"
          borderColor="border"
          backdropFilter="blur(8px)"
          position="sticky"
          top={0}
          zIndex={50}
        >
          <Flex maxW="6xl" mx="auto" px={4} h="64px" align="center" justify="space-between">
            <Link href={APP_ROUTES.ROOT}>
              <Image
                src={colorMode === 'light' ? ASSETS.LOGO : ASSETS.LOGO_DARK}
                alt="logo"
                width={180}
                height={180}
              />
            </Link>

            <HStack gap={4}>
              <BaseText fontSize="sm" display={{ base: 'none', sm: 'block' }}>
                Étape {step + 1} / {TOTAL_ONBOARD_STEPS}
              </BaseText>
              <Box w="128px">
                <Progress.Root
                  size="sm"
                  value={progress}
                  colorPalette="primary"
                  variant="subtle"
                  animated
                >
                  <Progress.Track borderRadius="full">
                    <Progress.Range bgColor="primary.500" />
                  </Progress.Track>
                </Progress.Root>
              </Box>
            </HStack>
          </Flex>
        </Box>

        {/* Step indicators */}
        <Box maxW="6xl" mx="auto" px={4} py={4} w="full">
          <HStack gap={1.5} justify="center" flexWrap="wrap">
            {onboardStepLabels.map((label, i) => (
              <HStack key={i} gap={0}>
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  onClick={() => goToStep(i)}
                  cursor="pointer"
                >
                  <HStack gap={1.5}>
                    <Flex
                      align="center"
                      justify="center"
                      h="28px"
                      w="28px"
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="semibold"
                      bg={i === step ? 'primary.500' : i < step ? 'tertiary.100' : 'gray.100'}
                      color={i === step ? 'white' : i < step ? 'tertiary.600' : 'gray.500'}
                      boxShadow={i === step ? 'md' : 'none'}
                      transition="all 0.2s"
                    >
                      {i < step ? <Icons.Check size={13} /> : i + 1}
                    </Flex>
                    <BaseText
                      fontSize="xs"
                      fontWeight="medium"
                      display={{ base: 'none', md: 'block' }}
                      color={i === step ? 'primary.500' : i < step ? 'tertiary.500' : 'gray.500'}
                    >
                      {label}
                    </BaseText>
                  </HStack>
                </MotionBox>
                {i < TOTAL_ONBOARD_STEPS - 1 && (
                  <Box
                    w={{ base: '16px', lg: '40px' }}
                    h="2px"
                    mx={1}
                    borderRadius="full"
                    bg={i < step ? 'tertiary.200' : 'gray.200'}
                    transition="all 0.3s"
                  />
                )}
              </HStack>
            ))}
          </HStack>
        </Box>

        {/* Content */}
        <Box flex={1} mx="auto" px={4} py={{ base: 4, md: 6 }} w="full" overflow="hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <MotionBox
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              mt="30px"
            >
              <CurrentStep />
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Footer */}
        <Box as="footer" borderTop="1px solid" borderColor="inherit" position="sticky" bottom={0}>
          <Flex maxW="6xl" mx="auto" px={4} h="80px" align="center" justify="space-between">
            <BaseButton
              variant="outline"
              onClick={() => (step === 0 ? navigate.push(APP_ROUTES.ROOT) : prevStep())}
              leftIcon={<Icons.IoIosArrowRoundBack size={16} />}
            >
              <Span display={{ base: 'none', sm: 'inline' }}>Précédent</Span>
            </BaseButton>

            <HStack gap={1.5}>
              {Array.from({ length: TOTAL_ONBOARD_STEPS }).map((_, i) => (
                <Box
                  key={i}
                  h="6px"
                  w={i === step ? '24px' : '6px'}
                  borderRadius="full"
                  bg={i === step ? 'primary.500' : i < step ? 'primary.200' : 'gray.200'}
                  transition="all 0.3s"
                />
              ))}
            </HStack>

            <BaseButton
              onClick={nexStep}
              isLoading={isLoading}
              rightIcon={
                step === TOTAL_ONBOARD_STEPS - 1 ? (
                  <Icons.Rocket size={16} />
                ) : (
                  <Icons.ArrowRight size={16} />
                )
              }
            >
              {step === TOTAL_ONBOARD_STEPS - 1 ? (
                'Ouvrir mon tableau de bord'
              ) : (
                <Span display={{ base: 'none', sm: 'inline' }}>Suivant</Span>
              )}
            </BaseButton>
          </Flex>
        </Box>

        <FloatSwitchColorMode />

        {/* Modale de confirmation avant redirection NabooPay */}
        <BaseModal
          size="xs"
          isOpen={openAgreePayment}
          showCloseButton={false}
          closeOnEscape={false}
          title="Confirmer le paiement"
          buttonSaveTitle="Continuer vers le paiement"
          icon={<Icons.Payment />}
          buttonCancelTitle="Annuler"
          onChange={() => setOpenAgreePayment(false)}
          onClick={async () => {
            setOpenAgreePayment(false);
            await completeOnboarding();
          }}
        >
          <BaseText textAlign="justify" fontSize="sm">
            Vous allez être redirigé vers une interface de paiement sécurisée afin de valider votre
            abonnement. Veuillez vérifier les informations affichées avant de confirmer votre
            paiement.
          </BaseText>
        </BaseModal>
      </Flex>
    </Formik>
  );
};
