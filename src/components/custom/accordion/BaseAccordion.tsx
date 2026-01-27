"use client";

import { Icon } from "@chakra-ui/react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "_components/ui/accordion";
import React, { FC, useState } from "react";
import {
  AccordionProps,
  BaseText,
  CustomSkeletonLoader,
} from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";

export const BaseAccordion: FC<AccordionProps> = ({
  items,
  activeBg = true,
  multipleOpen = false,
  isLoading,
  ...rest
}) => {
  const [openValues, setOpenValues] = useState<string[]>(
    items[0] ? [items[0].label] : [],
  );

  return (
    <>
      {!items ? (
        <NoDataAnimation animationType={"folder"} />
      ) : (
        <AccordionRoot
          width={"full"}
          variant={"plain"}
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
                  bgColor={
                    isOpen ? hexToRGB("success", 0.3) : hexToRGB("lighter", 0.5)
                  }
                  borderColor={
                    isOpen ? hexToRGB("success", 0.3) : hexToRGB("lighter", 0.5)
                  }
                  borderWidth={1.5}
                  p="3"
                  borderRadius="7px"
                  cursor="pointer"
                >
                  {isLoading ? (
                    <CustomSkeletonLoader
                      type="TEXT"
                      numberOfLines={1}
                      width="full"
                    />
                  ) : (
                    <>
                      {item.icon && (
                        <Icon fontSize="lg" color="fg.subtle">
                          {item.icon}
                        </Icon>
                      )}
                      <BaseText>{item.label}</BaseText>
                    </>
                  )}
                </AccordionItemTrigger>
                {isLoading ? (
                  <CustomSkeletonLoader type="DATA_TABLE" />
                ) : (
                  <AccordionItemContent
                    p="3"
                    mt="4"
                    bgColor={activeBg ? hexToRGB("lighter", 0.1) : "none"}
                    borderRadius="7px"
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
