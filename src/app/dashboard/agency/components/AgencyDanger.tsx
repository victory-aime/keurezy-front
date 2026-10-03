import { Stack } from '@chakra-ui/react';
import { t } from 'i18next';
import { AgencyClosureControl } from './AgencyClosureControl';
import { Panel } from './Panel';

export const AgencyDanger = () => {
  return (
    <Panel
      title={t('PROFILE.DANGER_ZONE.TITLE')}
      description="Actions sensibles qui peuvent impacter définitivement votre agence. Merci de procéder avec prudence."
    >
      <Stack
        gap={3}
        p={4}
        rounded="7px"
        borderWidth="1px"
        borderColor="danger.border"
        bg="danger.subtle"
      >
        <AgencyClosureControl label={t('Fermer définitivement l’agence')} />
      </Stack>
    </Panel>
  );
};
