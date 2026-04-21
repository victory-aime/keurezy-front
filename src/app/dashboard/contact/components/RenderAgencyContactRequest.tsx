import { MODELS } from '_types/*';
import { AgencyDisplayContactList } from './AgencyDisplayContactList';
import { BaseText, Icons } from '_components/custom';
import { VariablesColors } from '_theme/variables';
import { VStack } from '@chakra-ui/react';

export const RenderAgencyContactRequestsList = ({
  list,
  isLoading,
  refetchAgencyContactList,
}: {
  list: MODELS.IAgencyRequestList[];
  isLoading?: boolean;
  refetchAgencyContactList?: () => void;
}) => {
  if (isLoading) {
    return (
      <AgencyDisplayContactList request={{} as MODELS.IAgencyRequestList} index={0} isLoading />
    );
  }

  if (list?.length === 0) {
    return (
      <VStack>
        <Icons.BellOff size={44} color={VariablesColors.grayScale} />
        <BaseText color={VariablesColors.grayScale}>
          C'est calme pour l'instant. Revenez plus tard.
        </BaseText>
      </VStack>
    );
  }

  return list?.map((request, i) => (
    <AgencyDisplayContactList
      key={request.id}
      request={request}
      index={i}
      refetchAgencyContactList={refetchAgencyContactList}
      isLast={i === list?.length - 1}
    />
  ));
};
