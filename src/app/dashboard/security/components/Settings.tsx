'use client';
import React, { useRef, useState } from 'react';
import { DisabledAccount } from '../../profile/components/DisabledAccount';
import { VStack, HStack, Flex } from '@chakra-ui/react';
import {
  BaseText,
  TextVariant,
  FormTextInput,
  BaseButton,
  BaseIcon,
  FormSwitch,
  Icons,
  DeleteModalAnimation,
  BaseTag,
} from '_components/custom';
import { Formik, FormikProps } from 'formik';
import { ProfileForm } from '../../profile/components/ProfileForm';
import { useTranslation } from 'react-i18next';
import { formatCreatedAt, formatDisplayDate } from 'rise-core-frontend';
import { useAuth } from '_hooks/useAuth';
import { useAuthContext } from '_context/auth-context';
import { Recap2FAModal } from '../../profile/components/Recap2FAModal';
import { TotpQrCode } from '../../profile/components/TotpQrCode';
import { useTotp } from '_hooks/useTotp';
import { UserModule } from '_store/state-management';
import { PassKeyModal } from './PassKeyModal';
import { authClient } from '../../../lib/auth-client';
import { usePasskey } from '_hooks/usePasskey';
import { parseUserAgent } from '../utils/user-agent';
import { handleApiError } from '_utils/handleApiError';
import { handleApiSuccess } from '_utils/handleApiSuccess';

