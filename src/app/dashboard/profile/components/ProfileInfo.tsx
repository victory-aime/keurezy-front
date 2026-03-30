"use client";

import { Flex, HStack, VStack } from "@chakra-ui/react";
import { BaseButton, FormTextInput } from "_components/custom";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CiUser } from "react-icons/ci";
import { HiOutlineMail } from "react-icons/hi";
import { UserModule } from "_store/state-management";
import { ProfileForm } from "./ProfileForm";
import { MODELS } from "_types/index";
import { useAuthContext } from "_context/auth-context";
import { ENUM } from "_types/";
import { ProviderKeys } from "_constants/StorageKeys";

export const ProfileInfo = () => {
  const { t } = useTranslation();
  const { session } = useAuthContext();

  const [initialValues, setInitialValues] = useState<MODELS.IUser>(
    {} as MODELS.IUser,
  );

  const { data: currentUser, isLoading: userDataLoading } =
    UserModule.getUserInfo({
      params: { userId: session?.userId },
      queryOptions: { enabled: !!session?.userId },
    });

  const extractorProviderId = currentUser?.accounts?.find(
    (item) => item?.providerId === ProviderKeys.GOOGLE,
  );

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
      {({ values, handleSubmit, dirty }) => {
        return (
          <>
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
          </>
        );
      }}
    </Formik>
  );
};
