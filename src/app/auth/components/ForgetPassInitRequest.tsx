"use client";
import { AuthBoxContainer } from "./AuthBoxContainer";
import { Formik, FormikValues } from "formik";
import { Box, Center, VStack } from "@chakra-ui/react";
import { BaseButton, BaseText, FormTextInput } from "_components/custom";
import { VALIDATION } from "_types/";
import { APP_ROUTES } from "_config/routes";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthModule } from "_store/state-management";
import { Navbar } from "_component/NavBar";
import { MotionBox } from "_constants/motion";
import { AnimatedCheckmark } from "../onboarding/components/AnimatedCheck";

export const ForgetPassInitRequest = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(false);
  const router = useRouter();

  const { mutateAsync: checkEmail, isPending } = AuthModule.checkEmailMutation(
    {},
  );

  const { mutateAsync: forgotPasswordRequest, isPending: isForgotPending } =
    AuthModule.forgotPasswordInitMutation({
      mutationOptions: {
        onSuccess: () => {
          setStatus(true);
        },
      },
    });

  const resetPasswordInit = async (values: FormikValues) => {
    await forgotPasswordRequest({
      payload: { email: values?.email },
    });
  };

  return (
    <>
      <Navbar />
      <AuthBoxContainer
        title={"Mot de passe oublié"}
        description={
          <BaseText>
            Vous vous rappeler de votre mot de passe ?{" "}
            <Box
              as="span"
              cursor="pointer"
              color="primary.500"
              onClick={() => router.push(APP_ROUTES.AUTH.SIGN_IN)}
            >
              {t("COMMON.LOGIN")}
            </Box>
          </BaseText>
        }
      >
        {status ? (
          <Center>
            <VStack
              maxW={"5xl"}
              mx={"auto"}
              spaceY={8}
              position={"relative"}
              overflow={"hidden"}
            >
              <AnimatedCheckmark />
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                spaceY={3}
                textAlign={"center"}
              >
                <BaseText
                  fontSize={{ base: "lg", sm: "xl" }}
                  fontWeight={"bold"}
                >
                  🎉 Presque terminé !
                </BaseText>

                <BaseText fontSize={"lg"} maxW={"lg"} mx={"auto"}>
                  Un lien sécurisé de réinitialisation a été envoyé à votre
                  adresse email. Consultez votre boîte de réception pour
                  finaliser l’opération.
                </BaseText>
              </MotionBox>
            </VStack>
          </Center>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{ email: "" }}
            onSubmit={resetPasswordInit}
            validateOnChange={false}
            validationSchema={VALIDATION.AUTH.resetPasswordInitRequestValidationSchema(
              async (email: string) => {
                const user = await checkEmail({ payload: { email } });
                return !!user;
              },
            )}
          >
            {({ handleSubmit, isValid }) => (
              <VStack gap={2} alignItems={"flex-start"}>
                <FormTextInput
                  name={"email"}
                  placeholder={"FORM.EMAIL_PLACEHOLDER"}
                  isVerified={isPending}
                />
                <BaseButton
                  width={"full"}
                  onClick={() => handleSubmit()}
                  isLoading={isForgotPending}
                  mt={2}
                  isDisabled={!isValid}
                >
                  Envoyer-moi le lien
                </BaseButton>
              </VStack>
            )}
          </Formik>
        )}
      </AuthBoxContainer>
    </>
  );
};
