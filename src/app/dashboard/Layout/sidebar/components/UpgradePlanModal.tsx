import { BaseModal, ModalOpenProps } from '_components/custom';
import { VStack, Text, Box } from '@chakra-ui/react';
import { Icons } from '_components/custom';

export const UpgradePlanModal = ({ isOpen, onChange, callback, isLoading }: ModalOpenProps) => {
  return (
    <BaseModal
      title="Unlock this feature"
      isOpen={isOpen}
      onChange={onChange}
      size="md"
      onClick={callback}
      isLoading={isLoading}
      icon={<Icons.Lock />}
      buttonSaveTitle="Upgrade plan"
    >
      <VStack align="start" gap={4} py={2}>
        <Box>
          <Text fontSize="md" fontWeight="semibold" mb={1}>
            This feature is not available in your current plan
          </Text>

          <Text fontSize="sm" color="gray.500">
            Upgrade your subscription to unlock advanced features, improve productivity, and give
            your team full access to the platform.
          </Text>
        </Box>

        <Box
          w="full"
          p={3}
          borderRadius="md"
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontSize="sm" fontWeight="medium">
            🚀 What you get with upgrade:
          </Text>

          <VStack align="start" mt={2} gap={1}>
            <Text fontSize="sm" color="gray.600">
              • Access to all premium modules
            </Text>
            <Text fontSize="sm" color="gray.600">
              • Advanced team permissions
            </Text>
            <Text fontSize="sm" color="gray.600">
              • Higher usage limits
            </Text>
            <Text fontSize="sm" color="gray.600">
              • Priority support
            </Text>
          </VStack>
        </Box>
      </VStack>
    </BaseModal>
  );
};
