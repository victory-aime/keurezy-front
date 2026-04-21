import { createListCollection } from '@chakra-ui/react';
import { CONSTANTS } from '_types/*';

export const cityList = createListCollection({
  items:
    CONSTANTS.SENEGAL_CITIES.map((city) => ({
      label: city.label,
      value: city.value,
    })) || [],
});
