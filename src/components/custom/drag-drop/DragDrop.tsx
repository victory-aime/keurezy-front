"use client";

import {
  Alert,
  Box,
  FileUpload,
  FileUploadDropzone,
  FileUploadDropzoneContent,
  FileUploadItemPreviewImage,
  Float,
  HStack,
  Icon,
  useFileUpload,
  useFileUploadContext,
  For,
  Circle,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { HiOutlineInformationCircle, HiX } from "react-icons/hi";
import { LuUpload } from "react-icons/lu";
import {
  ACCEPTED_TYPES,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
  TYPES_FILES,
} from "./constant/constants";
import { convertUrlsToFiles } from "rise-core-frontend";
import { BaseText, TextVariant } from "../base-text";
import { VariablesColors } from "_theme/variables";
import { useTranslation } from "react-i18next";
import { useFileUploadErrors } from "./useFileUploadErrors";
import { CustomSkeletonLoader } from "../custom-skeleton";
import { BaseRatio } from "../aspect-ratio";

const FileImageList = ({
  getFilesUploaded,
  initialImageUrls,
  t,
}: {
  getFilesUploaded: (files: File[]) => void;
  initialImageUrls?: string[];
  t: any;
}) => {
  const fileUpload = useFileUploadContext();
  const { error, errorType } = useFileUploadErrors({
    onValidFiles: getFilesUploaded,
  });

  useEffect(() => {
    if (
      initialImageUrls &&
      initialImageUrls.length > 0 &&
      fileUpload.acceptedFiles.length === 0
    ) {
      convertUrlsToFiles(initialImageUrls).then((files) => {
        fileUpload.setFiles([...files]);
      });
    }
  }, [initialImageUrls]);

  return (
    <Box w={"full"}>
      <HStack width={"full"} justifyContent={"flex-start"} wrap="wrap" gap="3">
        {fileUpload.acceptedFiles.map((file, index) => (
          <FileUpload.ItemGroup key={index} asChild>
            <FileUpload.Item
              p="2"
              width="auto"
              key={file.name}
              file={file}
              pos="relative"
            >
              <Float>
                <FileUpload.ItemDeleteTrigger
                  p="0.5"
                  rounded="l1"
                  bg="red.500"
                  borderWidth="1px"
                >
                  <HiX color={VariablesColors.white} />
                </FileUpload.ItemDeleteTrigger>
              </Float>
              <FileUploadItemPreviewImage boxSize="120px" objectFit="cover" />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        ))}
      </HStack>
      {error && (
        <Alert.Root status="error" mt={5} p={4} width={"full"}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              {errorType === "max_file"
                ? t("DRAG_DROP.ERROR.MAX_FILES_TITLE")
                : errorType === "size"
                  ? t("DRAG_DROP.ERROR.MAX_SIZES_TITLE")
                  : t("DRAG_DROP.ERROR.TYPE_FILES_TITLE")}
            </Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Box>
  );
};

export const BaseDragDropZone = ({
  getFilesUploaded,
  initialImageUrls,
  maxFiles = MAX_FILES,
  maxFileSize = MAX_FILE_SIZE,
  label,
  messageInfo,
}: {
  getFilesUploaded: (files: File[]) => void;
  initialImageUrls: string[];
  maxFiles?: number;
  maxFileSize?: number;
  label?: string | ReactNode;
  messageInfo?: string;
}) => {
  const { getRootProps } = useFileUpload();
  const { t } = useTranslation();

  return (
    <FileUpload.Root
      {...getRootProps()}
      maxFiles={maxFiles}
      maxFileSize={maxFileSize}
      alignItems="stretch"
      accept={ACCEPTED_TYPES}
      cursor={"pointer"}
      _dragging={{ borderColor: "primary.500" }}
    >
      <FileUpload.HiddenInput />
      {label === "string" ? (
        <BaseText fontSize={"sm"}>{label}</BaseText>
      ) : (
        label
      )}
      <FileUploadDropzone _hover={{ borderColor: "primary.500" }}>
        <Icon fontSize="xl" color="fg.muted">
          <LuUpload />
        </Icon>
        <FileUploadDropzoneContent>
          <BaseText color={"fg.muted"} variant={TextVariant.S}>
            {t("DRAG_DROP.TITLE")}
          </BaseText>
          <BaseText color="fg.subtle">
            {t("DRAG_DROP.DESC", {
              max_size: MAX_FILE_SIZE_MB,
              type_files: TYPES_FILES,
            })}
          </BaseText>
          <BaseText color="fg.subtle" variant={TextVariant.S}>
            {t("DRAG_DROP.FILES_NUMBER", { max_files: maxFiles })}
          </BaseText>
        </FileUploadDropzoneContent>
      </FileUploadDropzone>
      {messageInfo && (
        <Flex
          gap={2}
          fontSize={"sm"}
          alignItems={"center"}
          color={VariablesColors.info}
        >
          <HiOutlineInformationCircle size={18} />
          {messageInfo}
        </Flex>
      )}
      <FileImageList
        getFilesUploaded={getFilesUploaded}
        initialImageUrls={initialImageUrls}
        t={t}
      />
    </FileUpload.Root>
  );
};

const SimpleFileUpload = ({
  getFileUploaded,
  avatarImage,
  name,
  handleDeleteAvatar,
  shape = "rounded",
  isReadOnly,
}: {
  getFileUploaded: (file: File | undefined) => void;
  avatarImage?: string;
  name?: string;
  handleDeleteAvatar?: () => void;
  shape?: "square" | "rounded" | "full";
  isReadOnly?: boolean;
}) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const fileUpload = useFileUploadContext();
  const { error, errorType } = useFileUploadErrors({
    onValidFiles: (files) => getFileUploaded(files[0] || undefined),
  });

  useEffect(() => {
    if (
      typeof avatarImage === "string" &&
      avatarImage &&
      fileUpload.acceptedFiles.length === 0
    ) {
      convertUrlsToFiles(avatarImage).then((file) => {
        fileUpload.setFiles([...file]);
      });
    }
  }, [avatarImage]);

  useEffect(() => {
    if (fileUpload.acceptedFiles.length > 0) {
      setIsImageDeleted(false);
      const file = fileUpload.acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(undefined);
    }
  }, [fileUpload.acceptedFiles]);

  const handleDeleteImage = () => {
    fileUpload.setFiles([]);
    getFileUploaded(undefined);
    setPreviewUrl(undefined);
    setIsImageDeleted(true);
    handleDeleteAvatar?.();
  };

  return (
    <VStack w="full" align="center" justify="center">
      <Box pos="relative" width="full" overflow="hidden">
        <FileUpload.Trigger asChild>
          <BaseRatio
            _disabled={{
              opacity: isReadOnly ? 0.6 : 1,
              cursor: isReadOnly ? "not-allowed" : "none",
            }}
            cursor="pointer"
            colorPalette={
              (previewUrl || avatarImage) && !isImageDeleted ? "green" : "none"
            }
            image={
              !isImageDeleted
                ? previewUrl ||
                  (avatarImage?.trim()
                    ? avatarImage
                    : "/assets/images/placeholder-image.png")
                : "/assets/images/placeholder-image.png"
            }
          />
        </FileUpload.Trigger>

        {!isImageDeleted && fileUpload?.acceptedFiles?.length > 0 && (
          <For each={fileUpload?.acceptedFiles}>
            {(file, index) => (
              <FileUpload.ItemGroup key={index}>
                {isReadOnly ? null : (
                  <Float
                    placement="bottom-end"
                    offsetX="3"
                    offsetY="3"
                    key={file.name}
                  >
                    <FileUpload.Item
                      rounded="full"
                      bg="red.500"
                      p="1"
                      borderColor="none"
                      width="auto"
                      file={file}
                      pos="relative"
                    >
                      <FileUpload.ItemDeleteTrigger>
                        <HiX color="white" />
                      </FileUpload.ItemDeleteTrigger>
                    </FileUpload.Item>
                  </Float>
                )}
              </FileUpload.ItemGroup>
            )}
          </For>
        )}
        {(previewUrl || avatarImage) && !isImageDeleted && (
          <>
            {isReadOnly ? null : (
              <Float
                placement="bottom-end"
                offsetX="3"
                offsetY="3"
                key={"image"}
                cursor={"pointer"}
              >
                <Circle
                  bg="red.500"
                  p="1"
                  borderColor="none"
                  width="auto"
                  onClick={handleDeleteImage}
                >
                  <HiX color="white" />
                </Circle>
              </Float>
            )}
          </>
        )}
      </Box>

      {error && (
        <Alert.Root status="error" mt={5} p={4} width="full">
          <Alert.Indicator />
          <Alert.Content>
            {errorType === "max_file"
              ? t("DRAG_DROP.ERROR.MAX_FILES_TITLE")
              : errorType === "size"
                ? t("DRAG_DROP.ERROR.MAX_SIZES_TITLE")
                : t("DRAG_DROP.ERROR.TYPE_FILES_TITLE")}
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </VStack>
  );
};

export const UploadAvatar = ({
  getFileUploaded,
  avatarImage,
  name,
  isLoading,
  isReadOnly,
  handleDeleteAvatar,
  shape,
  messageInfo,
}: {
  getFileUploaded: (file: File | undefined) => void;
  avatarImage?: string;
  name?: string;
  isLoading?: boolean;
  isReadOnly?: boolean;
  handleDeleteAvatar?: () => void;
  shape?: "square" | "rounded" | "full";
  messageInfo?: string;
}) => {
  const { getRootProps } = useFileUpload();
  return (
    <>
      {isLoading ? (
        <CustomSkeletonLoader type="IMAGE" width={"full"} height={"150px"} />
      ) : (
        <FileUpload.Root
          {...getRootProps()}
          maxFiles={1}
          maxFileSize={MAX_FILE_SIZE}
          accept={ACCEPTED_TYPES}
          disabled={isReadOnly}
        >
          <FileUpload.HiddenInput />
          <SimpleFileUpload
            getFileUploaded={getFileUploaded}
            avatarImage={avatarImage}
            name={name}
            handleDeleteAvatar={handleDeleteAvatar}
            shape={shape}
            isReadOnly={isReadOnly}
          />
          {messageInfo && (
            <Flex gap={2} alignItems={"center"} color={VariablesColors.red}>
              <HiOutlineInformationCircle size={18} />
              {messageInfo}
            </Flex>
          )}
        </FileUpload.Root>
      )}
    </>
  );
};
