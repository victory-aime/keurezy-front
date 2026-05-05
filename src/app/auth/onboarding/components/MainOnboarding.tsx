'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box, Progress, Flex, HStack, Text, Span } from '@chakra-ui/react';
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
import { StepUserAccount } from '../components/StepUserAccount';
import { StepBusiness } from '../components/StepBusiness';
import { ASSETS } from '_assets/images';
import { APP_ROUTES } from '_config/routes';
import { ENUM, MODELS } from '_types/*';
import { OnboardFinish } from '../components/FinalStep';
import { Formik } from 'formik';
import { useAuth } from '_hooks/useAuth';
import { AgencyModule, CommonModule } from '_store/state-management';
import { AgencyNameWatcher } from '../../components/AgencyNameWatcher';
import {
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

export const MainOnboarding = ({
  planId,
  billingCycle,
  payment,
}: {
  planId?: string;
  billingCycle?: ENUM.BillingCycle;
  payment?: string;
}) => {
  const { login } = useAuth();
  const { isCheckingName, nameAlreadyExists } = useAgencyCheck();
  const { colorMode } = useColorMode();
  const navigate = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingPayment, setIsValidatingPayment] = useState(false);
  const [openAgreePayment, setOpenAgreePayment] = useState(false);
  const [initialDocUrls, setInitialDocUrls] = useState<string[] | undefined>([]);
  const [enabledPolling, setEnabledPolling] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const formikRef = useRef<any>(null);

  const { mutateAsync: verifiedAgencyName } = AgencyModule.checkNameMutation({});
  const { data: allPacks } = CommonModule.getAllPacksQueries({});
  const { mutateAsync: createAgency } = AgencyModule.createAgencyMutation({
    mutationOptions: {
      onSuccess: async (data) => {
        // cas subscription → redirection paiement
        if (data?.checkout_url) {
          window.location.href = data.checkout_url;
          localStorage.setItem(StorageKey.ONBOARD_PENDING_FORM, data?.order_id);
          setOrderId(data?.order_id);
          return;
        }
        // cas commission → direct success
        await login({
          email: formikRef.current.values.account.email,
          password: formikRef.current.values.account.password,
        }).then(() => {
          setStep(TOTAL_ONBOARD_STEPS - 1);
          setIsValidatingPayment(false);
        });
      },
    },
  });
  const { data: paymentStatus } = CommonModule.getPaymentStatusQueries({
    params: { orderId },
    queryOptions: {
      enabled: !!orderId && enabledPolling,
      refetchInterval: (data: any) => {
        if (data?.local_status === 'PAID') return false;
        return 3000;
      },
    },
  });

  const stepsConfig = useMemo(
    () => [
      { component: () => <StepUserAccount />, blocking: true },
      {
        component: () => <StepBusiness initialDocUrls={initialDocUrls} />,
        blocking: true,
      },
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
    [allPacks, planId, billingCycle],
  );

  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      const values = formikRef.current?.values;

      const formData = new FormData();
      const business = values?.business;
      const account = values?.account;
      const plan = values?.plan;

      const payload: MODELS.ICreateAgency = {
        name: business.name,
        username: account.name,
        userEmail: account.email,
        password: account.password,
        email: business.email,
        description: business.description,
        address: business.address,
        phone: business.phone,
        acceptTerms: business.acceptTerms,
        plan: {
          planId: plan?.planId,
          billingCycle: plan?.paymentMode,
        },
      };

      formData.append('data', JSON.stringify(payload));

      if (business.documents?.length > 0) {
        business.documents.forEach((file: File) => {
          formData.append('documents', file);
        });
      }

      await createAgency({
        payload: { data: formData as MODELS.ICreateAgency },
      });
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboardingCommission = async () => {
    try {
      setIsLoading(true);
      const values = formikRef.current?.values;
      const business = values?.business;
      const account = values?.account;
      const plan = values?.plan;

      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          name: business.name,
          username: account.name,
          userEmail: account.email,
          password: account.password,
          email: business.email,
          address: business.address,
          phone: business.phone,
          description: business.description,
          acceptTerms: business.acceptTerms,
          plan: { planId: plan?.planId, billingCycle: plan?.paymentMode },
        }),
      );
      business.documents?.forEach((file: File) => formData.append('documents', file));
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

    // Step 2 — choix du plan
    if (step === 2) {
      const plan = formikRef.current?.values?.plan;
      const selectedPlan = allPacks?.find((p: any) => p.id === plan?.planId);

      if (selectedPlan?.pricingType === 'SUBSCRIPTION') {
        // Ouvrir la modale de confirmation avant de rediriger
        setOpenAgreePayment(true);
        return;
      }

      // Plan COMMISSION → création directe sans paiement
      await completeOnboardingCommission();
      return;
    }

    if (step === TOTAL_ONBOARD_STEPS - 1) {
      localStorage.setItem(StorageKey.ENABLED_GUIDED_TOUR, 'true');
      navigate.push(APP_ROUTES.DASHBOARD);
      return;
    }

    setDirection(1);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step === TOTAL_ONBOARD_STEPS - 1) return; // 🔒 sécurité
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const goToStep = async (i: number) => {
    // 🔒 Si on est au step final, plus aucune navigation autorisée
    if (step === TOTAL_ONBOARD_STEPS - 1) return;
    const allowed = await canNavigateToStep(i);
    if (!allowed) return;
    setDirection(i > step ? 1 : -1);
    setStep(i);
  };

  const progress = ((step + 1) / TOTAL_ONBOARD_STEPS) * 100;
  const CurrentStep = useMemo(() => stepsConfig[step].component, [stepsConfig, step]);

  useEffect(() => {
    if (!payment) return;
    setIsValidatingPayment(true);
    setStep(2);
    setOrderId(localStorage.getItem(StorageKey.ONBOARD_PENDING_FORM));

    if (paymentStatus) {
      const { local_status, naboo_status } = paymentStatus;
      const restoredAllValues: typeof onboardInitialValues = {
        account: {
          email: paymentStatus?.data?.userEmail!,
          name: paymentStatus?.data?.username!,
          password: paymentStatus?.data?.password!,
        },
        business: {
          acceptTerms: paymentStatus?.data?.acceptTerms,
          description: paymentStatus?.data?.description,
          address: paymentStatus?.data?.address,
          email: paymentStatus?.data?.agencyEmail,
          name: paymentStatus?.data?.agencyName,
          phone: paymentStatus?.data?.phone,
        },
        plan: {
          paymentMode: paymentStatus?.data?.billingCycle!,
          planId: paymentStatus?.data?.planId!,
        },
      };

      setInitialDocUrls(paymentStatus?.data?.documents);
      formikRef.current?.setValues(restoredAllValues);

      // 🟢 SUCCESS
      if (local_status === 'PAID') {
        setEnabledPolling(false);
        login({
          email: restoredAllValues?.account.email,
          password: restoredAllValues?.account.password,
        }).then(() => {
          localStorage.removeItem(StorageKey.ONBOARD_PENDING_FORM);
          setIsValidatingPayment(false);
          setStep(TOTAL_ONBOARD_STEPS - 1);
        });
      }

      // 🔴 FAILED
      if (local_status === 'FAILED' || naboo_status === 'cancelled') {
        setIsValidatingPayment(false);
        setEnabledPolling(false);
        BaseToast({
          title: 'Paiement échoué',
          description: 'Votre paiement n’a pas été validé.',
        });
      }
    }
  }, [paymentStatus, payment]);

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
              <Text fontSize="sm" display={{ base: 'none', sm: 'block' }}>
                Étape {step + 1} / {TOTAL_ONBOARD_STEPS}
              </Text>
              <Box w="128px">
                <Progress.Root
                  size="sm"
                  value={progress}
                  colorPalette="orange"
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
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      display={{ base: 'none', md: 'block' }}
                      color={i === step ? 'primary.500' : i < step ? 'tertiary.500' : 'gray.500'}
                    >
                      {label}
                    </Text>
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
