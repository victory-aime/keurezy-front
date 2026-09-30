'use client';

import { Box, DownloadTrigger, Field, Input, SimpleGrid, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { BaseButton, BaseModal, BaseText, Icons } from '_components/custom';
import { UserModule } from '_store/state-management';
import { backupCodesRegenerateImpact } from '_utils/impact';
import { handleApiError } from '_utils/handleApiError';
import { authClient } from '../../../lib/auth-client';
import { ActionImpactDialog } from '../../components/ActionImpactDialog';

/** En dessous de ce nombre de codes restants, la section passe en alerte. */
const LOW_CODES = 2;

/**
 * Prévenir la perte d'accès quand la 2FA est active : codes de secours restants, régénération
 * (les anciens cessent de fonctionner) et suggestion d'une passkey de secours.
 */
export const TwoFactorBackupSection = ({
  hasPasskey,
  onAddPasskey,
}: {
  hasPasskey: boolean;
  onAddPasskey: () => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [newCodes, setNewCodes] = useState<string[] | null>(null);

  const { data, refetch } = UserModule.getBackupCodesRemaining({ queryOptions: {} });
  const remaining = data?.remaining ?? 0;
  const low = remaining <= LOW_CODES;

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPassword('');
  };

  const regenerate = async () => {
    setIsRegenerating(true);
    const { data: result, error } = await authClient.twoFactor.generateBackupCodes({ password });
    setIsRegenerating(false);
    if (error || !result) {
      handleApiError({
        status: error?.status ?? 400,
        message: error?.message ?? 'Mot de passe incorrect',
      });
      return;
    }
    closeConfirm();
    setNewCodes(result.backupCodes);
    await refetch();
  };

  return (
    <VStack alignItems="stretch" gap={3} width="full" mt={4}>
      <Box
        p={3}
        rounded="lg"
        borderLeftWidth="4px"
        borderColor={low ? 'orange.500' : 'green.500'}
        role="status"
      >
        <BaseText fontWeight="semibold">
          {remaining > 0
            ? `Il vous reste ${remaining} code${remaining > 1 ? 's' : ''} de secours`
            : 'Aucun code de secours disponible'}
        </BaseText>
        <BaseText fontSize="sm" color="fg.muted">
          {low
            ? 'Régénérez vos codes : sans eux, perdre votre téléphone bloquerait votre compte.'
            : 'Chaque code permet une connexion si votre téléphone n’est pas disponible.'}
        </BaseText>
        <BaseButton
          mt={3}
          size="sm"
          variant="outline"
          colorType={low ? 'warning' : 'primary'}
          leftIcon={<Icons.Refresh />}
          onClick={() => setConfirmOpen(true)}
        >
          Régénérer les codes de secours
        </BaseButton>
      </Box>

      {!hasPasskey && (
        <Box p={3} rounded="lg" borderLeftWidth="4px" borderColor="blue.500">
          <BaseText fontWeight="semibold">Ajoutez une passkey de secours</BaseText>
          <BaseText fontSize="sm" color="fg.muted">
            Empreinte ou Face ID de cet appareil : un second moyen de vous connecter si vous perdez
            votre téléphone.
          </BaseText>
          <BaseButton mt={3} size="sm" variant="outline" onClick={onAddPasskey}>
            Ajouter une passkey
          </BaseButton>
        </Box>
      )}

      <ActionImpactDialog
        isOpen={confirmOpen}
        onChange={(open: boolean) => !open && closeConfirm()}
        title="Régénérer les codes de secours"
        summary={backupCodesRegenerateImpact(remaining)}
        isSubmitting={isRegenerating}
        confirmTitle="Régénérer"
        confirmColor="primary"
        confirmDisabled={!password}
        onConfirm={regenerate}
      >
        <Field.Root width="full">
          <Field.Label>Confirmez avec votre mot de passe</Field.Label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
        </Field.Root>
      </ActionImpactDialog>

      <BaseModal
        isOpen={!!newCodes}
        onChange={() => setNewCodes(null)}
        title="Vos nouveaux codes de secours"
        ignoreFooter
      >
        <VStack gap={4} alignItems="stretch">
          <BaseText>
            Téléchargez-les maintenant : ils ne seront plus affichés. Chaque code ne sert qu’une
            fois.
          </BaseText>
          <SimpleGrid columns={2} gap={2} fontFamily="mono">
            {newCodes?.map((code) => (
              <BaseText key={code} p={2} rounded="md" borderWidth={1} textAlign="center">
                {code}
              </BaseText>
            ))}
          </SimpleGrid>
          <DownloadTrigger
            data={newCodes?.join('\n') ?? ''}
            fileName="keurezy-codes-de-secours.txt"
            mimeType="text/plain"
            asChild
          >
            <BaseButton leftIcon={<Icons.Download />}>Télécharger les codes</BaseButton>
          </DownloadTrigger>
        </VStack>
      </BaseModal>
    </VStack>
  );
};
