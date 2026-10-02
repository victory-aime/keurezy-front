'use client';

import { Box, chakra, Flex, HStack, Image, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { BaseButton, BaseText, Icons, TextVariant } from '_components/custom';
import { AgencyModule } from '_store/state-management';

const MAX_BYTES = 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg'];

/**
 * Cachet ou signature scanné de l'agence, imprimé par les modèles réglés sur « Cachet scanné ».
 * Alternative sans scan : le « Cachet généré », choisi dans l'éditeur de modèle.
 * Envoi et retrait réservés à l'owner ; le backend revérifie le format et la taille.
 */
export const StampSection = ({
  agencyId,
  stampUrl,
  isOwner,
  onChanged,
}: {
  agencyId: string;
  stampUrl: string | null;
  isOwner: boolean;
  onChanged: () => void;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState('');
  const { mutate, isPending } = AgencyModule.invoiceStampMutation({
    mutationOptions: { onSuccess: onChanged },
  });

  const pick = (file: File | undefined) => {
    if (input.current) input.current.value = '';
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) return setFileError('Image PNG ou JPEG uniquement.');
    if (file.size > MAX_BYTES) return setFileError('Image de 1 Mo au plus.');
    setFileError('');
    mutate({ payload: file, params: { agencyId } });
  };

  return (
    <Stack gap={4} p={5} rounded="7px" borderWidth="1px" borderColor="border">
      <Stack gap={0}>
        <BaseText fontWeight="semibold">Cachet et signature</BaseText>
        <BaseText variant={TextVariant.S} color="fg.muted">
          Imprimé dans la zone « Signature et cachet » des modèles réglés sur « Cachet scanné ».
        </BaseText>
      </Stack>

      <Flex gap={5} direction={{ base: 'column', sm: 'row' }} alignItems={{ sm: 'center' }}>
        <Flex
          width="200px"
          height="90px"
          flexShrink={0}
          rounded="7px"
          borderWidth="1px"
          borderStyle={stampUrl ? 'solid' : 'dashed'}
          borderColor="border.emphasized"
          alignItems="center"
          justifyContent="center"
          p={2}
        >
          {stampUrl ? (
            <Image
              src={stampUrl}
              alt="Cachet de l’agence"
              maxH="full"
              maxW="full"
              objectFit="contain"
            />
          ) : (
            <BaseText variant={TextVariant.XS} color="fg.muted" textAlign="center">
              Aucun cachet
            </BaseText>
          )}
        </Flex>

        <Stack gap={2} minW={0}>
          <BaseText variant={TextVariant.S}>
            Scannez ou photographiez votre cachet signé sur fond blanc. PNG à fond transparent de
            préférence, ou JPEG ; 1 Mo au plus.
          </BaseText>
          <BaseText variant={TextVariant.XS} color="fg.muted">
            Pas de scanner ? Choisissez « Cachet généré » à l’étape Contenu d’un modèle : il reprend
            votre raison sociale, adresse, NINEA et RCCM.
          </BaseText>
          {fileError && (
            <BaseText variant={TextVariant.XS} color="fg.error" role="alert">
              {fileError}
            </BaseText>
          )}
          {isOwner && (
            <HStack gap={2} wrap="wrap">
              <chakra.input
                ref={input}
                type="file"
                accept={ACCEPTED.join(',')}
                display="none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => pick(e.target.files?.[0])}
              />
              <BaseButton
                mt={1}
                variant="outline"
                colorType="primary"
                isLoading={isPending}
                disabled={isPending}
                onClick={() => input.current?.click()}
              >
                <Icons.LuFileImage aria-hidden />
                {stampUrl ? 'Remplacer l’image' : 'Téléverser une image'}
              </BaseButton>
              {stampUrl && (
                <BaseButton
                  mt={1}
                  colorType="danger"
                  variant="outline"
                  isLoading={isPending}
                  disabled={isPending}
                  onClick={() => mutate({ payload: undefined, params: { agencyId } })}
                >
                  Retirer
                </BaseButton>
              )}
            </HStack>
          )}
        </Stack>
      </Flex>
      <Box srOnly role="status" aria-live="polite">
        {isPending ? 'Envoi du cachet…' : ''}
      </Box>
    </Stack>
  );
};
