import { createListCollection } from "@chakra-ui/react";
import { CONSTANTS } from "_types/*";

const buildingStatusList = createListCollection({
  items: CONSTANTS.buildingStatus.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

const cityList = createListCollection({
  items:
    CONSTANTS.SENEGAL_CITIES.map((city) => ({
      label: city.label,
      value: city.value,
    })) || [],
});
export { buildingStatusList, cityList };
