"use client";
import { Box, Flex, Tabs, VStack } from "@chakra-ui/react";
import { TabsProps } from "./interface/tabs";
import { useState } from "react";
import { hexToRGB } from "_theme/colors";
import { BaseContainer } from "../container";
import { Icons } from "../icons";
import { NoDataAnimation } from "../data-table/NoDataAnimation";

export const BaseTabs = ({
  items,
  redirectLink,
  isMobile,
  title = "",
  description = "",
  withActionButtons = false,
  actionsButtonProps,
  ...rest
}: TabsProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <BaseContainer
      title={title}
      description={description}
      border={"none"}
      textAlign={rest.textAlign}
      withActionButtons={withActionButtons}
      actionsButtonProps={actionsButtonProps}
    >
      <Tabs.Root
        defaultValue={items[currentIndex]?.label}
        variant={"plain"}
        value={items[currentIndex]?.label}
        onValueChange={({ value }: { value: string }) => {
          const index = items?.findIndex(
            (item: { label: string }) => item?.label === value,
          );
          setCurrentIndex(index);
        }}
        {...rest}
      >
        <Tabs.List mt={5}>
          {items.map((item, index) => (
            <Tabs.Trigger
              color={currentIndex === index ? "primary.500" : "gray.400"}
              bgColor={currentIndex === index ? "white" : "none"}
              key={index}
              value={item.label}
              p={5}
              width={"fit-content"}
            >
              {item?.icon}
              {item.label}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator rounded="l2" bgColor={hexToRGB("primary", 0.1)} />
        </Tabs.List>
        {items?.map((item, index) => (
          <Tabs.Content
            key={index}
            value={item.label}
            mt={rest.mt ?? 5}
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            {item?.content ?? <NoDataAnimation />}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </BaseContainer>
  );
};