export const Settings = () => {
  const { session, user } = useAuthContext();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { enableTotp, disableTotp, isLoading } = useTotp();
  const { registerPassKey, isLoading: passkeyLoading, removePasskey } = usePasskey();
  const [totpData, setTotpData] = useState<{
    totpURI: string;
    backupCodes: string[];
  }>({ totpURI: '', backupCodes: [] });
  const [openTotp, setOpenTotp] = useState<boolean>(false);
  const [open2FA, setOpen2FA] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openCloseSessionModal, setOpenCloseSessionModal] = useState<boolean>(false);
  const [isRevoke, setIsRevoke] = useState<boolean>(false);
  const [openPassKeyModal, setOpenPasskeyModal] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const currentSessionId = session?.id;
  const [validateDisabledAccount, setValidateDisabledAccount] = useState<boolean>(false);

  // État serveur : seule source de vérité de l'interrupteur 2FA (relu après chaque action)
  const {
    data: currentUser,
    isLoading: userDataLoading,
    refetch: refetchUser,
  } = UserModule.getUserInfo({
    queryOptions: { enabled: !!user?.id },
  });
  const formikRef = useRef<FormikProps<{ twoFactorEnabled: boolean; newPassword: string }>>(null);

  /** Relit l'utilisateur et aligne l'interrupteur, y compris après une activation abandonnée. */
  const syncTwoFactor = async () => {
    const { data } = await refetchUser();
    await formikRef.current?.setFieldValue('twoFactorEnabled', !!data?.twoFactorEnabled);
  };

  const {
    data: passkeySessionsList,
    isLoading: passkeySessionLoad,
    refetch: refetchPassKeySessionList,
  } = UserModule.getPasskeySessions({
    queryOptions: { enabled: !!user?.id },
  });

  // `checked` = état demandé par l'interrupteur ; un mot de passe faux laisse la modale ouverte
  const onSubmit2FA = async (value: { password: string }) => {
    if (!checked) {
      if (!(await disableTotp(value.password))) return;
      setOpen2FA(false);
      await syncTwoFactor();
      return;
    }
    const data = await enableTotp(value.password);
    if (!data) return;
    setTotpData(data);
    setOpen2FA(false);
    setOpenTotp(true);
  };

  const handleRegisterNewKey = async (values: { passkeyName: string }) => {
    await registerPassKey(values?.passkeyName).then((data) => {
      if (!data) return;
      setOpenPasskeyModal(false);
    });
  };

  const handleRemoveKey = async () => {
    removePasskey(selectedData!).then(() => {
      setIsRevoke(false);
      refetchPassKeySessionList();
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
          message: 'Operation réussie',
          status: 200,
        });
        await refetchPassKeySessionList();
      }
    } catch (error) {
      handleApiError({ status: 500, message: 'Erreur inattendue' });
    }
  };

  return (
    <React.Fragment>
      <Formik
        enableReinitialize
        innerRef={formikRef}
        initialValues={{ twoFactorEnabled: !!currentUser?.twoFactorEnabled, newPassword: '' }}
        onSubmit={() => {}}
      >
        {({ values, handleSubmit, resetForm, dirty }) => (
          <React.Fragment>
            <VStack gap={10} alignItems={'flex-start'}>
              <ProfileForm
                title="PROFILE.SECURITY.PASSWORD"
                description="PROFILE.SECURITY.PASSWORD_DESC"
                isLoading={userDataLoading}
              >
                <FormTextInput
                  name="newPassword"
                  label="PROFILE.NEW_PASSWORD"
                  placeholder="PROFILE.NEW_PASSWORD"
                  type="password"
                  value={values?.newPassword}
                  infoMessage={'PROFILE.SECURITY.PASSWORD_INFO'}
                  isDisabled={true}
                  isLoading={userDataLoading}
                />
              </ProfileForm>

              <ProfileForm
                title="PROFILE.SECURITY.PASS_KEY"
                description="PROFILE.SECURITY.PASS_KEY_DESC"
                isLoading={passkeySessionLoad}
              >
                <BaseButton
                  isLoading={passkeySessionLoad}
                  withGradient
                  onClick={() => setOpenPasskeyModal(true)}
                >
                  {t('PROFILE.SECURITY.ADD_PASS_KEY')}
                </BaseButton>

                {passkeySessionsList?.passkeys?.map((cred) => (
                  <HStack
                    key={cred.id}
                    width={'full'}
                    mt={5}
                    justifyContent={'space-between'}
                    py={2}
                    borderBottom="1px solid"
                    borderColor={'inherit'}
                  >
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
                  </HStack>
                ))}
                {!passkeySessionsList?.passkeys?.length && !passkeyLoading && (
                  <BaseText mt={8}>{t('PROFILE.SECURITY.PASS_KEY_NO_FOUND')}</BaseText>
                )}
              </ProfileForm>

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

              <ProfileForm
                title="PROFILE.SECURITY.ACTIVE_SESSIONS"
                description="PROFILE.SECURITY.ACTIVE_SESSIONS_DESC"
                isLoading={passkeySessionLoad}
              >
                <BaseButton
                  isLoading={passkeySessionLoad}
                  withGradient
                  colorType={'danger'}
                  variant={'outline'}
                  onClick={() => clearOtherSessions()}
                >
                  Annuler les autres sessions
                </BaseButton>
                {passkeySessionsList?.sessions?.map((session, idx) => (
                  <HStack
                    key={idx}
                    width="full"
                    justifyContent="space-between"
                    alignItems="center"
                    py={2}
                  >
                    <VStack gap={1} width="full" align="stretch">
                      <HStack>
                        <BaseText fontWeight="bold">{parseUserAgent(session?.userAgent!)}</BaseText>
                        {session?.id === currentSessionId && (
                          <BaseTag color="purple" label={t('PROFILE.SECURITY.CURRENT_SESSION')} />
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
                          <BaseText>Expires le: {formatDisplayDate(session?.expiresAt)}</BaseText>
                        </HStack>
                      </Flex>
                    </VStack>
                    {passkeySessionsList?.sessions?.length > 1 && (
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
                  </HStack>
                ))}

                {!passkeySessionsList?.sessions?.length && !passkeyLoading && (
                  <BaseText mt={8}>{t('PROFILE.SECURITY.NO_SESSIONS_FOUND')}</BaseText>
                )}
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
          </React.Fragment>
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
        // Fermer sans code valide laisse la 2FA désactivée : l'état serveur est relu dans les deux cas
        onChange={() => {
          setOpenTotp(false);
          void syncTwoFactor();
        }}
        onVerified={() => {
          setOpenTotp(false);
          void syncTwoFactor();
        }}
        isOpen={openTotp}
        data={totpData}
      />

      <DeleteModalAnimation
        title={'PROFILE.REMOVE_KEY_TITLE'}
        isOpen={isRevoke}
        isLoading={passkeyLoading}
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
        //callback={handleClearSession}
        ignoreFooter={false}
      >
        <BaseText>{t('PROFILE.CLOSE_SESSION_DESC')}</BaseText>
      </DeleteModalAnimation>
    </React.Fragment>
  );
};
