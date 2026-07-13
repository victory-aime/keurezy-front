'use client';

import { VStack, HStack, Circle, Box, Icon, IconButton } from '@chakra-ui/react';
import {
  BaseText,
  CustomSkeletonLoader,
  DeleteModalAnimation,
  TextVariant,
} from '_components/custom';
import { getFileIconColor, getFileIcon } from '_hooks/download';
import { IntegrationsProviderModule } from '_store/state-management';
import React, { useState } from 'react';
import { HiOutlineExternalLink, HiOutlineTrash } from 'react-icons/hi';
import { formatDisplayDate, getTimeValue } from 'rise-core-frontend';
import { MODELS } from '_types/';

export function TrashedFilesList({
  trashedFiles,
  refetch,
  isLoadingTrashedFiles,
}: {
  trashedFiles: MODELS.ListedFileResult[];
  refetch?: () => void;
  isLoadingTrashedFiles: boolean;
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { mutateAsync: deleteFile, isPending } =
    IntegrationsProviderModule.deleteFileProviderMutation({
      mutationOptions: {
        onSuccess: () => {
          refetch?.();
        },
      },
    });
  const handleDeleteFile = async () => {
    if (selectedFile) {
      await deleteFile({ params: { fileId: selectedFile, provider: 'GOOGLE_DRIVE' } });
    }
  };

  return (
    <React.Fragment>
      {isLoadingTrashedFiles ? (
        <CustomSkeletonLoader type={'DATA_TABLE'} />
      ) : (
        <VStack align="stretch" gap={0} borderWidth="1px" borderRadius="l2" overflowY="hidden">
          {trashedFiles?.map((file, index) => {
            const config = getFileIconColor(file.name);
            const FileIcon = getFileIcon(file?.name);
            return (
              <HStack
                key={file.fileId}
                px={4}
                py={3}
                gap={3}
                borderBottomWidth={index === trashedFiles?.length - 1 ? '0' : '1px'}
              >
                <Circle size="8" bg={config.bg} color={config.color} flexShrink={0}>
                  <Icon
                    as={FileIcon}
                    boxSize={3.5}
                    color={config.color}
                    _dark={{ color: config.color }}
                  />
                </Circle>

                <Box flex={1} minW={0}>
                  <BaseText variant={TextVariant.S} truncate>
                    {file.name}
                  </BaseText>
                  <BaseText variant={TextVariant.XS} color="fg.muted" fontFamily="mono">
                    {file?.size} · {formatDisplayDate(file.modifiedTime)} ·{' '}
                    {getTimeValue(file.modifiedTime!)}
                  </BaseText>
                </Box>
                <IconButton
                  aria-label="Ouvrir dans Google Drive"
                  size="xs"
                  colorPalette={'purple'}
                  onClick={() => window.open(file.webViewLink, '_blank')}
                >
                  <HiOutlineExternalLink size={16} />
                </IconButton>
                <IconButton
                  aria-label="Ouvrir dans Google Drive"
                  size="xs"
                  colorPalette={'red'}
                  onClick={() => {
                    setSelectedFile(file.fileId);
                    setOpenDelete(true);
                  }}
                >
                  <HiOutlineTrash />
                </IconButton>
              </HStack>
            );
          })}

          {trashedFiles?.length === 0 && (
            <Box px={4} py={8} textAlign="center">
              <BaseText variant={TextVariant.S} color="fg.muted">
                Aucun fichier envoyé pour l'instant.
              </BaseText>
            </Box>
          )}
        </VStack>
      )}

      <DeleteModalAnimation
        title="Supprimer définitivement"
        onChange={setOpenDelete}
        isOpen={openDelete}
        ignoreFooter={false}
        isLoading={isPending}
        callback={handleDeleteFile}
        buttonSaveTitle={'Supprimer'}
      >
        Ce fichier sera supprimé définitivement de votre Google Drive et ne pourra pas être récupéré
        depuis l'application. Êtes-vous sûr de vouloir poursuivre ?
      </DeleteModalAnimation>
    </React.Fragment>
  );
}
