"use client";

import { JSX, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BaseButton, BaseContainer, Icons } from "_components/custom";
import { Box, Flex, HStack, Span, Text } from "@chakra-ui/react";
import { Formik } from "formik";
import { MotionBox, MotionFlex } from "_constants/motion";
import { InviteStep1 } from "./InviteTeamStep1";
import {
  INVITE_TEAM_SLIDE_VARIANTS,
  INVITE_TEAM_STEPS,
  onboardInviteTeamInitialValues,
  onboardInviteTeamStepValidationSchemas,
  TOTAL_INVITE_TEAM_STEPS,
  ISelectPermissions,
} from "../constants/team";
import { DASHBOARD_ROUTES } from "../../routes";
import { useRouter } from "next/navigation";
import { InviteTeamStep2 } from "./InviteTeamStep2";
import { useUserContext } from "_context/user-context";
import { InviteTeamStep3 } from "./InviteTeamStep3";
import { CommonModule, InvitationModule } from "_store/state-management";
import { TOTAL_ONBOARD_STEPS } from "../../../auth/onboarding/constants/onboard";
import { InviteTeamFinalStep } from "./InviteTeamFinalStep";
import { generateRandomPassword } from "rise-core-frontend";

export const MainTeamInvite = () => {
  const navigate = useRouter();
  const { user } = useUserContext();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const formikRef = useRef<any>(null);

  const { data: allPermissions, isLoading } =
    CommonModule.getAllPermissionsByAgencyQueries({
      params: { agencyId: user?.owner?.agency?.id },
      queryOptions: {
        enabled: !!user?.owner?.agency?.id,
      },
    });

  const {
    mutateAsync: createInvitation,
    isPending: isCreateInvitationPending,
  } = InvitationModule.createInvitationMutation({
    mutationOptions: {
      onSuccess: () => {
        setStep(TOTAL_INVITE_TEAM_STEPS - 1);
        InvitationModule.InvitationCache.invalidateAllInvitationsCache();
      },
    },
  });

  const stepsConfig: { component: () => JSX.Element; blocking: boolean }[] = [
    { component: InviteStep1, blocking: true },
    {
      component: InviteTeamStep2,
      blocking: true,
    },
    {
      component: () => (
        <InviteTeamStep3
          permissions={allPermissions ?? []}
          isLoading={isLoading}
        />
      ),
      blocking: false,
    },
    {
      component: InviteTeamFinalStep,
      blocking: false,
    },
  ];

  const markAllTouched = (errors: any) => {
    if (typeof errors !== "object" || errors === null) return true;

    return Object.keys(errors).reduce((acc: any, key) => {
      acc[key] = markAllTouched(errors[key]);
      return acc;
    }, {});
  };

  const completeOnboarding = async () => {
    try {
      await createInvitation({
        payload: {
          adminId: user?.id!,
          agencyId: user?.owner?.agency?.id!,
          payload: {
            name: formikRef.current.values.account.name,
            temporaryPassword: generateRandomPassword(12),
            email: formikRef.current.values.account.email,
            role: formikRef.current.values.account.role[0],
            permissions: formikRef.current.values.permissions.map(
              (p: ISelectPermissions) => ({
                permissionId: p.permissionId,
                granted: p.granted,
              }),
            ),
          },
        },
      });
    } catch (error) {
      console.error("Onboarding failed:", error);
    }
  };

  const goNext = async () => {
    const schema = onboardInviteTeamStepValidationSchemas[step];

    if (schema && formikRef.current) {
      const errors = await formikRef.current.validateForm();

      if (Object.keys(errors).length > 0) {
        const touched = markAllTouched(errors);
        formikRef.current.setTouched(touched);
        return;
      }
    }

    // 🔥 Step 3 (envoi de l'invitation)
    if (step === 2) {
      console.log(
        "Submitting invitation with values:",
        formikRef.current.values,
      );
      await completeOnboarding();
      return;
    }
    if (step === TOTAL_INVITE_TEAM_STEPS - 1) {
      return navigate.push(DASHBOARD_ROUTES.INVITATIONS.LIST);
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === TOTAL_INVITE_TEAM_STEPS - 1) return;
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const CurrentStep = stepsConfig[step].component;

  return (
    <Formik
      enableReinitialize
      initialValues={onboardInviteTeamInitialValues}
      validationSchema={onboardInviteTeamStepValidationSchemas[step]}
      innerRef={formikRef}
      onSubmit={() => {}}
    >
      {({}) => (
        <BaseContainer
          border={"none"}
          title={" Inviter un membre"}
          description={" Ajoutez un collaborateur et définissez ses accès"}
        >
          <Flex alignItems={"center"} gap={5} mt={5}>
            {INVITE_TEAM_STEPS.map((s, i) => (
              <>
                <HStack gap={2}>
                  <MotionFlex
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
                    animate={{ scale: i === step ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {i < step ? <Icons.Check /> : <s.icon />}
                  </MotionFlex>
                  <Text
                    fontWeight="medium"
                    display={{ base: "none", md: "block" }}
                    color={
                      i === step
                        ? "primary.500"
                        : i < step
                          ? "tertiary.500"
                          : "gray.500"
                    }
                  >
                    {s.title}
                  </Text>
                </HStack>
                {i < TOTAL_INVITE_TEAM_STEPS - 1 && (
                  <Box
                    w={{ base: "16px", lg: "40px" }}
                    h="2px"
                    mx={1}
                    borderRadius="full"
                    bg={i < step ? "tertiary.200" : "gray.200"}
                    transition="all 0.3s"
                  />
                )}
              </>
            ))}
          </Flex>

          {/* Step Content */}
          <Box mx="auto" w="full" overflow="hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <MotionBox
                key={step}
                custom={direction}
                variants={INVITE_TEAM_SLIDE_VARIANTS}
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

          <Box as="footer" borderColor="inherit" position="sticky" bottom={0}>
            <Flex
              maxW="6xl"
              mx="auto"
              px={4}
              gap={3}
              h="80px"
              align="center"
              justify="space-between"
            >
              <BaseButton
                variant="outline"
                isDisabled={
                  step === TOTAL_INVITE_TEAM_STEPS - 1 ||
                  isCreateInvitationPending
                }
                onClick={() => {
                  if (step === 0) {
                    navigate.push(DASHBOARD_ROUTES.INVITATIONS.LIST);
                  } else {
                    goBack();
                  }
                }}
                leftIcon={<Icons.IoIosArrowRoundBack size={16} />}
              >
                <Span display={{ base: "none", sm: "inline" }}>
                  {step === 0 ? (
                    "Annuler"
                  ) : (
                    <Span display={{ base: "none", sm: "inline" }}>
                      Précédent
                    </Span>
                  )}
                </Span>
              </BaseButton>

              <BaseButton
                onClick={goNext}
                isLoading={isCreateInvitationPending}
                isDisabled={isCreateInvitationPending}
                rightIcon={
                  step === 2 ? (
                    <Icons.Send size={16} />
                  ) : (
                    <Icons.ArrowRight size={16} />
                  )
                }
              >
                <Span display={{ base: "none", sm: "inline" }}>
                  {step === 2
                    ? "Envoyer l'invitation"
                    : step === 3 && step < TOTAL_ONBOARD_STEPS
                      ? "Voir les invitations"
                      : "Suivant"}
                </Span>
              </BaseButton>
            </Flex>
          </Box>
        </BaseContainer>
      )}
    </Formik>
  );
};
