"use client";

import { Document, Page } from "react-pdf";
import { useState } from "react";
import "../../lib/pdf-worker";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { BaseText, Icons, Loader } from "_components/custom";
import { downloadFile } from "_hooks/download";

export const PdfViewer = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.3);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const nextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
  const prevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));

  const zoomIn = () => setScale((prev) => prev + 0.2);
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  return (
    <Box position="relative" mx="auto" bgColor={"bg.emphasized"} p={3}>
      <BaseText textAlign={"center"} py={2} mb={4} borderRadius="md">
        Page {pageNumber} / {numPages}
      </BaseText>

      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <Loader
            loader
            text="Chargement du fichier veuillez patienter"
            showText
          />
        }
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      <Flex
        position="fixed"
        bottom="200px"
        right="16px"
        zIndex="1000"
        direction={"column"}
        aria-label="pdf-preview"
        cursor={"pointer"}
        gap={1}
      >
        {numPages > 1 ? (
          <>
            <IconButton
              rounded={"full"}
              onClick={prevPage}
              disabled={pageNumber === 1}
              colorPalette={"gray"}
            >
              <Icons.IoIosArrowRoundBack />
            </IconButton>
            <IconButton
              rounded={"full"}
              onClick={nextPage}
              disabled={pageNumber === numPages}
              colorPalette={"border"}
            >
              <Icons.ArrowRight />
            </IconButton>
          </>
        ) : null}

        <IconButton rounded={"full"} colorPalette={"cyan"} onClick={zoomOut}>
          <Icons.Minus />
        </IconButton>
        <IconButton rounded={"full"} colorPalette={"red"} onClick={zoomIn}>
          <Icons.PlusMinus />
        </IconButton>
        <IconButton
          rounded={"full"}
          onClick={() => downloadFile(file)}
          colorPalette={"green"}
        >
          <Icons.Download />
        </IconButton>
      </Flex>
    </Box>
  );
};
