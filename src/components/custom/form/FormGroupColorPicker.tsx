import { ColorPicker } from "@chakra-ui/react";

export const FormGroupColorPicker = () => {
  return (
    <ColorPicker.Root alignItems="flex-start" size={"lg"}>
      <ColorPicker.HiddenInput />
      <ColorPicker.SwatchGroup>
        {swatches.map((item) => (
          <ColorPicker.SwatchTrigger
            key={item}
            value={item}
            borderWidth={1}
            p={2}
            borderRadius={"12px"}
            borderColor={item}
          >
            <ColorPicker.Swatch value={item}>
              <ColorPicker.SwatchIndicator boxSize="3" bg="white" />
            </ColorPicker.Swatch>
          </ColorPicker.SwatchTrigger>
        ))}
      </ColorPicker.SwatchGroup>
    </ColorPicker.Root>
  );
};

const swatches = [
  "#F56565",
  "#ED64A6",
  "#9F7AEA",
  "#6B46C1",
  "#4299E1",
  "#38B2AC",
  "#ECC94B",
  "#DD6B20",
];
