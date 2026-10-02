import { downloadFile } from '_hooks/download';
import { BaseDrawer, BaseText, Icons, ModalOpenProps, BaseButton } from '_components/custom';
import { Box } from '@chakra-ui/react';
import { PdfViewer } from '../../components/PDFViewer';

export const DocumentPreviewModal = ({ isOpen, onChange, data }: ModalOpenProps) => {
  const getFileType = (url: string) => {
    if (url.includes('/image/')) return 'image';
    if (url.includes('/raw/')) return 'pdf';
    return 'other';
  };

  return (
    <BaseDrawer
      size="xl"
      title={'Preview des documents'}
      onChange={onChange}
      isOpen={isOpen}
      ignoreFooter
      icon={<Icons.Paper />}
    >
      {data && (
        <>
          {(() => {
            const fileType = getFileType(data);

            switch (fileType) {
              case 'image':
                return (
                  <Box>
                    <BaseButton
                      size="sm"
                      variant="outline"
                      mb={4}
                      leftIcon={<Icons.Download aria-hidden />}
                      onClick={() => downloadFile(data)}
                    >
                      Télécharger le fichier
                    </BaseButton>
                    <img
                      src={data}
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                );

              case 'pdf': {
                return <PdfViewer file={data} />;
              }
              default:
                return (
                  <BaseText textAlign="center" color="gray.400">
                    Preview non disponible
                  </BaseText>
                );
            }
          })()}
        </>
      )}
    </BaseDrawer>
  );
};
