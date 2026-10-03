'use client';
import { Badge, Flex, Tabs, useBreakpointValue } from '@chakra-ui/react';
import { TabsProps } from './interface/tabs';
import { useState } from 'react';
import { BaseContainer } from '../container';
import { NoDataAnimation } from '../data-table/NoDataAnimation';
import { useThemeColors } from '_theme/useThemeColors';
import { BaseBadge, BaseText } from '_components/custom';

export const BaseTabs = ({
  items,
  title = '',
  description = '',
  withActionButtons = false,
  actionsButtonProps,
  ...rest
}: TabsProps) => {
  const { hexToRGB } = useThemeColors();
  const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
    base: 'horizontal',
    sm: 'vertical',
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <BaseContainer
      title={title}
      description={description}
      border={'none'}
      textAlign={rest.textAlign}
      withActionButtons={withActionButtons}
      actionsButtonProps={actionsButtonProps}
    >
      <Tabs.Root
        defaultValue={items[currentIndex]?.label}
        variant={'enclosed'}
        value={items[currentIndex]?.label}
        orientation={orientation}
        onValueChange={({ value }: { value: string }) => {
          const index = items?.findIndex((item: { label: string }) => item?.label === value);
          setCurrentIndex(index);
        }}
        {...rest}
      >
        <Tabs.List mt={{ base: 0, sm: 5 }}>
          {items.map((item, index) => (
            <Flex key={index}>
              <Tabs.Trigger
                color={currentIndex === index ? 'primary.500' : 'gray.400'}
                key={index}
                value={item.label}
                width={'full'}
                asChild
              >
                <Flex alignItems={'center'}>
                  {item.icon}
                  <BaseText>{item.label}</BaseText>
                  {item.totalItems && (
                    <BaseBadge
                      ml={1}
                      variant="subtle"
                      px={2}
                      py={1}
                      label={item.totalItemsLabelTitle ?? `${item.totalItems} éléments`}
                      color={item.totalItemsLabelColor ?? 'primary'}
                    />
                  )}
                </Flex>
              </Tabs.Trigger>
            </Flex>
          ))}
          <Tabs.Indicator rounded="sm" bgColor={hexToRGB(500, 0.2)} />
        </Tabs.List>
        {items?.map((item, index) => (
          <Tabs.Content
            key={index}
            value={item.label}
            mt={{ base: rest.mt ?? 2, sm: rest.mt ?? 4 }}
            width={'full'}
            _open={{
              animationName: 'fade-in, scale-in',
              animationDuration: '300ms',
            }}
            _closed={{
              animationName: 'fade-out, scale-out',
              animationDuration: '120ms',
            }}
          >
            {item?.content ?? <NoDataAnimation />}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </BaseContainer>
  );
};
