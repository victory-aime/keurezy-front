"use client";

import { Flex, HStack, VStack } from "@chakra-ui/react";
import { BaseButton, FormSwitch, FormTextInput } from "_components/custom";
import { Formik, FormikValues } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiUser } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { UserModule } from "_store/state-management";
import { ProfileForm } from "../components/ProfileForm";
import { MODELS } from "_types/index";
import { useAuth } from "_hooks/useAuth";
import { PasswordIndicator } from "_component/PasswordIndicator";
import { DisabledAccount } from "_modules/dashboard/profile/components/DisabledAccount";
import { useAuthContext } from "_context/auth-context";

export const ProfileInfo = () => {
  const { t } = useTranslation();
  const { session } = useAuthContext();
  const { logout } = useAuth();
  const [manualTrigger, setManualTrigger] = useState(false);
  const [pending, setPending] = useState(false);
  const [validateDisabledAccount, setValidateDisabledAccount] = useState(false);
  const [initialValues, setInitialValues] = useState<MODELS.IUser>(
    {} as MODELS.IUser,
  );
  const [password, setPassword] = useState<string | null>(null);
  const [pendingValues, setPendingValues] = useState<FormikValues | null>(null);

  const { data: currentUser, isLoading: userDataLoading } =
    UserModule.getUserInfo({
      params: { userId: session?.user.id },
      queryOptions: { enabled: pending },
    });

  const onSubmit = async (values: FormikValues) => {
    setPendingValues(values);
    setManualTrigger(true);
  };

  useEffect(() => {
    if (currentUser) {
      setInitialValues({
        name: currentUser?.name,
        firstName: currentUser?.firstName,
        email: currentUser?.email,
        enabled2FA: currentUser?.enabled2FA ?? false,
        isActive: currentUser?.isActive ?? false,
      });
    }
  }, [currentUser]);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        {({ values, handleSubmit }) => {
          const hasChanges = useCallback(() => {
            if (password && password.length > 0) return true;
            return Object.keys(values).some((key) => {
              return (
                values[key as keyof typeof values] !==
                initialValues[key as keyof typeof initialValues]
              );
            });
          }, [values, initialValues, password]);

          return (
            <VStack gap={10} alignItems="flex-start">
              <ProfileForm
                title="SIDE_BAR.PROFILE"
                description="PROFILE.PERSONAL_INFO"
                isLoading={userDataLoading}
              >
                <VStack gap={4} alignItems="flex-start" mt={10}>
                  <HStack width="full" gap={4}>
                    <FormTextInput
                      name="name"
                      label="PROFILE.NAME"
                      leftAccessory={<CiUser />}
                      isLoading={userDataLoading}
                    />
                    <FormTextInput
                      name="firstName"
                      label="PROFILE.FIRST_NAME"
                      autoComplete="off"
                      leftAccessory={<CiUser />}
                      isLoading={userDataLoading}
                    />
                  </HStack>
                  <FormTextInput
                    name="email"
                    label="PROFILE.EMAIL"
                    type="email"
                    leftAccessory={<HiOutlineMail />}
                    isLoading={userDataLoading}
                  />
                </VStack>
              </ProfileForm>

              <ProfileForm
                title="PROFILE.SECURITY.PASSWORD"
                description="PROFILE.SECURITY.PASSWORD_DESC"
              >
                <FormTextInput
                  name="newPassword"
                  label="PROFILE.NEW_PASSWORD"
                  placeholder="PROFILE.NEW_PASSWORD"
                  type="password"
                  autoComplete="off"
                  onChangeFunction={(e: any) => setPassword(e?.target.value)}
                />
                <PasswordIndicator password={password} />
              </ProfileForm>

              <ProfileForm
                title="PROFILE.2MFA"
                activeBadge={values?.enabled2FA}
                description="PROFILE.2MFA_DESC"
                isLoading={userDataLoading}
              >
                <FormSwitch
                  name="enabled2FA"
                  label="PROFILE.ENABLED_2MFA"
                  description="PROFILE.ENABLED_2MFA_DESC"
                  isLoading={userDataLoading}
                />
              </ProfileForm>
              <ProfileForm
                title="PROFILE.DANGER_ZONE.TITLE"
                description="PROFILE.DANGER_ZONE.DESC"
                borderColor="red"
                borderWidth={1.5}
                borderRadius="7px"
              >
                <BaseButton
                  withGradient
                  colorType="danger"
                  onClick={() =>
                    setValidateDisabledAccount(!validateDisabledAccount)
                  }
                >
                  {t("PROFILE.DANGER_ZONE.DELETE_ACCOUNT")}
                </BaseButton>
              </ProfileForm>
              <Flex
                width="full"
                alignItems="flex-end"
                justifyContent="flex-end"
              >
                <BaseButton
                  colorType="success"
                  onClick={() => handleSubmit()}
                  width={"120px"}
                  disabled={!hasChanges()}
                  // isLoading={updatePending}
                >
                  {t("COMMON.VALIDATE")}
                </BaseButton>
              </Flex>
            </VStack>
          );
        }}
      </Formik>
      <DisabledAccount
        onChange={() => setValidateDisabledAccount(!validateDisabledAccount)}
        isOpen={validateDisabledAccount}
        //callback={onActivateDisabledUser}
        data={currentUser?.email}
        //isLoading={activateDisabledUserPending}
      />
    </>
  );
};
