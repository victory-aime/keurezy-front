'use client';

import React from 'react';
import {
  BaseAccordion,
  BaseButton,
  BaseContainer,
  BaseText,
  Icons,
  TextVariant,
} from '_components/custom';
import { IntegrationsProviderModule } from '_store/state-management';
import { GoogleDriveUpload } from './GoogleDriveUpload';
import { TrashedFilesList } from './TrashedFilesList';
import { VStack, Circle } from '@chakra-ui/react';
import { HiOutlineCloud } from 'react-icons/hi';
import { DisconnectDrive } from './DisconnectDrive';
import { ProviderKeys } from '_constants/StorageKeys';

export function GoogleDriveProvider() {
  const [enabled, setEnabled] = React.useState(false);
  const [openConsent, setOpenConsent] = React.useState(false);
  const { data } = IntegrationsProviderModule.getProviderUrlQueries({
    params: {
      provider: ProviderKeys.GOOGLE_DRIVE,
    },
    queryOptions: { enabled },
  });

  const {
    data: status,
    isLoading,
    refetch: refetchStatus,
  } = IntegrationsProviderModule.getProviderStatusQueries({
    params: { provider: ProviderKeys.GOOGLE_DRIVE },
  });

  const {
    data: trashedFiles,
    isLoading: isLoadingTrashedFiles,
    refetch,
  } = IntegrationsProviderModule.getTrashedFilesQueries({
    params: { provider: ProviderKeys.GOOGLE_DRIVE },
    queryOptions: { enabled: !!status?.connected },
  });

  const { mutateAsync: disconnect, isPending: disconnectPending } =
    IntegrationsProviderModule.disconnectProviderMutation({
      mutationOptions: {
        onSuccess: async () => {
          await refetchStatus();
        },
      },
    });

  React.useEffect(() => {
    if (data) {
      window.location.href = data.url;
    }
  }, [data]);

  if (isLoading) return null;

  if (!status?.connected) {
    return (
      <VStack py={10} gap={3} w="full">
        <Circle size="10" bg="green.50" color="green.600">
          <HiOutlineCloud size={20} />
        </Circle>
        <BaseText variant={TextVariant.M} color="fg.muted">
          Connectez votre Google Drive pour envoyer des fichiers.
        </BaseText>
        <BaseButton onClick={() => setEnabled(true)}>Connecter mon drive</BaseButton>
      </VStack>
    );
  }

  return (
    <BaseContainer
      border={'none'}
      title="Google Drive"
      description={"Accès limité aux fichiers créés par l'application"}
      icon={<HiOutlineCloud size={20} />}
      withActionButtons
      actionsButtonProps={{
        cancelTitle: 'Déconnecte',
        cancelShow: !!status?.connected,
        onCancel: async () => {
          setOpenConsent(true);
        },
      }}
    >
      <BaseAccordion
        multipleOpen
        isLoading={isLoading}
        mt={10}
        items={[
          {
            label: 'Mes Fichiers',
            icon: <Icons.LuFiles />,
            content: <GoogleDriveUpload status={!!status?.connected} />,
          },
          {
            label: 'Corbeille',
            icon: <Icons.Trash />,
            content: (
              <TrashedFilesList
                trashedFiles={trashedFiles ?? []}
                refetch={refetch}
                isLoadingTrashedFiles={isLoadingTrashedFiles}
              />
            ),
            selectedLength: trashedFiles?.length,
          },
        ]}
      />
      <DisconnectDrive
        isOpen={openConsent}
        callback={async () => await disconnect({ params: { provider: ProviderKeys.GOOGLE_DRIVE } })}
        isLoading={disconnectPending}
        onChange={() => setOpenConsent(false)}
      />
    </BaseContainer>
  );
}
