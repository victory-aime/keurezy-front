import { downloadFile } from "_hooks/download";
import {
  BaseDrawer,
  BaseText,
  Icons,
  ModalOpenProps,
} from "_components/custom";
import { Box, IconButton } from "@chakra-ui/react";
import { PdfViewer } from "../../components/PDFViewer";

export const DocumentPreviewModal = ({
  isOpen,
  onChange,
  data,
}: ModalOpenProps) => {
  const getFileType = (url: string) => {
    if (url.includes("/image/")) return "image";
    if (url.includes("/raw/")) return "pdf";
    return "other";
  };

  return (
    <BaseDrawer
      size="xl"
      title={"Preview des documents"}
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
              case "image":
                return (
                  <Box>
                    <IconButton
                      onClick={() => downloadFile(data)}
                      colorPalette={"green"}
                      p={1}
                      mb={4}
                    >
                      <Icons.Download />
                      Télécharger le fichier
                    </IconButton>
                    <img
                      src={data}
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                );

              case "pdf": {
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
