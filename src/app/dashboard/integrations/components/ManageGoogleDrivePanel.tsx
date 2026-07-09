'use client';

import {
  Box,
  Circle,
  HStack,
  Icon,
  IconButton,
  VStack,
  Stack,
  ProgressCircle,
  AbsoluteCenter,
} from '@chakra-ui/react';
import {
  BaseText,
  TextVariant,
  BaseUploadMultipleFiles,
  CustomSkeletonLoader,
  BaseTooltip,
  Loader,
} from '_components/custom';
import { useState } from 'react';
import { HiOutlineExternalLink, HiOutlineTrash } from 'react-icons/hi';
import { getFileIcon, getFileIconColor } from '_hooks/download';
import { IntegrationsProviderModule } from '_store/state-management';
import { formatDisplayDate, getTimeValue } from 'rise-core-frontend';
import { useFakeProgress } from '_hooks/useFakeProgress';
import { ProviderKeys } from '_constants/StorageKeys';
import React from 'react';

export const ManageGoogleDrivePanel = ({
  clearFiles,
  status = false,
}: {
  clearFiles?: () => void;
  status: boolean;
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<
    { id: string; name: string; progress: number }[]
  >([]);
  const { stop, start, complete } = useFakeProgress();

  const {
    data: filesData,
    refetch,
    isLoading: isLoadingFiles,
  } = IntegrationsProviderModule.getProviderFilesQueries({
    params: { provider: ProviderKeys.GOOGLE_DRIVE },
    queryOptions: { enabled: status },
  });

  const { mutateAsync } = IntegrationsProviderModule.uploadFileMutation({
    mutationOptions: {
      onSuccess: async () => {
        await refetch();
      },
    },
  });

  const { mutateAsync: addToTrash, isPending } =
    IntegrationsProviderModule.trashedFileProviderMutation({
      mutationOptions: {
        onSuccess: async () => {
          IntegrationsProviderModule.IntegrationsProvidersCache.invalidateAllTrashedFilesCache();
          await refetch();
        },
      },
    });

  const handleFilesUploaded = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    clearFiles?.();

    newFiles.forEach(async (file) => {
      const id = crypto.randomUUID();
      setUploadingFiles((prev) => [...prev, { id, name: file.name, progress: 0 }]);

      start(id, (progress) => {
        setUploadingFiles((prev) => prev.map((u) => (u.id === id ? { ...u, progress } : u)));
      });

      const formData = new FormData();
      formData.append('file', file);

      try {
        await mutateAsync({
          payload: { file: formData as unknown as string },
          params: { provider: ProviderKeys.GOOGLE_DRIVE },
        });
        complete(id, (progress) => {
          setUploadingFiles((prev) => prev.map((u) => (u.id === id ? { ...u, progress } : u)));
        });
        setTimeout(() => {
          setUploadingFiles((prev) => prev.filter((u) => u.id !== id));
        }, 800);
      } catch (e) {
        stop(id);
        setUploadingFiles((prev) => prev.filter((u) => u.id !== id));
      } finally {
        complete(id, (progress) => {
          setUploadingFiles((prev) => prev.map((u) => (u.id === id ? { ...u, progress } : u)));
        });
      }
    });
  };

  const handleTrashFile = async (fileId: string) => {
    await addToTrash({ params: { fileId, provider: ProviderKeys.GOOGLE_DRIVE } });
  };

  return (
    <React.Fragment>
      {isLoadingFiles ? (
        <CustomSkeletonLoader type={'DATA_TABLE'} />
      ) : (
        <React.Fragment>
          <BaseUploadMultipleFiles getFilesUploaded={handleFilesUploaded} />

          <VStack
            align="flex-start"
            borderWidth="1px"
            borderRadius="l2"
            overflow="hidden"
            width={'full'}
          >
            {uploadingFiles.map((u) => (
              <HStack
                key={u.id}
                px={4}
                py={3}
                borderBottomWidth="1px"
                gap={3}
                width={'full'}
                justifyContent={'space-between'}
              >
                <BaseText variant={TextVariant.S} flex={1} truncate>
                  {u.name}
                </BaseText>
                <ProgressCircle.Root
                  value={u.progress}
                  fontSize={'xs'}
                  size={'md'}
                  colorPalette={'purple'}
                >
                  <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                    <ProgressCircle.Range strokeLinecap="round" />
                  </ProgressCircle.Circle>
                  <AbsoluteCenter>
                    <ProgressCircle.ValueText />
                  </AbsoluteCenter>
                </ProgressCircle.Root>
              </HStack>
            ))}

            {filesData?.map((file, index) => {
              const config = getFileIconColor(file.name);
              const FileIcon = getFileIcon(file?.name);
              return (
                <HStack
                  key={file.fileId}
                  px={4}
                  py={3}
                  gap={3}
                  borderBottomWidth={index === filesData?.length - 1 ? '0' : '1px'}
                  width={'full'}
                  justifyContent={'space-between'}
                >
                  <HStack>
                    <Circle size="8" bg={config.bg} color={config.color} flexShrink={0}>
                      <Icon
                        as={FileIcon}
                        boxSize={3.5}
                        color={config.color}
                        _dark={{ color: config.color }}
                      />
                    </Circle>
                    <Stack alignItems={'flex-start'} gap={0}>
                      <BaseText variant={TextVariant.S} truncate>
                        {file.name}
                      </BaseText>
                      <BaseText variant={TextVariant.XS} color="fg.muted" fontFamily="mono">
                        {file?.size} · {formatDisplayDate(file.modifiedTime)} ·{' '}
                        {getTimeValue(file.modifiedTime!)}
                      </BaseText>
                    </Stack>
                  </HStack>
                  <HStack gap={2}>
                    <BaseTooltip message={'Ouvrir dans Google Drive'} show>
                      <IconButton
                        aria-label="Ouvrir dans Google Drive"
                        size="xs"
                        colorPalette={'purple'}
                        onClick={() => window.open(file.webViewLink, '_blank')}
                      >
                        <HiOutlineExternalLink size={16} />
                      </IconButton>
                    </BaseTooltip>
                    {isPending ? (
                      <Loader loader />
                    ) : (
                      <BaseTooltip message={'Mettre dans la corbeille'} show>
                        <IconButton
                          aria-label="Supprimer"
                          size="xs"
                          colorPalette={'red'}
                          onClick={() => handleTrashFile(file.fileId)}
                        >
                          <HiOutlineTrash size={16} />
                        </IconButton>
                      </BaseTooltip>
                    )}
                  </HStack>
                </HStack>
              );
            })}

            {!filesData && uploadingFiles?.length === 0 && (
              <Box px={4} py={8} textAlign="center">
                <BaseText variant={TextVariant.S} color="fg.muted">
                  Aucun fichier envoyé pour l'instant.
                </BaseText>
              </Box>
            )}
          </VStack>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
