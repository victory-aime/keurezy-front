import { createListCollection } from '@chakra-ui/react';
import { CONSTANTS, MODELS } from '_types/*';

const propertyTypes = createListCollection({
  items: CONSTANTS.propertyTypes.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

const propertyStatusList = createListCollection({
  items: CONSTANTS.propertyStatus.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

const getBuildingsList = (allBuildings: { content: MODELS.IBuilding[] }) => {
  return createListCollection({
    items:
      allBuildings?.content?.map((city) => ({
        label: city.name,
        value: city.id,
      })) || [],
  });
};

export { propertyStatusList, propertyTypes, getBuildingsList };
