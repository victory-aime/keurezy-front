'use client';
import React, { useEffect, useState } from 'react';
import { DisabledAccount } from '../profile/components/DisabledAccount';
import { VStack, HStack, Flex, For } from '@chakra-ui/react';
import {
  BaseText,
  TextVariant,
  FormTextInput,
  BaseButton,
  BaseIcon,
  CustomSkeletonLoader,
  FormSwitch,
  Icons,
  DeleteModalAnimation,
  BaseTag,
} from '_components/custom';
import { Formik } from 'formik';
import { ProfileForm } from '../profile/components/ProfileForm';
import { useTranslation } from 'react-i18next';
import { formatCreatedAt, formatDisplayDate } from 'rise-core-frontend';
import { useAuth } from '_hooks/useAuth';
import { useAuthContext } from '_context/auth-context';
import { Recap2FAModal } from '../profile/components/Recap2FAModal';
import { TotpQrCode } from '../profile/components/TotpQrCode';
import { useTotp } from '_hooks/useTotp';
import { UserModule } from '_store/state-management';
import { PassKeyModal } from './components/PassKeyModal';
import { authClient } from '../../lib/auth-client';
import { usePasskey } from '_hooks/usePasskey';
import { MODELS } from '_types/*';
import { Session } from 'better-auth';
import { parseUserAgent } from './utils/user-agent';
import { handleApiError } from '_utils/handleApiError';
import { handleApiSuccess } from '_utils/handleApiSuccess';
import { ProviderKeys } from '_constants/StorageKeys';

