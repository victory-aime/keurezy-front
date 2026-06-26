'use client';

import { Input, Flex, Text, Box, InputGroup } from '@chakra-ui/react';
import { ChatModule, LeadsModule, TeamModule } from '_store/state-management';
import { useUserContext } from '_context/user-context';
import { useDeferredValue, useState } from 'react';
import { BaseModal, BaseRadio, BaseTag, Icons, Loader } from '_components/custom';
import { Avatar } from '_components/ui/avatar';
import { MODELS, ENUM } from '_types/*';
import { ConversationLoad } from './ConversationLoad';

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string) => void;
}

type ConversationMode = 'team' | 'lead';

export function NewConversationModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewConversationModalProps) {
  const { user } = useUserContext();
  const [mode, setMode] = useState<ConversationMode>('team');
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const agencyId = user?.agencyId;
  const userId = user?.ownerId || user?.staffId;

  const { data: users, isLoading: isLoadingUsers } = TeamModule.getAllTeamByAgency({
    params: { agencyId: agencyId!, userId: userId! },
    queryOptions: {
      enabled: mode === 'team' && !!agencyId && !!userId,
    },
  });

  const { data: leads, isLoading: isLoadingLeads } = LeadsModule.agencyLeadsListQueries({
    params: { agencyId: agencyId!, userId: userId! },
    queryOptions: { enabled: mode === 'lead' && !!agencyId && !!userId },
  });

  const { mutateAsync: createConversation, isPending: isCreatingDirect } =
    ChatModule.createConversationMutation({
      mutationOptions: {
        onSuccess: (data) => {
          onConversationCreated(data.id);
          resetAndClose();
        },
      },
    });

  const handleCreateConversation = async (
    mode: ConversationMode,
    data: MODELS.ICreateConversation,
  ) => {
    if (mode === 'team') {
      await createConversation({
        payload: { recipientId: data.recipientId },
        params: { userId: user?.id },
      });
    } else {
      await createConversation({ payload: { leadId: data?.leadId }, params: { userId: user?.id } });
    }
  };

  const resetAndClose = () => {
    setQuery('');
    setMode('team');
    onClose();
  };

  const activeUsers = users?.filter(
    (user: MODELS.ITeam) => user.status === ENUM.COMMON.Status.ACTIVE,
  );
  const filteredUsers = activeUsers?.filter((u: MODELS.ITeam) =>
    deferredQuery ? u.name?.toLowerCase().includes(deferredQuery.toLowerCase()) : true,
  );

  const filteredLeads = leads?.filter((l: MODELS.ILeadsAgency) =>
    deferredQuery
      ? l.client?.user?.name?.toLowerCase().includes(deferredQuery.toLowerCase()) ||
        l.property?.title?.toLowerCase().includes(deferredQuery.toLowerCase())
      : true,
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onChange={resetAndClose}
      title={'Nouvelle conversation'}
      icon={<Icons.Chat />}
      description={'Choisir la personne avec qui discuter'}
      ignoreFooter
    >
      <Box px={4} pt={3} pb={2}>
        <BaseRadio
          value={mode}
          items={[
            {
              label: "Membre de l'équipe",
              value: 'team',
            },
            {
              label: 'Demande Client',
              value: 'lead',
            },
          ]}
          onValueChange={(e) => {
            setMode(e.value as ConversationMode);
            setQuery('');
          }}
        />
      </Box>

      {/* Recherche */}
      <InputGroup startElement={<Icons.Search />} mb={4}>
        <Input
          overflow={'hidden'}
          placeholder={mode === 'team' ? 'Rechercher un membre…' : 'Rechercher une demande…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          _focus={{ boxShadow: 'none', borderColor: 'purple.focusRing' }}
          fontSize="sm"
          borderRadius={'12px'}
          border={'1px solid'}
          borderColor={'inherit'}
          _placeholder={{ color: 'gray.400' }}
          variant={'outline'}
          disabled={isLoadingLeads || isLoadingUsers}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
        />
      </InputGroup>

      <Box maxH="3xl" overflowY="auto">
        {mode === 'team' && (
          <>
            {isLoadingUsers && <ConversationLoad itemLoadLength={5} />}

            {!isLoadingUsers && !filteredUsers?.length && (
              <Text fontSize="sm" color="fg.muted" textAlign="center" py={8}>
                Aucun résultat
              </Text>
            )}

            {!isLoadingUsers && !isCreatingDirect ? (
              filteredUsers?.map((u: MODELS.ITeam) => (
                <Flex
                  key={u.id}
                  as="button"
                  onClick={() => handleCreateConversation(mode, { recipientId: u.userId })}
                  w="full"
                  px={4}
                  py={2.5}
                  gap={3}
                  align="center"
                  _hover={{ bg: 'bg.subtle' }}
                  transition="background 0.15s"
                >
                  <Avatar name={u.name} />
                  <Box textAlign="left">
                    <Text fontSize="sm" fontWeight="500">
                      {u.name}
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      {u.email}
                    </Text>
                  </Box>
                </Flex>
              ))
            ) : (
              <Loader loader showText text={'Connection en cours ....'} />
            )}
          </>
        )}

        {mode === 'lead' && (
          <>
            {isLoadingLeads && <ConversationLoad itemLoadLength={5} />}

            {!isLoadingLeads && !filteredLeads?.length && (
              <Text fontSize="sm" color="fg.muted" textAlign="center" py={8}>
                Aucune demande en attente
              </Text>
            )}
            {!isLoadingLeads && !isCreatingDirect ? (
              filteredLeads?.map((lead: MODELS.ILeadsAgency) => (
                <Flex
                  key={lead.id}
                  as="button"
                  onClick={() => handleCreateConversation(mode, { leadId: lead.id })}
                  w="full"
                  px={4}
                  py={2.5}
                  gap={3}
                  align="center"
                  _hover={{ bg: 'bg.subtle' }}
                  transition="background 0.15s"
                >
                  <Avatar size="sm" name={lead.client?.user?.name} />
                  <Box textAlign="left" flex={1} minW={0}>
                    <Text fontSize="sm" fontWeight="500">
                      {lead.client?.user?.name}
                    </Text>
                    <Text fontSize="xs" color="fg.muted" truncate>
                      {lead.property?.title}
                    </Text>
                  </Box>
                  {!lead.assignedToId && <BaseTag label={'Non assignée'} />}
                </Flex>
              ))
            ) : (
              <Loader loader showText text={'Connection en cours ....'} />
            )}
          </>
        )}
      </Box>
    </BaseModal>
  );
}
