import { createListCollection } from '@chakra-ui/react';
import { CONSTANTS, MODELS } from '_types/*';

const buildingStatusList = createListCollection({
  items: CONSTANTS.buildingStatus.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

const getLandsList = (allBuildings: { content: MODELS.LandResponseDto[] }) => {
  return createListCollection({
    items:
      allBuildings?.content?.map((city) => ({
        label: city.title,
        value: city.id,
      })) || [],
  });
};

export { buildingStatusList, getLandsList };
