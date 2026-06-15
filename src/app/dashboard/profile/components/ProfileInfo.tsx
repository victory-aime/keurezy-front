'use client';

import { Flex, HStack, parseColor, VStack } from '@chakra-ui/react';
import { BaseButton, FormTextInput } from '_components/custom';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CiUser } from 'react-icons/ci';
import { HiOutlineMail } from 'react-icons/hi';
import { UserModule } from '_store/state-management';
import { ProfileForm } from './ProfileForm';
import { MODELS } from '_types/index';
import { useAuthContext } from '_context/auth-context';
import { ENUM } from '_types/';
import { ProviderKeys } from '_constants/StorageKeys';
import { FormGroupColorPicker } from '_components/custom/form/FormGroupColorPicker';
import { rgbaToHex } from '_utils/rgbaToHex';
import { ColorMode, useColorMode } from '_components/ui/color-mode';
import { AppearanceThemeSelector } from './AppearanceThemeSelector';
import { UpdateEmailModal } from './UpdateEmail';
import { authClient } from '../../../lib/auth-client';
import { useAppTheme } from '_context/theme-context';

export const ProfileInfo = () => {
  const { t } = useTranslation();
  const { session } = useAuthContext();
  const { colorMode, setColorMode } = useColorMode();
  const { primaryColor } = useAppTheme();
  const [themeColor, setThemeColor] = useState<string | null>(primaryColor);
  const [emailHasChanged, setEmailHasChanged] = useState<boolean>(false);
  const [pendingValues, setPendingValues] = useState<MODELS.IUser | null>(null);

  const [initialValues, setInitialValues] = useState<MODELS.IUser>({} as MODELS.IUser);

  const {
    data: currentUser,
    isFetching: userDataLoading,
    refetch: reloadUserInfo,
  } = UserModule.getUserInfo({
    params: { userId: session?.userId },
    queryOptions: { enabled: !!session?.userId },
  });

  const currentColor = themeColor ?? currentUser?.theme_color;

  const { mutateAsync: updateUserInfo, isPending: isUpdated } = UserModule.updateUserMutation({
    mutationOptions: {
      onSuccess: async () => {
        await reloadUserInfo();
      },
    },
  });

  const extractorProviderId = currentUser?.accounts?.find(
    (item: MODELS.IAccountUsers) => item?.providerId === ProviderKeys.GOOGLE,
  );

  const handleUpdateUser = async (values: MODELS.IUser) => {
    await updateUserInfo({
      payload: {
        ...values,
        email: currentUser?.email,
        id: currentUser?.id,
        theme_color: themeColor!,
        theme_mode: colorMode,
      },
    });
  };

  const handleSubmitWithCheck = (values: MODELS.IUser) => {
    // const emailChanged = values?.email !== currentUser?.email;

    // if (emailChanged) {
    //   setPendingValues(values);
    //   setEmailHasChanged(true);
    //   return;
    // }
    handleUpdateUser(values);
  };

  // const handleConfirmEmailChange = async () => {
  //   if (!pendingValues) return;

  //   try {
  //     // 🔥 appel Better Auth
  //     await authClient.changeEmail({
  //       newEmail: pendingValues.email!,
  //     });
  //     await handleUpdateUser(pendingValues);
  //     setEmailHasChanged(false);
  //     setPendingValues(null);
  //   } catch (error) {
  //     console.error('Erreur changeEmail', error);
  //   }
  // };

  useEffect(() => {
    if (currentUser) {
      setInitialValues({
        name: currentUser?.name,
        email: currentUser?.email,
        twoFactorEnabled: currentUser?.twoFactorEnabled,
        status: currentUser?.status ?? ENUM.COMMON.Status.ACTIVE,
      });
      setColorMode((currentUser?.theme_mode as ColorMode) ?? colorMode);
    }
    if (currentUser?.theme_color) {
      setThemeColor(currentUser?.theme_color);
    }
  }, [currentUser]);

  return (
    <main>
      <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmitWithCheck}>
        {({ handleSubmit }) => {
          return (
            <main>
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
                        !!extractorProviderId ? 'Données gérer par votre compte Google' : null
                      }
                    />
                  </HStack>
                  <FormTextInput
                    name="email"
                    label="PROFILE.EMAIL"
                    type="email"
                    leftAccessory={<HiOutlineMail />}
                    isLoading={userDataLoading}
                    isDisabled
                    infoMessage={
                      !!extractorProviderId
                        ? 'Données gérer par votre compte Google'
                        : "le changement d'email est en cours de developpement"
                    }
                  />
                </VStack>
              </ProfileForm>
              <ProfileForm
                title="Thème de couleur"
                description="Choisissez votre coloris préféré pour l'application"
                isLoading={userDataLoading}
              >
                <HStack gap={4} alignItems="flex-start" mt={10}>
                  <FormGroupColorPicker
                    value={parseColor(currentColor as string)}
                    onValueChange={(value) => setThemeColor(rgbaToHex(value.valueAsString))}
                  />
                </HStack>
              </ProfileForm>
              <ProfileForm
                title="Apparence"
                description=" Choisissez le mode clair ou sombre, ou changez de mode automatiquement en fonction des paramètres de votre système."
                isLoading={userDataLoading}
              >
                <AppearanceThemeSelector
                  themeColor={currentColor}
                  initialMode={colorMode}
                  onChange={(color) => setColorMode(color)}
                />
              </ProfileForm>
              <Flex width="full" alignItems="flex-end" justifyContent="flex-end">
                <BaseButton
                  onClick={() => handleSubmit()}
                  width={'120px'}
                  isLoading={isUpdated || userDataLoading}
                >
                  {t('COMMON.VALIDATE')}
                </BaseButton>
              </Flex>
            </main>
          );
        }}
      </Formik>
      {/* <UpdateEmailModal
        isOpen={emailHasChanged}
        onChange={() => setEmailHasChanged(!emailHasChanged)}
        callback={handleConfirmEmailChange}
      /> */}
    </main>
  );
};
