"use client";
import { JSX, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Progress,
  Flex,
  HStack,
  Text,
  Span,
  Image,
  JsxElement,
} from "@chakra-ui/react";
import { BaseButton, BaseText, Icons, TextVariant } from "_components/custom";
import { useRouter } from "next/navigation";
import { StepIntro } from "../components/StepIntro";
import { Step2ProductValue } from "../components/Step2ProductValue";
import { StepUserAccount } from "../components/StepUserAccount";
import { StepBusiness } from "../components/StepBusiness";
import { ASSETS } from "_assets/images";
import { APP_ROUTES } from "_config/routes";
import { MODELS, VALIDATION } from "_types/*";
import { OnboardFinish } from "../components/FinalStep";
import { Formik } from "formik";
import { authClient } from "../../../lib/auth-client";
import { useAuth } from "_hooks/useAuth";
import { AgencyModule } from "_store/state-management";
import { AgencyNameWatcher } from "../../components/AgencyNameWatcher";
import {
  TOTAL_ONBOARD_STEPS,
  onboardInitialValues,
  onboardStepLabels,
  onboardStepValidationSchemas,
  slideVariants,
} from "../constants/onboard";

const MotionBox = motion(Box);

export const MainOnboarding = () => {
  const navigate = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false);
  const [, setIsCheckingName] = useState(false);
  const formikRef = useRef<any>(null);

  const { signUp, login } = useAuth();
  const { mutateAsync: verifiedAgencyName } = AgencyModule.checkNameMutation(
    {},
  );

  const { mutateAsync: createAgency, isPending: isLoading } =
    AgencyModule.createAgencyMutation({
      mutationOptions: {
        onSuccess: async () => {
          await login({
            email: formikRef.current.values.account.email,
            password: formikRef.current.values.account.password,
          });
        },
      },
    });

  const stepsConfig: { component: () => JSX.Element; blocking: boolean }[] = [
    { component: StepIntro, blocking: false },
    { component: Step2ProductValue, blocking: false },
    { component: StepUserAccount, blocking: true },
    { component: StepBusiness, blocking: true },
    { component: OnboardFinish, blocking: false },
  ];

  const markAllTouched = (errors: any) => {
    if (typeof errors !== "object" || errors === null) return true;

    return Object.keys(errors).reduce((acc: any, key) => {
      acc[key] = markAllTouched(errors[key]);
      return acc;
    }, {});
  };

  const canNavigateToStep = async (targetStep: number) => {
    if (!formikRef.current) return false;

    // navigation arrière toujours autorisée
    if (targetStep <= step) return true;

    // Vérifier tous les steps intermédiaires bloquants
    for (let i = 0; i < targetStep; i++) {
      if (!stepsConfig[i].blocking) continue;

      const schema = onboardStepValidationSchemas[i];
      if (!schema) continue;

      try {
        await schema.validate(formikRef.current.values, {
          abortEarly: false,
        });
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

    // 🔥 Step 4 (création user et agence)
    if (step === 3) {
      try {
        // 1️⃣ Création du user
        const result = await signUp(formikRef.current.values.account);

        const user = result?.data?.user;

        if (!user) throw new Error("User creation failed");

        // 2️⃣ Envoi email de vérification
        await authClient.sendVerificationEmail({
          email: user.email,
          callbackURL: APP_ROUTES.AUTH.VERIFIED_EMAIL,
        });

        // 3️⃣ Création agence
        const formData = new FormData();
        const business = formikRef.current.values.business;

        formData.append("userId", String(user.id));
        formData.append("name", business.name);
        formData.append("description", business.description);
        formData.append("address", business.address);
        formData.append("phone", business.phone);
        formData.append("acceptTerms", String(business.acceptTerms));

        if (business.documents?.length > 0) {
          business.documents.forEach((file: File) => {
            formData.append("documents", file);
          });
        }

        await createAgency({
          payload: formData as MODELS.ICreateAgency,
        });

        // 4️⃣ Aller au step final
        setStep(TOTAL_ONBOARD_STEPS - 1);
      } catch (error) {
        console.error("Onboarding failed:", error);
        // ici tu peux afficher un toast
      }

      return;
    }

    if (step === TOTAL_ONBOARD_STEPS - 1) {
      navigate.push("/dashboard");
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

  const CurrentStep = stepsConfig[step].component;

  return (
    <Formik
      enableReinitialize
      innerRef={formikRef}
      initialValues={onboardInitialValues}
      validationSchema={onboardStepValidationSchemas[step]}
      validateOnMount
      validate={() => {
        const errors: any = {};
        if (step === 3 && nameAlreadyExists) {
          errors.business = {
            ...errors.business,
            name: "Une agence avec ce nom existe déjà",
          };
        }

        return errors;
      }}
      onSubmit={() => {}}
    >
      <Flex direction="column" minH="100vh">
        <AgencyNameWatcher
          verifiedAgencyName={verifiedAgencyName}
          setIsCheckingName={setIsCheckingName}
          setNameAlreadyExists={setNameAlreadyExists}
        />

        {/* Header */}
        <Box
          as="header"
          borderBottom="1px solid"
          borderColor="border"
          bg={"white"}
          backdropFilter="blur(8px)"
          position="sticky"
          top={0}
          zIndex={50}
        >
          <Flex
            maxW="6xl"
            mx="auto"
            px={4}
            h="64px"
            align="center"
            justify="space-between"
          >
            <Flex
              alignItems={"center"}
              gap={2.5}
              onClick={() => navigate.push(APP_ROUTES.ROOT)}
              cursor={"pointer"}
            >
              <Image src={ASSETS.LOGO} alt="logo" width={45} height={45} />
              <BaseText variant={TextVariant.M}>MyImmo</BaseText>
            </Flex>

            <HStack gap={4}>
              <Text
                fontSize="sm"
                color="gray.500"
                display={{ base: "none", sm: "block" }}
              >
                Étape {step + 1} / {TOTAL_ONBOARD_STEPS}
              </Text>
              <Box w="128px">
                <Progress.Root
                  size={"sm"}
                  value={progress}
                  colorPalette={"orange"}
                  variant={"subtle"}
                  animated
                >
                  <Progress.Track borderRadius={"full"}>
                    <Progress.Range bgColor={"primary.500"} />
                  </Progress.Track>
                </Progress.Root>
              </Box>
              {step < 2 && (
                <BaseButton onClick={() => goToStep(2)}>Passer</BaseButton>
              )}
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
                  cursor={"pointer"}
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
                      bg={
                        i === step
                          ? "primary.500"
                          : i < step
                            ? "tertiary.100"
                            : "gray.100"
                      }
                      color={
                        i === step
                          ? "white"
                          : i < step
                            ? "tertiary.600"
                            : "gray.500"
                      }
                      boxShadow={i === step ? "md" : "none"}
                      transition="all 0.2s"
                    >
                      {i < step ? <Icons.Check size={13} /> : i + 1}
                    </Flex>
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      display={{ base: "none", md: "block" }}
                      color={
                        i === step
                          ? "gray.800"
                          : i < step
                            ? "tertiary.500"
                            : "gray.500"
                      }
                    >
                      {label}
                    </Text>
                  </HStack>
                </MotionBox>
                {i < TOTAL_ONBOARD_STEPS - 1 && (
                  <Box
                    w={{ base: "16px", lg: "40px" }}
                    h="2px"
                    mx={1}
                    borderRadius="full"
                    bg={i < step ? "tertiary.200" : "gray.200"}
                    transition="all 0.3s"
                  />
                )}
              </HStack>
            ))}
          </HStack>
        </Box>

        {/* Content */}
        <Box
          flex={1}
          mx="auto"
          px={4}
          py={{ base: 4, md: 6 }}
          w="full"
          overflow="hidden"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <MotionBox
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              mt={"30px"}
            >
              <CurrentStep />
            </MotionBox>
          </AnimatePresence>
        </Box>

        {/* Footer */}
        <Box
          as="footer"
          borderTop="1px solid"
          borderColor="gray.200"
          bg="white"
          position="sticky"
          bottom={0}
        >
          <Flex
            maxW="6xl"
            mx="auto"
            px={4}
            h="80px"
            align="center"
            justify="space-between"
          >
            <BaseButton
              variant="outline"
              isDisabled={step === TOTAL_ONBOARD_STEPS - 1} // 👈 ajout
              onClick={() => {
                if (step === 0) {
                  navigate.push(APP_ROUTES.ROOT);
                } else {
                  prevStep();
                }
              }}
              leftIcon={<Icons.IoIosArrowRoundBack size={16} />}
            >
              <Span display={{ base: "none", sm: "inline" }}>Précédent</Span>
            </BaseButton>

            {/* Dot indicators */}
            <HStack gap={1.5}>
              {Array.from({ length: TOTAL_ONBOARD_STEPS }).map((_, i) => (
                <Box
                  key={i}
                  h="6px"
                  w={i === step ? "24px" : "6px"}
                  borderRadius="full"
                  bg={
                    i === step
                      ? "primary.500"
                      : i < step
                        ? "primary.200"
                        : "gray.200"
                  }
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
                "Launch My Dashboard"
              ) : step === 1 ? (
                "Continue Setup"
              ) : (
                <Span display={{ base: "none", sm: "inline" }}>
                  {step === 2 ? "Valider" : "Suivant"}
                </Span>
              )}
            </BaseButton>
          </Flex>
        </Box>
      </Flex>
    </Formik>
  );
};