export const Settings = () => {
  const { session } = useAuthContext();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { enableTotp, disableTotp, isLoading } = useTotp();
  const { passkeyList, registerPassKey, removePassKey, isLoading: passkeyLoading } = usePasskey();
  const [totpData, setTotpData] = useState<{
    totpURI: string;
    backupCodes: string[];
  }>({ totpURI: '', backupCodes: [] });
  const [initialValues, setInitialValues] = useState<MODELS.IUser>({} as MODELS.IUser);
  const [openTotp, setOpenTotp] = useState<boolean>(false);
  const [refetchUserInfo, setRefetchUserInfo] = useState(false);
  const [open2FA, setOpen2FA] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openCloseSessionModal, setOpenCloseSessionModal] = useState<boolean>(false);
  const [isRevoke, setIsRevoke] = useState<boolean>(false);
  const [listPasskey, setListPasskey] = useState<MODELS.IUserPasskeyList[] | undefined>([]);

  const [userSessionList, setUserSessionList] = useState<Session[]>([]);
  const [openPassKeyModal, setOpenPasskeyModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const currentSessionId = session?.id;
  const [validateDisabledAccount, setValidateDisabledAccount] = useState<boolean>(false);

  const { data: currentUser, isLoading: userDataLoading } = UserModule.getUserInfo({
    params: { userId: session?.userId },
    queryOptions: { enabled: refetchUserInfo },
  });

  const extractorProviderId = currentUser?.accounts?.find(
    (item) => item?.providerId === ProviderKeys.GOOGLE,
  );

  const fetchPasskeys = async () => {
    const data = await passkeyList();
    setListPasskey(data ?? []);
  };
  const fetchUserSessions = async () => {
    const sessions = await authClient.listSessions();
    setUserSessionList(sessions.data ?? []);
  };

  const onSubmit2FA = async (value: { password: string }) => {
    if (currentUser?.twoFactorEnabled) {
      await disableTotp(value.password).then((data) => {
        setRefetchUserInfo(data);
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

  const handleRegisterNewKey = async (values: { passkeyName: string }) => {
    await registerPassKey(values?.passkeyName).then((data) => {
      if (!data) return;
      setOpenPasskeyModal(false);
    });
  };

  const handleRemoveKey = async () => {
    await removePassKey(selectedData!)
      .then((data) => {
        if (!data) return;
        setIsRevoke(false);
      })
      .then(() => {
        fetchPasskeys();
      });
  };

  const clearOtherSessions = async () => {
    try {
      const { data, error } = await authClient.revokeOtherSessions();
      if (error) {
        handleApiError({ status: 400, message: error.statusText! });
        return;
      }
      if (data.status) {
        handleApiSuccess({
          message: t('PROFILE.SECURITY.SESSIONS_CLEARED'),
          status: 200,
        });
      }
    } catch (error) {
      console.log('error', error);
      handleApiError({ status: 500, message: 'Erreur inattendue' });
    }
  };

  const handleClearSession = async () => {
    try {
      console.log('selectedData', selectedData);
      const { data, error } = await authClient.revokeSession({
        token: selectedData!,
      });
      if (error) {
        handleApiError({ status: 400, message: error.statusText! });
        return;
      }
      if (data.status) {
        handleApiSuccess({
          message: t('PROFILE.SECURITY.SESSION_CLEARED'),
          status: 200,
        });
        setOpenCloseSessionModal(false);
        fetchUserSessions();
      }
    } catch (error) {
      handleApiError({ status: 500, message: 'Erreur inattendue' });
    }
  };

  const handleDeactivateAccount = async () => {};

  useEffect(() => {
    if (currentUser) {
      setInitialValues({
        twoFactorEnabled: currentUser?.twoFactorEnabled,
      });
    }
    fetchPasskeys();
    fetchUserSessions();
  }, []);

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{ ...initialValues, newPassword: '' }}
        onSubmit={(values) => {}}
      >
        {({ values, handleSubmit, resetForm, dirty }) => (
          <>
            <VStack gap={10} alignItems={'flex-start'}>
              <ProfileForm
                title="PROFILE.SECURITY.PASSWORD"
                description="PROFILE.SECURITY.PASSWORD_DESC"
                isLoading={userDataLoading}
              >
                {!extractorProviderId && (
                  <FormTextInput
                    name="newPassword"
                    label="PROFILE.NEW_PASSWORD"
                    placeholder="PROFILE.NEW_PASSWORD"
                    type="password"
                    value={values?.newPassword}
                    infoMessage={
                      !extractorProviderId
                        ? 'PROFILE.SECURITY.PASSWORD_INFO'
                        : 'Données gérer par votre compte Google'
                    }
                    isDisabled={!!extractorProviderId}
                    isLoading={userDataLoading}
                  />
                )}
              </ProfileForm>

              {!extractorProviderId && (
                <ProfileForm
                  title="PROFILE.SECURITY.PASS_KEY"
                  description="PROFILE.SECURITY.PASS_KEY_DESC"
                  isLoading={userDataLoading}
                >
                  {passkeyLoading ? (
                    <CustomSkeletonLoader type="BUTTON" width={'80px'} colorButton="primary" />
                  ) : (
                    <BaseButton withGradient onClick={() => setOpenPasskeyModal(true)}>
                      {t('PROFILE.SECURITY.ADD_PASS_KEY')}
                    </BaseButton>
                  )}

                  {(listPasskey?.length ?? 0) > 0 ? (
                    <For each={listPasskey}>
                      {(cred) => (
                        <HStack
                          key={cred.id}
                          width={'full'}
                          mt={5}
                          justifyContent={'space-between'}
                          py={2}
                          borderBottom="1px solid"
                          borderColor={'lighter.500'}
                        >
                          {passkeyLoading ? (
                            <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
                          ) : (
                            <>
                              <VStack alignItems="flex-start" gap={1}>
                                <BaseText fontWeight="bold">
                                  {cred.name || t('PROFILE.SECURITY.UNKNOW_DEVICE')}
                                </BaseText>
                                <BaseText variant={TextVariant.S}>
                                  Créé {formatCreatedAt(cred.createdAt)}
                                </BaseText>
                              </VStack>
                              <BaseIcon
                                bgColor={'red'}
                                boxSize={'30px'}
                                cursor="pointer"
                                onClick={() => {
                                  setIsRevoke(true);
                                  setSelectedData(cred?.id!);
                                }}
                              >
                                <Icons.Trash />
                              </BaseIcon>
                            </>
                          )}
                        </HStack>
                      )}
                    </For>
                  ) : (
                    <BaseText mt={8}>{t('PROFILE.SECURITY.PASS_KEY_NO_FOUND')}</BaseText>
                  )}
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
                title="PROFILE.SECURITY.ACTIVE_SESSIONS"
                description="PROFILE.SECURITY.ACTIVE_SESSIONS_DESC"
                isLoading={userDataLoading}
              >
                <For each={userSessionList}>
                  {(session, idx) => (
                    <HStack
                      key={idx}
                      width="full"
                      justifyContent="space-between"
                      alignItems="center"
                      py={2}
                    >
                      {false ? (
                        <CustomSkeletonLoader type="TEXT" numberOfLines={3} />
                      ) : (
                        <>
                          <VStack gap={1} width="full" align="stretch">
                            <HStack>
                              <BaseText fontWeight="bold">
                                {parseUserAgent(session?.userAgent!)}
                              </BaseText>
                              {session.id === currentSessionId && (
                                <BaseTag
                                  color="purple"
                                  label={t('PROFILE.SECURITY.CURRENT_SESSION')}
                                />
                              )}
                            </HStack>
                            <Flex wrap="wrap" gap={3} color="gray.500" fontSize="sm">
                              <HStack>
                                <Icons.World />
                                <BaseText>{session?.ipAddress || 'N/A'}</BaseText>
                              </HStack>

                              <HStack>
                                <Icons.Timer />
                                <BaseText>
                                  {t('PROFILE.SECURITY.SESSION_START')} :{' '}
                                  {formatCreatedAt(session?.createdAt as unknown as string)}
                                </BaseText>
                              </HStack>

                              <HStack>
                                <Icons.Timer />
                                <BaseText>
                                  Expires le: {formatDisplayDate(session?.expiresAt)}
                                </BaseText>
                              </HStack>
                            </Flex>
                          </VStack>
                          {userSessionList?.length > 1 && (
                            <BaseIcon
                              bgColor={'red'}
                              boxSize={'30px'}
                              borderRadius={'7px'}
                              cursor="pointer"
                              onClick={() => session.id}
                            >
                              <Icons.Trash
                                onClick={() => {
                                  setOpenCloseSessionModal(true);
                                  setSelectedData(session.id);
                                }}
                              />
                            </BaseIcon>
                          )}
                        </>
                      )}
                    </HStack>
                  )}
                </For>
              </ProfileForm>

              <ProfileForm
                title="PROFILE.DANGER_ZONE.TITLE"
                description="PROFILE.DANGER_ZONE.DESC"
                borderColor={'red.500'}
                borderWidth={1.5}
                borderRadius={'7px'}
              >
                <Flex
                  alignItems={'flex-start'}
                  justifyContent={'space-between'}
                  flexDir={{ base: 'column', md: 'row' }}
                >
                  <BaseText variant={TextVariant.S}>
                    {t('PROFILE.DANGER_ZONE.LOGOUT_ALL_SESSIONS_DESC')}
                  </BaseText>
                  <VStack gap={4} alignItems={'flex-end'} justifyContent={'flex-end'}>
                    <BaseButton isLoading={false} colorType="danger" onClick={() => logout()}>
                      {t('COMMON.LOGOUT')}
                    </BaseButton>
                    <BaseButton
                      colorType={'danger'}
                      isLoading={false}
                      onClick={() => setValidateDisabledAccount(!validateDisabledAccount)}
                    >
                      {t('PROFILE.DANGER_ZONE.DELETE_ACCOUNT')}
                    </BaseButton>
                  </VStack>
                </Flex>
              </ProfileForm>
              <Flex width={'full'} alignItems={'flex-end'} justifyContent={'flex-end'}>
                <BaseButton
                  colorType={'success'}
                  onClick={() => handleSubmit()}
                  isLoading={false}
                  disabled={!dirty}
                >
                  {t('COMMON.VALIDATE')}
                </BaseButton>
              </Flex>
            </VStack>
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
          </>
        )}
      </Formik>
      <PassKeyModal
        isOpen={openPassKeyModal}
        onChange={() => setOpenPasskeyModal(!openPassKeyModal)}
        callback={handleRegisterNewKey}
        isLoading={passkeyLoading}
      />
      <DisabledAccount
        onChange={() => setValidateDisabledAccount(!validateDisabledAccount)}
        isOpen={validateDisabledAccount}
        callback={() => {}}
        data={currentUser?.email}
        isLoading={false}
      />

      <TotpQrCode
        onChange={() => {
          setOpenTotp(false);
          setRefetchUserInfo(true);
        }}
        isOpen={openTotp}
        data={totpData}
      />

      <DeleteModalAnimation
        title={'PROFILE.REMOVE_KEY_TITLE'}
        isOpen={isRevoke}
        onChange={() => setIsRevoke(false)}
        callback={handleRemoveKey}
        ignoreFooter={false}
      >
        <BaseText>{t('PROFILE.REMOVE_KEY_TITLE_DESC')}</BaseText>
      </DeleteModalAnimation>
      <DeleteModalAnimation
        title={'PROFILE.CLOSE_SESSION'}
        isOpen={openCloseSessionModal}
        onChange={() => setOpenCloseSessionModal(false)}
        callback={handleClearSession}
        ignoreFooter={false}
      >
        <BaseText>{t('PROFILE.CLOSE_SESSION_DESC')}</BaseText>
      </DeleteModalAnimation>
    </>
  );
};
