"use client";

import { Flex, HStack, VStack } from "@chakra-ui/react";
import { BaseButton, FormSwitch, FormTextInput } from "_components/custom";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiUser } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { UserModule } from "_store/state-management";
import { ProfileForm } from "../components/ProfileForm";
import { MODELS } from "_types/index";
import { PasswordIndicator } from "_component/PasswordIndicator";
import { useAuthContext } from "_context/auth-context";
import { ENUM } from "_types/";
import { ProviderKeys } from "_constants/StorageKeys";
import { Recap2FAModal } from "_modules/dashboard/profile/components/Recap2FAModal";
import { useTotp } from "../../../../lib/totp";
import { TotpQrCode } from "_modules/dashboard/profile/components/TotpQrCode";

export const ProfileInfo = () => {
  const { t } = useTranslation();
  const { session } = useAuthContext();
  const { enableTotp, disableTotp, isLoading } = useTotp();
  const [totpData, setTotpData] = useState<string | null>(null);
  const [openTotp, setOpenTotp] = useState<boolean>(false);
  const [refetchUserInfo, setResetUserInfo] = useState(false);
  const [open2FA, setOpen2FA] = useState(false);
  const [checked, setChecked] = useState(false);
  const [validateDisabledAccount, setValidateDisabledAccount] = useState(false);
  const [initialValues, setInitialValues] = useState<MODELS.IUser>(
    {} as MODELS.IUser,
  );
  const [password, setPassword] = useState<string | null>(null);

  const { data: currentUser, isLoading: userDataLoading } =
    UserModule.getUserInfo({
      params: { userId: session?.user.id },
      queryOptions: { enabled: refetchUserInfo },
    });

  const extractorProviderId = currentUser?.accounts?.find(
    (item) => item?.providerId === ProviderKeys.GOOGLE,
  );

  const onSubmit2FA = async (value: { password: string }) => {
    if (currentUser?.twoFactorEnabled) {
      await disableTotp(value.password).then((data) => {
        setResetUserInfo(data);
        setOpen2FA(false);
      });
    } else {
      await enableTotp(value.password).then((data) => {
        if (!data) return;
        setOpenTotp(true);
        setOpen2FA(false);
        setTotpData(data);
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      setInitialValues({
        name: currentUser?.name,
        email: currentUser?.email,
        twoFactorEnabled: currentUser?.twoFactorEnabled,
        status: currentUser?.status ?? ENUM.COMMON.Status.ACTIVE,
      });
    }
  }, [currentUser]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={() => {}}
    >
      {({ values, handleSubmit, resetForm, dirty }) => {
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
                    isDisabled={!!extractorProviderId}
                    infoMessage={
                      !!extractorProviderId
                        ? "Données gérer par votre compte Google"
                        : null
                    }
                  />
                </HStack>
                <FormTextInput
                  name="email"
                  label="PROFILE.EMAIL"
                  type="email"
                  leftAccessory={<HiOutlineMail />}
                  isLoading={userDataLoading}
                  isDisabled={!!extractorProviderId}
                  infoMessage={
                    !!extractorProviderId
                      ? "Données gérer par votre compte Google"
                      : null
                  }
                />
              </VStack>
            </ProfileForm>

            {!extractorProviderId && (
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
            )}

            {!extractorProviderId && (
              <ProfileForm
                title="PROFILE.2MFA"
                activeBadge={values?.twoFactorEnabled}
                description="PROFILE.2MFA_DESC"
                isLoading={userDataLoading}
              >
                <FormSwitch
                  name="twoFactorEnabled"
                  label="PROFILE.ENABLED_2MFA"
                  description="PROFILE.ENABLED_2MFA_DESC"
                  isLoading={userDataLoading}
                  onCheckedChange={(e) => {
                    if (e !== values?.twoFactorEnabled) {
                      setOpen2FA(true);
                      setChecked(e);
                    } else {
                      setChecked(values?.twoFactorEnabled);
                      setOpen2FA(false);
                    }
                  }}
                />
              </ProfileForm>
            )}
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
            <Flex width="full" alignItems="flex-end" justifyContent="flex-end">
              <BaseButton
                colorType="success"
                onClick={() => handleSubmit()}
                width={"120px"}
                disabled={initialValues === values && !dirty}
              >
                {t("COMMON.VALIDATE")}
              </BaseButton>
            </Flex>
            <Recap2FAModal
              onChange={() => {
                resetForm();
                setOpen2FA(false);
              }}
              isOpen={open2FA}
              data={checked}
              callback={onSubmit2FA}
              isLoading={isLoading}
            />
            <TotpQrCode
              onChange={() => {
                setOpenTotp(false);
                setResetUserInfo(true);
              }}
              isOpen={openTotp}
              data={totpData}
            />
          </VStack>
        );
      }}
    </Formik>
  );
};
