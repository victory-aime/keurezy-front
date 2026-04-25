import { Flex, CheckboxCard, CheckboxCardRootProps } from '@chakra-ui/react';

interface BaseCheckBoxCardProps extends CheckboxCardRootProps {
  label?: string;
  description?: string;
}

export const BaseCheckBoxCard = ({
  label,
  description,
  children,
  ...rest
}: BaseCheckBoxCardProps) => {
  return (
    <CheckboxCard.Root
      {...rest}
      variant={'outline'}
      colorPalette={'teal'}
      cursor={'pointer'}
      justify={'center'}
    >
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control width={'full'} display={'block'}>
        <Flex alignItems={'center'} justifyContent={'space-between'} width={'full'}>
          {label && <CheckboxCard.Label> {label} </CheckboxCard.Label>}
          <CheckboxCard.Indicator />
        </Flex>
        <CheckboxCard.Content width={'full'} mt={4}>
          {children}
        </CheckboxCard.Content>
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
};
