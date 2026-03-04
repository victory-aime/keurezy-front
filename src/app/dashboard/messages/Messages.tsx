import {
  Input,
  ScrollArea,
  Badge,
  Box,
  Button,
  Flex,
  VStack,
  InputGroup,
  Span,
  Text,
} from "@chakra-ui/react";
import { FormTextInput, Icons } from "_components/custom";
import { Avatar } from "_components/ui/avatar";
import { Formik } from "formik";
import { useState } from "react";

const conversations = [
  {
    id: "1",
    name: "Sophie Martin",
    avatar: "SM",
    lastMessage: "Bonjour, j'ai un souci avec le chauffe-eau...",
    time: "10:32",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Lucas Bernard",
    avatar: "LB",
    lastMessage: "Merci pour la réparation rapide !",
    time: "Hier",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Emma Petit",
    avatar: "EP",
    lastMessage: "Est-ce que je peux renouveler mon bail ?",
    time: "Hier",
    unread: 1,
    online: true,
  },
  {
    id: "4",
    name: "Thomas Durand",
    avatar: "TD",
    lastMessage: "Le paiement sera effectué demain.",
    time: "Lun",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Camille Roux",
    avatar: "CR",
    lastMessage: "Je souhaite signaler un problème de plomberie.",
    time: "Dim",
    unread: 0,
    online: false,
  },
];

const messages = [
  {
    id: "1",
    sender: "them",
    text: "Bonjour, j'ai un souci avec le chauffe-eau dans la salle de bain.",
    time: "10:30",
  },
  {
    id: "2",
    sender: "them",
    text: "Il ne chauffe plus depuis hier soir.",
    time: "10:31",
  },
  {
    id: "3",
    sender: "me",
    text: "Bonjour Sophie, merci de m'avoir prévenu. Je vais contacter un plombier dès aujourd'hui.",
    time: "10:35",
  },
  {
    id: "4",
    sender: "them",
    text: "Merci beaucoup ! C'est urgent car nous n'avons pas d'eau chaude.",
    time: "10:36",
  },
  {
    id: "5",
    sender: "me",
    text: "Je comprends, je fais le nécessaire dans l'heure. Vous recevrez un SMS avec le créneau d'intervention.",
    time: "10:38",
  },
];

export const DashboardMessages = () => {
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Formik initialValues={{ search: "" }} onSubmit={() => {}}>
      {({ values }) => (
        <Flex overflow="hidden" width="full" mt="30px">
          {/* Conversation List */}
          <Flex
            flexDir="column"
            w={{ base: "full", sm: "33%" }}
            borderRight="1px solid"
            borderColor="border"
            p={3}
            minH={0}
          >
            {/* Search */}

            <FormTextInput
              name="search"
              placeholder="Rechercher..."
              value={search}
              leftAccessory={<Icons.Search />}
              onChangeFunction={(e: React.ChangeEvent<any, Element>) =>
                setSearch(e?.target?.value)
              }
            />

            {/* List */}
            <Flex flex={1} flexDir="column" overflowY="auto" mt={5}>
              {filteredConvs.map((c) => (
                <Flex
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  w="full"
                  align="center"
                  p={3}
                  gap={3}
                  cursor="pointer"
                  bgColor={
                    selectedConv?.id === c.id ? "primary.50" : "transparent"
                  }
                  borderLeftWidth="3px"
                  borderLeftStyle="solid"
                  borderLeftColor={
                    selectedConv?.id === c.id ? "primary.500" : "transparent"
                  }
                  _hover={{ bgColor: "bg.subtle" }}
                  transition="all 0.15s"
                >
                  <Box position="relative" flexShrink={0}>
                    <Avatar name={c.avatar} size="sm" />
                    {c.online && (
                      <Span
                        position="absolute"
                        bottom={0}
                        right={0}
                        h="3"
                        w="3"
                        rounded="full"
                        bgColor="tertiary.500"
                        border="2px solid"
                        borderColor="bg"
                      />
                    )}
                  </Box>

                  <VStack flex={1} minW={0} align="stretch" gap={0.5}>
                    <Flex justify="space-between">
                      <Text fontWeight="medium" fontSize="sm" truncate>
                        {c.name}
                      </Text>
                      <Text fontSize="10px" color="fg.muted" ml={2}>
                        {c.time}
                      </Text>
                    </Flex>

                    <Text fontSize="xs" color="fg.muted" truncate>
                      {c.lastMessage}
                    </Text>
                  </VStack>

                  {c.unread > 0 && <Badge flexShrink={0}>{c.unread}</Badge>}
                </Flex>
              ))}
            </Flex>
          </Flex>

          {/* Chat Area */}
          <Flex
            flex={1}
            flexDir="column"
            display={{ base: "none", sm: "flex" }}
            minH={0}
          >
            {/* Header */}
            <Flex
              align="center"
              p={4}
              borderBottom="1px solid"
              borderColor="border"
            >
              <Flex align="center" gap={3}>
                <Avatar name={selectedConv?.avatar} />
                <Box>
                  <Text fontWeight="medium" fontSize="sm">
                    {selectedConv?.name}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">
                    {selectedConv?.online ? "En ligne" : "Hors ligne"}
                  </Text>
                </Box>
              </Flex>
            </Flex>

            {/* Messages */}
            <ScrollArea.Root flex="1" size="xs">
              <ScrollArea.Viewport>
                <ScrollArea.Content p={4}>
                  <VStack align="stretch" gap={4}>
                    {messages.map((m) => (
                      <Flex
                        key={m.id}
                        justify={m.sender === "me" ? "flex-end" : "flex-start"}
                      >
                        <Box
                          maxW="70%"
                          rounded="2xl"
                          roundedBottomRight={m.sender === "me" ? "sm" : "2xl"}
                          roundedBottomLeft={m.sender === "them" ? "sm" : "2xl"}
                          px={4}
                          py={2.5}
                          bgColor={
                            m.sender === "me" ? "primary.500" : "bg.muted"
                          }
                        >
                          <Text
                            color={m.sender === "me" ? "white" : "fg"}
                            fontSize="sm"
                          >
                            {m.text}
                          </Text>
                          <Text
                            color={
                              m.sender === "me" ? "whiteAlpha.700" : "fg.muted"
                            }
                            fontSize="xs"
                            mt={0.5}
                          >
                            {m.time}
                          </Text>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar>
                <ScrollArea.Thumb />
              </ScrollArea.Scrollbar>
              <ScrollArea.Corner />
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setNewMessage("")}
              />
              <Button
                flexShrink={0}
                bgColor="primary.500"
                _hover={{ bgColor: "primary.600" }}
              >
                <Icons.Send />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Formik>
  );
};
