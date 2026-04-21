import { createListCollection } from '@chakra-ui/react';
import { CONSTANTS } from '_types/*';

const landStatusList = createListCollection({
  items: CONSTANTS.landStatus.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});
const landPaymentTypeList = createListCollection({
  items: CONSTANTS.landPaymentTypes.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

export { landStatusList, landPaymentTypeList };
