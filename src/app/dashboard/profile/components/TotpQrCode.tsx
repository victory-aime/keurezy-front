import { BaseButton, BaseModal, ModalOpenProps } from "_components/custom";
import {
  QrCode,
  VStack,
  AbsoluteCenter,
  Spinner,
  DownloadTrigger,
} from "@chakra-ui/react";
import { CiLock } from "react-icons/ci";

export const TotpQrCode = ({ isOpen, onChange, data }: ModalOpenProps) => {
  return (
    <BaseModal
      title={"2FA"}
      icon={<CiLock />}
      iconBackgroundColor={"tertiary.500"}
      isOpen={isOpen}
      onChange={onChange}
      ignoreFooter
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <VStack alignItems={"center"} justifyContent={"center"}>
        <QrCode.Root size={"2xl"} value={data?.totpURI}>
          <QrCode.Frame>
            <QrCode.Pattern />
          </QrCode.Frame>
          {!data && (
            <AbsoluteCenter bg="bg/80" boxSize="100%">
              <Spinner color="primary.500" />
            </AbsoluteCenter>
          )}

          <DownloadTrigger
            data={data?.backupCodes}
            fileName="backupCodes.txt"
            mimeType="text/plain"
          >
            <BaseButton
              variant="outline"
              mt="3"
              width="full"
              onClick={() => {
                if (!data?.backupCodes?.length) return;
                const content = data.backupCodes.join("\n");
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "backup-codes.txt";
                link.click();

                URL.revokeObjectURL(url);
              }}
            >
              Download backup codes
            </BaseButton>
          </DownloadTrigger>
        </QrCode.Root>
      </VStack>
    </BaseModal>
  );
};
