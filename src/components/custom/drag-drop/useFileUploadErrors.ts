import { useEffect, useState } from "react";
import { useFileUploadContext } from "@chakra-ui/react";
import { ACCEPTED_TYPES, MAX_FILE_SIZE, MAX_FILES } from "./constant/constants";
import { useTranslation } from "react-i18next";

export type ErrorType = "size" | "max_file" | "type" | null;

export const useFileUploadErrors = ({
  onValidFiles,
}: {
  onValidFiles: (files: File[]) => void;
}) => {
  const { t } = useTranslation();
  const fileUpload = useFileUploadContext();
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<ErrorType>(null);

  useEffect(() => {
    if (fileUpload.acceptedFiles.length > MAX_FILES) {
      setErrorType("max_file");
      setError(t("DRAG_DROP.ERROR.MAX_FILES", { max_files: MAX_FILES }));
    } else if (fileUpload.rejectedFiles.length > 0) {
      const oversized = fileUpload.rejectedFiles.some((file) =>
        file.errors.includes("FILE_TOO_LARGE"),
      );
      const invalidType = fileUpload.rejectedFiles.some((file) =>
        file.errors.includes("FILE_INVALID_TYPE"),
      );
      const tooMany = fileUpload.rejectedFiles.some((file) =>
        file.errors.includes("TOO_MANY_FILES"),
      );

      if (oversized) {
        setErrorType("size");
        setError(
          t("DRAG_DROP.ERROR.MAX_SIZES", {
            max_sizes: MAX_FILE_SIZE / (1024 * 1024),
          }),
        );
      } else if (invalidType) {
        setErrorType("type");
        setError(
          t("DRAG_DROP.ERROR.TYPE_FILES", { type_files: ACCEPTED_TYPES }),
        );
      } else if (tooMany) {
        setErrorType("max_file");
        setError(t("DRAG_DROP.ERROR.MAX_FILES", { max_files: MAX_FILES }));
      } else {
        setError(null);
        setErrorType(null);
      }
    } else {
      setError(null);
      setErrorType(null);
      onValidFiles(fileUpload.acceptedFiles);
    }
  }, [fileUpload.acceptedFiles.length, fileUpload.rejectedFiles.length]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
        setErrorType(null);
        fileUpload.clearRejectedFiles();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return { error, errorType };
};
