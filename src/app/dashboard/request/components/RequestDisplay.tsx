import { Box, Flex, VStack, Span, Text, HStack } from "@chakra-ui/react";
import {
  BaseIcon,
  Icons,
  BaseText,
  CustomSkeletonLoader,
  BaseModal,
} from "_components/custom";
import { Tag } from "_components/ui/tag";
import { ContactModule } from "_store/state-management";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { MODELS, ENUM } from "_types/*";
import { useState } from "react";
import { formatCreatedAt } from "rise-core-frontend";

export const RequestDisplay = ({
  request,
  index = 0,
  isLoading = false,
  refetchRequestList,
}: {
  request: MODELS.IAgencyRequestList;
  index?: number;
  isLoading?: boolean;
  refetchRequestList?: () => void;
}) => {
  const [readInfo, setReadInfo] = useState(false);
  const isClient = !!request?.userId;
  const { mutateAsync: changeStatus, isPending } =
    ContactModule.changeRequestStatusMutation({
      mutationOptions: {
        onSuccess: () => {
          refetchRequestList?.();
        },
      },
    });

  const onChangeStatus = async (id: string) => {
    await changeStatus({ params: id });
  };

  return (
    <Box
      key={index}
      width={"full"}
      border={"1px solid"}
      p={4}
      roundedTop={"lg"}
      borderColor={
        request.status === ENUM.COMMON.Status.PENDING ? "blue.400" : "border"
      }
      bg={
        request.status === ENUM.COMMON.Status.PENDING
          ? "blue.50"
          : "transparent"
      }
    >
      {isLoading ? (
        <VStack gap={4}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Flex gap={4} width={"full"} key={i}>
              <CustomSkeletonLoader
                type={"BUTTON"}
                colorButton="neutral"
                width={10}
              />
              <CustomSkeletonLoader type={"TEXT"} width={"full"} />
            </Flex>
          ))}
        </VStack>
      ) : (
        <Flex
          gap={3}
          alignItems={"flex-start"}
          cursor={"pointer"}
          onClick={() => setReadInfo(true)}
        >
          <BaseIcon
            color={hexToRGB(
              request.status === ENUM.COMMON.Status.PENDING
                ? "blue"
                : "tertiary",
              0.2,
            )}
          >
            {request.status === ENUM.COMMON.Status.PENDING ? (
              <Icons.Close color={VariablesColors.blue} />
            ) : (
              <Icons.Check color={VariablesColors.tertiary} />
            )}
          </BaseIcon>
          <VStack alignItems={"flex-start"} gap={0}>
            <HStack>
              <BaseText fontWeight={"semibold"}>Demande reçue</BaseText>

              <Tag size="sm" colorPalette={isClient ? "green" : "orange"}>
                {isClient ? "client" : "visiteur"}
              </Tag>
            </HStack>

            <Text color={"gray.400"}>
              {request?.fullName} veux avoir plus d'nformations sur le logement{" "}
              {request?.property?.title}
            </Text>
            <Span color={"gray.400"}>
              {formatCreatedAt(request?.createdAt!)}
            </Span>
          </VStack>
        </Flex>
      )}
      <BaseModal
        title="Demande de contact"
        isOpen={readInfo}
        onChange={() => {
          if (request.status === ENUM.COMMON.Status.PENDING) {
            onChangeStatus(request?.id!);
          }
          setReadInfo(false);
        }}
        ignoreFooter
        icon={<Icons.Request />}
      >
        <VStack align="stretch" gap={4}>
          <VStack align="flex-start" gap={1}>
            <HStack>
              <BaseText fontWeight="bold" fontSize="lg">
                {request.fullName}
              </BaseText>
              <Tag
                size="sm"
                colorPalette={isClient ? "green" : "orange"}
                variant="subtle"
              >
                {isClient ? "Client" : "Visiteur"}
              </Tag>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              A demandé des informations concernant{" "}
              <Text as="span" fontWeight="medium" color="gray.700">
                {request.property?.title}
              </Text>{" "}
              {formatCreatedAt(request.createdAt!)}
            </Text>
          </VStack>
          <Box
            bg="gray.50"
            p={4}
            rounded="md"
            border="1px solid"
            borderColor="gray.100"
          >
            <Text fontSize="sm" whiteSpace="pre-wrap" color="gray.700">
              {request.message}
            </Text>
          </Box>
          <VStack
            alignItems={"flex-start"}
            justify="space-between"
            fontSize="sm"
            color="gray.600"
          >
            <Text>email : {request.email}</Text>
            {request.phone && <Text>Telephone : {request.phone}</Text>}
          </VStack>
        </VStack>
      </BaseModal>
    </Box>
  );
};
