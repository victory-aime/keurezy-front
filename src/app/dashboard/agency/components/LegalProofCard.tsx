'use client';

import { Box, chakra, Circle, Flex, HStack, Stack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import {
  BaseBadge,
  BaseButton,
  BaseIconButton,
  BaseModal,
  BaseText,
  Icons,
  ModalOpenProps,
  TextVariant,
} from '_components/custom';
import { AgencyModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { LEGAL_PROOFS, PROOF_ACCEPT, proofFileError, proofFileName } from '_utils/agency-legal';

type Proof = (typeof LEGAL_PROOFS)[number];

/** Apparition douce, coupée si l'utilisateur réduit les animations. */
const appear = {
  animationName: 'fade-in, slide-from-bottom',
  animationDuration: 'moderate',
  animationTimingFunction: 'ease-out',
  _motionReduce: { animation: 'none', transition: 'none' },
} as const;

/**
 * Pièce justificative d'une information légale : fournie (aperçu, remplacer, retirer) ou à
 * joindre (bouton ou glisser-déposer). L'owner l'envoie, le staff la consulte. Sur une agence
 * vérifiée, remplacer ou retirer la pièce retire la vérification : l'owner le confirme d'abord.
 */
export const LegalProofCard = ({
  proof,
  url,
  agencyId,
  isOwner,
  isVerified,
  onPreview,
  onSaved,
}: {
  proof: Proof;
  url: string | null | undefined;
  agencyId: string;
  isOwner: boolean;
  isVerified: boolean;
  onPreview: (url: string) => void;
  onSaved: () => void;
}) => {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  // Action en attente de confirmation (agence vérifiée) : un fichier, ou `null` pour retirer
  const [confirm, setConfirm] = useState<{ file: File | null } | null>(null);
  const { mutate, isPending, variables } = AgencyModule.legalProofMutation({
    mutationOptions: {
      onSuccess: () => {
        setConfirm(null);
        onSaved();
      },
    },
  });

  const send = (file: File | null) =>
    mutate({ payload: file ?? undefined, params: { agencyId, kind: proof.kind } });

  const request = (file: File | null) => (isVerified ? setConfirm({ file }) : send(file));

  const pick = (file: File | undefined) => {
    if (input.current) input.current.value = '';
    if (!file) return;
    const problem = proofFileError(file);
    setError(problem ?? '');
    if (!problem) request(file);
  };

  const canDrop = isOwner && !isPending;
  const dropHandlers = canDrop
    ? {
        onDragOver: (e: React.DragEvent) => {
          e.preventDefault();
          setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        },
      }
    : {};

  return (
    <Stack
      gap={3}
      p={4}
      rounded="7px"
      borderWidth="1px"
      borderStyle={url ? 'solid' : 'dashed'}
      borderColor={dragging ? 'primary.solid' : url ? 'success.border' : 'border.emphasized'}
      bg={dragging ? 'primary.subtle' : url ? 'bg' : 'bg.subtle'}
      transition="border-color 0.2s, background-color 0.2s"
      aria-busy={isPending}
      {...appear}
      {...dropHandlers}
    >
      <Flex gap={3} alignItems="flex-start">
        <Circle
          size="9"
          flexShrink={0}
          bg={url ? 'success.subtle' : 'warning.subtle'}
          color={url ? 'success.fg' : 'warning.fg'}
        >
          {url ? <Icons.Check aria-hidden /> : <Icons.Paper aria-hidden />}
        </Circle>
        <Stack gap={0} flex="1" minW={0}>
          <BaseText fontWeight="semibold">{proof.label}</BaseText>
          <BaseText variant={TextVariant.XS} color="fg.muted">
            Justifie : {proof.proves}
          </BaseText>
        </Stack>
        <BaseBadge
          size="sm"
          variant="subtle"
          color={url ? 'success' : 'warning'}
          label={url ? 'Fournie' : 'À joindre'}
          flexShrink={0}
        />
      </Flex>

      {url ? (
        // `key` : la ligne réapparaît en douceur quand la pièce est remplacée
        <HStack key={url} gap={2} {...appear}>
          <BaseButton
            variant="ghost"
            colorType="neutral"
            size="sm"
            flex="1"
            minW={0}
            justifyContent="flex-start"
            onClick={() => onPreview(url)}
          >
            <Icons.View aria-hidden />
            <chakra.span truncate>{proofFileName(url)}</chakra.span>
          </BaseButton>
          {isOwner && (
            <>
              <BaseIconButton
                label="Remplacer le document"
                colorType="primary"
                variant="outline"
                isLoading={isPending && !!variables?.payload}
                disabled={isPending}
                onClick={() => input.current?.click()}
              >
                <Icons.Refresh aria-hidden />
              </BaseIconButton>
              <BaseIconButton
                label="Retirer le document"
                colorType="danger"
                variant="outline"
                isLoading={isPending && !variables?.payload}
                disabled={isPending}
                onClick={() => request(null)}
              >
                <Icons.Trash aria-hidden />
              </BaseIconButton>
            </>
          )}
        </HStack>
      ) : isOwner ? (
        <Stack gap={1}>
          <BaseButton
            variant="outline"
            colorType="primary"
            size="sm"
            isLoading={isPending}
            disabled={isPending}
            onClick={() => input.current?.click()}
          >
            <Icons.Paper aria-hidden />
            Joindre le document
          </BaseButton>
          <BaseText variant={TextVariant.XS} color="fg.muted" textAlign="center">
            ou glissez-le ici · PDF, PNG ou JPEG, 5 Mo max.
          </BaseText>
        </Stack>
      ) : (
        <BaseText variant={TextVariant.S} color="fg.muted">
          Pas encore fourni par le propriétaire.
        </BaseText>
      )}

      {error && (
        <BaseText variant={TextVariant.XS} color="fg.error" role="alert">
          {error}
        </BaseText>
      )}
      {isOwner && (
        <chakra.input
          ref={input}
          type="file"
          accept={PROOF_ACCEPT.join(',')}
          display="none"
          aria-label={`${proof.label} : choisir un fichier`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => pick(e.target.files?.[0])}
        />
      )}
      <Box srOnly role="status" aria-live="polite">
        {isPending ? `Envoi : ${proof.label}…` : ''}
      </Box>

      <BaseModal
        isOpen={!!confirm}
        onChange={
          ((open: boolean) => !open && !isPending && setConfirm(null)) as ModalOpenProps['onChange']
        }
        title={confirm?.file ? 'Remplacer le document' : 'Retirer le document'}
        icon={<Icons.Warn />}
        iconBackgroundColor="warning.solid"
        size="md"
        buttonCancelTitle="Annuler"
        colorCancelButton="neutral"
        buttonSaveTitle={
          confirm?.file
            ? 'Remplacer et retirer la vérification'
            : 'Retirer et retirer la vérification'
        }
        colorSaveButton="danger"
        isLoading={isPending}
        onClick={() => confirm && send(confirm.file)}
      >
        <BaseText variant={TextVariant.S}>
          Votre agence perdra son badge « vérifiée » jusqu’à ce que Keurezy contrôle le nouveau
          document ({proof.label.toLowerCase()}).
        </BaseText>
      </BaseModal>
    </Stack>
  );
};

/** Les trois pièces, côte à côte sur grand écran. */
export const LegalProofsGrid = ({
  agency,
  isOwner,
  onPreview,
  onSaved,
}: {
  agency: MODELS.IAgency;
  isOwner: boolean;
  onPreview: (url: string) => void;
  onSaved: () => void;
}) => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(auto-fit, minmax(min(100%, 240px), 1fr))"
    gap={3}
  >
    {LEGAL_PROOFS.map((proof) => (
      <LegalProofCard
        key={proof.kind}
        proof={proof}
        url={agency[proof.field]}
        agencyId={agency.id}
        isOwner={isOwner}
        isVerified={!!agency.isVerified}
        onPreview={onPreview}
        onSaved={onSaved}
      />
    ))}
  </Box>
);
