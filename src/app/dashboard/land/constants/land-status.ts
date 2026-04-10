import { createListCollection } from "@chakra-ui/react";
import { CONSTANTS } from "_types/*";

const landStatusList = createListCollection({
  items: CONSTANTS.landStatus.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

export { landStatusList };
