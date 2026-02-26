import { VStack, Box, Flex } from "@chakra-ui/react";
import { BaseModal, Icons, BaseText, ModalOpenProps } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { ENUM } from "_types/*";
import { formatDisplayDate } from "rise-core-frontend";
import { RentalModalSection, RentalInfoItem } from "./RentalSection";

export const RentalModal = ({
  isOpen,
  onChange,
  isLoading,
  pendingRequestCountForSelected,
  data,
  callback,
  onReject,
}: ModalOpenProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onChange={onChange}
      onReject={onReject}
      onClick={callback}
      title="Candidature"
      description={`Candidature pour : ${data?.property?.title}`}
      status={data?.status}
      buttonRejectTitle={
        data?.status === ENUM.COMMON.Status.PENDING ? "Rejeter" : ""
      }
      iconRejectButton={<Icons.Close />}
      iconSaveButton={<Icons.Check />}
      buttonSaveTitle={
        data?.status === ENUM.COMMON.Status.PENDING ? "Accepter" : ""
      }
      alignItems={"flex-end"}
      justifyContent={"flex-end"}
      isLoading={isLoading}
    >
      <VStack alignItems="flex-start" gap={6}>
        {pendingRequestCountForSelected > 1 && (
          <Box
            width="full"
            p={4}
            rounded="lg"
            bg="red.50"
            border="1px solid"
            borderColor="red.200"
          >
            <Flex gap={2}>
              <Icons.Warn size={44} color={VariablesColors.danger} />
              <BaseText fontWeight="medium">
                Ce bien possède {pendingRequestCountForSelected} candidatures en
                attente. En acceptant cette demande, les autres seront
                automatiquement rejetées.
              </BaseText>
            </Flex>
          </Box>
        )}
        <RentalModalSection icon={<Icons.User />} title="Informations">
          <Flex
            width="full"
            gap={4}
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <RentalInfoItem
              icon={<Icons.User />}
              label="Nom"
              value={data?.tenant?.name}
            />
            <RentalInfoItem
              icon={<Icons.Mail />}
              label="Email"
              value={data?.tenant?.email}
            />
            <RentalInfoItem
              icon={<Icons.Phone />}
              label="Phone"
              value={data?.phone}
            />
          </Flex>
        </RentalModalSection>

        <RentalModalSection
          icon={<Icons.RiBuildingLine />}
          title="Détails de la demande"
        >
          <Flex
            width="full"
            gap={4}
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <RentalInfoItem
              icon={<Icons.RiBuildingLine />}
              label="Bien"
              value={data?.property?.title}
            />
            <RentalInfoItem
              icon={<Icons.User />}
              label="Emménagement"
              value={formatDisplayDate(data?.createdAt)}
            />
            <RentalInfoItem
              icon={<Icons.User />}
              label="Candidature"
              value={formatDisplayDate(data?.createdAt)}
            />
          </Flex>
        </RentalModalSection>

        <RentalModalSection icon={<Icons.Chat />} title="Message du candidat">
          <Box
            width="full"
            p={4}
            rounded="lg"
            bgColor="gray.100"
            border="1px solid"
            borderColor="border"
          >
            {data?.message}
          </Box>
        </RentalModalSection>
      </VStack>
    </BaseModal>
  );
};
