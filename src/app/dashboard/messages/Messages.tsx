"use client";

import { ScrollArea, Box, Flex, VStack, Text, Center } from "@chakra-ui/react";
import {
  BaseContainer,
  BaseIcon,
  FormTextInput,
  Icons,
} from "_components/custom";
import { Avatar } from "_components/ui/avatar";
import {
  ChatModule,
  RentalAgreementModule,
  UserModule,
} from "_store/state-management";
import { MODELS } from "_types/*";
import { Formik, FormikValues } from "formik";
import { useState } from "react";
import { formatCreatedAt } from "rise-core-frontend";

export const Messages = () => {
  const [selectedConv, setSelectedConv] = useState<{
    rentalAgreementId: string;
    conversationId: string;
    tenantName?: string;
    tenantImg?: string;
    propertyTitle?: string;
    tenantId: string;
  } | null>(null);

  const [search, setSearch] = useState("");

  const { data: user } = UserModule.getUserInfo({
    queryOptions: { enabled: false },
  });

  const { data: rentalAgreements } =
    RentalAgreementModule.getRentalAgreementListByAgencyQueries({
      queryOptions: { enabled: false },
    });

  const { data: getConversations, refetch: reloadConversation } =
    ChatModule.getConversationQueries({
      params: {
        userId: user?.propertyOwner?.id,
      },
      queryOptions: {
        enabled: !!user?.propertyOwner?.id,
      },
    });

  const { mutateAsync: createConv } = ChatModule.createConversationtMutation({
    mutationOptions: {
      onSuccess: async (data) => {
        setSelectedConv((prev) =>
          prev
            ? {
                ...prev,
                conversationId: data.id,
              }
            : null,
        );
        await reloadConversation();
      },
    },
  });

  const { mutateAsync: sendMessage } = ChatModule.sendMessageMutation({
    mutationOptions: {
      onSuccess: async () => {
        await reloadConversation();
      },
    },
  });

  const { mutateAsync: readMessage } = ChatModule.readMessageMutation({});

  // ✅ Récupère uniquement les messages de la conversation sélectionnée
  const extractMessage = () => {
    const conv = getConversations?.find(
      (c) => c.rentalAgreementId === selectedConv?.rentalAgreementId,
    );
    return conv?.messages ?? [];
  };

  const extractUser = (rentalAgreementId: string) => {
    const data = rentalAgreements?.find(
      (data) => data?.id === rentalAgreementId,
    );
    return { tenants: data?.tenant, property: data?.property };
  };

  const handleSelect = (
    conversation: MODELS.IConversationResponse,
    data: {
      tenants: { id: string; name: string; image: string } | undefined;
      property: { title: string } | undefined;
    },
  ) => {
    setSelectedConv({
      conversationId: conversation.id,
      rentalAgreementId: conversation.rentalAgreementId,
      tenantName: data?.tenants?.name,
      propertyTitle: data?.property?.title,
      tenantId: data?.tenants?.id!,
      tenantImg: data?.tenants?.image,
    });
  };

  const handleSend = async (values: FormikValues) => {
    if (!values?.message?.trim() || !selectedConv?.conversationId) return;

    await sendMessage({
      params: {
        conversationId: selectedConv.conversationId,
        userId: selectedConv?.tenantId,
      },
      payload: {
        message: values?.message,
      },
    });
  };

  // useEffect(() => {
  //   if (selectedConv?.conversationId) {
  //     readMessage({ params: selectedConv.conversationId });
  //   }
  // }, []);

  return (
    <BaseContainer
      title="Messages"
      description="Communiquez avec vos locataires"
      border={"none"}
    >
      <Formik
        initialValues={{ message: "" }}
        onSubmit={(values, actions) => {
          handleSend(values);
          actions.resetForm();
        }}
      >
        {({ handleSubmit }) => (
          <Flex
            overflow="hidden"
            width="full"
            mt="30px"
            flexDir={{ base: "column", sm: "row" }}
          >
            {/* LEFT PANEL - Locataires actifs */}
            <Flex
              flexDir="column"
              w={{ base: "full", sm: "33%" }}
              borderRight="1px solid"
              borderColor="border"
              p={3}
              minH={0}
            >
              <FormTextInput
                name="search"
                placeholder="Rechercher un locataire..."
                value={search}
                leftAccessory={<Icons.Search />}
                onChangeFunction={(e: any) => setSearch(e.target.value)}
              />

              <Flex flex={1} flexDir="column" overflowY="auto" mt={5}>
                {getConversations?.map((data) => {
                  const isActive =
                    selectedConv?.rentalAgreementId === data?.rentalAgreementId;
                  const { tenants, property } = extractUser(
                    data.rentalAgreementId,
                  );

                  return (
                    <Flex
                      key={data.id}
                      onClick={() => handleSelect(data, { tenants, property })}
                      align="center"
                      p={3}
                      gap={3}
                      cursor="pointer"
                      bgColor={isActive ? "primary.50" : "transparent"}
                      borderLeftWidth="3px"
                      borderLeftColor={isActive ? "primary.500" : "transparent"}
                      _hover={{ bgColor: "bg.subtle" }}
                    >
                      <Avatar
                        name={tenants?.name}
                        src={tenants?.image}
                        size="sm"
                      />
                      <VStack flex={1} align="stretch" gap={0}>
                        <Text fontWeight="medium" fontSize="sm">
                          {tenants?.name}
                        </Text>
                        <Text fontSize="xs" color="fg.muted">
                          {property?.title}
                        </Text>
                      </VStack>
                    </Flex>
                  );
                })}
              </Flex>
            </Flex>

            {/* RIGHT PANEL - Chat */}
            <Flex flex={1} flexDir="column" minH={0} mt={{ base: "30px" }}>
              {selectedConv ? (
                <>
                  {/* Header */}
                  <Flex
                    align="center"
                    p={4}
                    borderBottom="1px solid"
                    borderColor="border"
                  >
                    <Avatar
                      name={selectedConv.tenantName}
                      src={selectedConv?.tenantImg}
                    />
                    <Box ml={3}>
                      <Text fontWeight="medium" fontSize="sm">
                        {selectedConv.tenantName}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {selectedConv.propertyTitle}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Messages */}

                  <ScrollArea.Root
                    height={{ base: "30rem", sm: "15rem" }}
                    size="xs"
                  >
                    <ScrollArea.Viewport>
                      <ScrollArea.Content p={4}>
                        <VStack align="stretch">
                          {extractMessage().length === 0 ? (
                            <Center height={{ base: "30rem", sm: "15rem" }}>
                              <Text
                                textAlign="center"
                                color="fg.muted"
                                fontSize="sm"
                              >
                                Aucun message
                              </Text>
                            </Center>
                          ) : (
                            extractMessage().map((message) => {
                              const isMe =
                                message.senderId === selectedConv?.tenantId;

                              return (
                                <Flex
                                  key={message.id}
                                  justify={isMe ? "flex-end" : "flex-start"}
                                >
                                  <Box
                                    maxW="70%"
                                    rounded="2xl"
                                    roundedBottomRight={isMe ? "sm" : "2xl"}
                                    roundedBottomLeft={isMe ? "2xl" : "sm"}
                                    px={4}
                                    py={2.5}
                                    bgColor={isMe ? "primary.500" : "bg.muted"}
                                  >
                                    <Text
                                      color={isMe ? "white" : "fg"}
                                      fontSize="sm"
                                    >
                                      {message.content}
                                    </Text>
                                    <Text
                                      fontSize="xs"
                                      mt={1}
                                      color={
                                        isMe ? "whiteAlpha.700" : "fg.muted"
                                      }
                                    >
                                      {formatCreatedAt(message.createdAt)}
                                    </Text>
                                  </Box>
                                </Flex>
                              );
                            })
                          )}
                        </VStack>
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar>
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                  </ScrollArea.Root>

                  {/* Input */}
                  <Flex
                    align="center"
                    gap={3}
                    p={4}
                    borderTop="1px solid"
                    borderColor="border"
                  >
                    <FormTextInput
                      name="message"
                      placeholder="Écrire un message..."
                    />
                    <BaseIcon
                      boxSize={"40px"}
                      cursor={"pointer"}
                      onClick={() => handleSubmit()}
                    >
                      <Icons.Send />
                    </BaseIcon>
                  </Flex>
                </>
              ) : (
                <Flex flex={1} align="center" justify="center" color="fg.muted">
                  Sélectionnez un locataire pour démarrer la conversation
                </Flex>
              )}
            </Flex>
          </Flex>
        )}
      </Formik>
    </BaseContainer>
  );
};
