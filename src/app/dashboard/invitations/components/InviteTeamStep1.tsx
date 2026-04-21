import { createListCollection, VStack } from '@chakra-ui/react';
import { FormSelect, FormTextInput } from '_components/custom';
import { MotionBox } from '_constants/motion';
import { CONSTANTS } from '_types/*';
import { useFormikContext } from 'formik';
import { FormCard } from '../../components/FormCard';
import { IInviteTeamUserInfo } from '../constants/team';

export const InviteStep1 = () => {
  const { setFieldValue } = useFormikContext<{
    account: IInviteTeamUserInfo;
  }>();

  const roleList = createListCollection({
    items:
      CONSTANTS.AGENCY_ROLE_LIST.map((city) => ({
        label: city.label,
        value: city.value,
      })) || [],
  });

  return (
    <MotionBox
      key="step1"
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <FormCard title="Informations du membre">
        <VStack gap={3} width={'full'} mt={5}>
          <FormTextInput
            required
            name="account.name"
            label={'Nom complet'}
            placeholder="Jean Dupont"
          />
          <FormTextInput
            required
            name="account.email"
            label={'Adresse e-mail'}
            type={'email'}
            placeholder="jean@entreprise.com"
          />

          <FormSelect
            name={'account.role'}
            label="Rôle"
            listItems={roleList}
            setFieldValue={setFieldValue}
          />
        </VStack>
      </FormCard>
    </MotionBox>
  );
};
