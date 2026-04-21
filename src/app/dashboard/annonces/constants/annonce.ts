import { createListCollection } from '@chakra-ui/react';
import { CONSTANTS, MODELS } from '_types/*';

const annonceStatusList = createListCollection({
  items: CONSTANTS.annonceStatus.map((type) => ({
    label: type.label,
    value: type.value,
  })),
});

const propertiesList = (list: MODELS.IPropertyResponse[]) => {
  if (!list) return;
  return createListCollection({
    items: list?.map((iten) => ({
      label: iten.title,
      value: iten.id,
    })),
  });
};

export { annonceStatusList, propertiesList };
