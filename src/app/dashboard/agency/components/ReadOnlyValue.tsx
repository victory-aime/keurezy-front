import { Stack } from '@chakra-ui/react';
import { BaseText, TextVariant } from '_components/custom';

/** Lecture seule (staff) : libellé et valeur. */
export const ReadOnlyValue = ({ label, value }: { label: string; value?: string | null }) => {
  return (
    <Stack gap={0}>
      <BaseText variant={TextVariant.XS} color="fg.muted">
        {label}
      </BaseText>
      <BaseText variant={TextVariant.S}>{value || 'Non renseigné'}</BaseText>
    </Stack>
  );
};
