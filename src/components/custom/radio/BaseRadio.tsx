import { HStack, RadioGroup } from '@chakra-ui/react';
import { IRadioProps } from './interface/radio';

export const BaseRadio = ({
  items,
  colorPalette,
  onValueChange,
  value,
  ...rest
}: IRadioProps & { value?: string }) => {
  return (
    <RadioGroup.Root
      colorPalette={colorPalette}
      value={value}
      onValueChange={(details: { value: string | null }) => {
        if (onValueChange && details.value !== null) {
          onValueChange(details);
        }
      }}
      {...rest}
    >
      <HStack gap="6" mb={4}>
        {items.map((item) => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </HStack>
    </RadioGroup.Root>
  );
};
