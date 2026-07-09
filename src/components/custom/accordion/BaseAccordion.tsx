'use client';

import { Flex, HStack, Icon } from '@chakra-ui/react';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '_components/ui/accordion';
import React, { FC, useState } from 'react';
import { BaseTag, BaseText, CustomSkeletonLoader } from '_components/custom';
import { NoDataAnimation } from '_components/custom/data-table/NoDataAnimation';
import { BaseAccordionProps } from './interface/accordion';
import { useThemeColors } from '_theme/useThemeColors';

export const BaseAccordion: FC<BaseAccordionProps> = ({
  items,
  activeBg = true,
  multipleOpen = false,
  isLoading,
  itemContentProps,
  ...rest
}) => {
  const { hexToRGB } = useThemeColors();
  const [openValues, setOpenValues] = useState<string[]>(items[0] ? [items[0].label] : []);

  return (
    <>
      {!items ? (
        <NoDataAnimation animationType={'folder'} />
      ) : (
        <AccordionRoot
          width={'full'}
          variant={'plain'}
          collapsible
          multiple={multipleOpen}
          value={openValues}
          onValueChange={(details) => {
            setOpenValues(details.value);
          }}
          {...rest}
        >
          {items.map((item, index) => {
            const isOpen = openValues.includes(item.label);
            return (
              <AccordionItem key={index} value={item.label} mt="3">
                <AccordionItemTrigger
                  bgColor={isOpen ? hexToRGB(500, 0.3) : 'none'}
                  borderColor={isOpen ? hexToRGB(500, 0.3) : 'none'}
                  borderWidth={1.5}
                  p="3"
                  borderRadius="7px"
                  cursor="pointer"
                >
                  {isLoading ? (
                    <CustomSkeletonLoader type="TEXT" numberOfLines={1} width="full" />
                  ) : (
                    <Flex width={'full'} justifyContent={'space-between'}>
                      <HStack>
                        {item.icon && (
                          <Icon fontSize="md" color="fg.subtle">
                            {item.icon}
                          </Icon>
                        )}
                        <BaseText>{item.label}</BaseText>
                      </HStack>
                      {item?.selectedLength! > 0 && (
                        <BaseTag color={'blue'} label={item?.selectedLength} />
                      )}
                    </Flex>
                  )}
                </AccordionItemTrigger>
                {isLoading ? (
                  <CustomSkeletonLoader type="DATA_TABLE" />
                ) : (
                  <AccordionItemContent
                    p="3"
                    mt="4"
                    //bgColor={activeBg ? hexToRGB(500,0.1) : "none"}
                    borderRadius="7px"
                    {...itemContentProps}
                  >
                    {item.content}
                  </AccordionItemContent>
                )}
              </AccordionItem>
            );
          })}
        </AccordionRoot>
      )}
    </>
  );
};
