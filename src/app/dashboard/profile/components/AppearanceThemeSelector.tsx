import { Box, Flex, VStack } from '@chakra-ui/react';
import { ColorMode } from '_components/ui/color-mode';
import { useThemeColors } from '_theme/useThemeColors';
import { useState } from 'react';
import { AutoPreview, DarkPreview, LightPreview } from './Mockup';
import { VariablesColors } from '_theme/variables';

const MODES = [
  { mode: 'light', label: 'Clair', Preview: LightPreview },
  { mode: 'dark', label: 'Sombre', Preview: DarkPreview },
  { mode: 'system', label: 'Auto', Preview: AutoPreview },
];

export const AppearanceThemeSelector = ({
  themeColor = VariablesColors.primary,
  initialMode = 'dark',
  onChange,
}: {
  themeColor?: string;
  initialMode: ColorMode;
  onChange: (mode: ColorMode) => void;
}) => {
  const [selected, setSelected] = useState(initialMode);
  const { hexToRGB } = useThemeColors();

  const handleSelect = (mode: ColorMode) => {
    setSelected(mode);
    onChange?.(mode);
  };

  return (
    <Flex gap={4}>
      {MODES.map(({ mode, label, Preview }) => {
        const isSelected = selected === mode;
        return (
          <VStack
            as="button"
            key={mode}
            onClick={() => handleSelect(mode as ColorMode)}
            gap={10}
            all={'unset'}
            cursor={'pointer'}
          >
            {/* Card frame */}
            <Box
              overflow={'hidden'}
              width={'100px'}
              height={'72px'}
              borderRadius={10}
              padding={1}
              border={isSelected ? `2px solid ${themeColor}` : '2px solid rgba(63,63,70,0.4)'}
              boxShadow={isSelected ? `0 0 0 3px ${hexToRGB(500, 0.18)}` : 'none'}
              background={mode === 'dark' || mode === 'system' ? '#27272a' : '#E8E9EE'}
              transition={'border-color 0.2s, box-shadow 0.2s'}
            >
              <Preview color={themeColor} />
            </Box>

            {/* Label */}
            <span
              style={{
                fontSize: 12,
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? themeColor : 'rgba(161,161,170,1)',
                transition: 'color 0.2s, font-weight 0.2s',
              }}
            >
              {label}
            </span>
          </VStack>
        );
      })}
    </Flex>
  );
};
