import { MODELS } from "_types/*";
import { RequestDisplay } from "./RequestDisplay";
import { BaseText, Icons } from "_components/custom";
import { VariablesColors } from "_theme/variables";
import { VStack } from "@chakra-ui/react";

export const RenderRequests = ({
  list,
  isLoading,
  refetchRequestList,
}: {
  list: MODELS.IAgencyRequestList[];
  isLoading?: boolean;
  refetchRequestList?: () => void;
}) => {
  if (isLoading) {
    return (
      <RequestDisplay
        request={{} as MODELS.IAgencyRequestList}
        index={0}
        isLoading
      />
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
    <RequestDisplay
      key={request.id}
      request={request}
      index={i}
      refetchRequestList={refetchRequestList}
    />
  ));
};
