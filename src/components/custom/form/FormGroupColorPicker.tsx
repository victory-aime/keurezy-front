import { ColorPicker, ColorPickerRootProps, ColorPickerSwatchTriggerProps } from '@chakra-ui/react';
import { Icons } from '../icons';

type FormGroupColorPickerProps = ColorPickerRootProps & {
  itemTriggerProps?: ColorPickerSwatchTriggerProps;
};
export const FormGroupColorPicker = ({
  value,
  onValueChange,
  ...rest
}: FormGroupColorPickerProps) => {
  const selectedColor = value?.toString('hex');

  return (
    <ColorPicker.Root {...rest} onValueChange={onValueChange} size={'lg'}>
      <ColorPicker.HiddenInput />
      <ColorPicker.SwatchGroup>
        {swatches.map((item) => {
          const isSelected = item.toLowerCase() === selectedColor?.toLowerCase();

          return (
            <ColorPicker.SwatchTrigger
              key={item}
              value={item}
              cursor={'pointer'}
              p={2}
              borderRadius="12px"
              borderColor={item}
              borderWidth={isSelected ? 1 : 0}
            >
              <ColorPicker.Swatch value={item}>
                <ColorPicker.SwatchIndicator asChild>
                  <Icons.Check size={45} />
                </ColorPicker.SwatchIndicator>
              </ColorPicker.Swatch>
            </ColorPicker.SwatchTrigger>
          );
        })}
      </ColorPicker.SwatchGroup>
    </ColorPicker.Root>
  );
};

const swatches = [
  '#F56565',
  '#ED64A6',
  '#9F7AEA',
  '#6B46C1',
  '#4299E1',
  '#38B2AC',
  '#ECC94B',
  '#DD6B20',
];
