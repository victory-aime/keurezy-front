import { Stack, HStack, chakra } from '@chakra-ui/react';
import { BaseButton, Icons, NoDataFound } from '_components/custom';
import { Panel } from './Panel';

export const AgencyRegistration = ({
  documents,
  handleOpenDoc,
  getFileNameFromUrl,
}: {
  documents: string[];
  handleOpenDoc: (url: string) => void;
  getFileNameFromUrl: (url: string) => string | undefined;
}) => {
  return (
    <Panel
      title="Documents de l’inscription"
      description="Documents officiels joints à la création de l’agence, affichés à titre informatif."
    >
      {documents.length ? (
        <Stack gap={2}>
          {documents.map((doc) => (
            <BaseButton
              key={doc}
              variant="outline"
              colorType="neutral"
              justifyContent="space-between"
              width="full"
              onClick={() => handleOpenDoc(doc)}
            >
              <HStack minW={0}>
                <Icons.Paper aria-hidden />
                <chakra.span truncate>{getFileNameFromUrl(doc)}</chakra.span>
              </HStack>
              <Icons.View aria-hidden />
            </BaseButton>
          ))}
        </Stack>
      ) : (
        <NoDataFound title="Aucun document joint à l’inscription" />
      )}
    </Panel>
  );
};
