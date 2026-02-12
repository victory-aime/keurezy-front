"use client";
import { Box, Flex, Tabs, VStack } from "@chakra-ui/react";
import { TabsProps } from "./interface/tabs";
import { useState } from "react";
import { hexToRGB } from "_theme/colors";
import { BaseContainer } from "../container";

export const BaseTabs = ({
  items,
  redirectLink,
  isMobile,
  title = "",
  description = "",
  ...rest
}: TabsProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <BaseContainer
      title={title}
      description={description}
      border={"none"}
      textAlign={rest.textAlign}
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
        <Flex
          width={"full"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={{ base: "column", md: "row" }}
          overflowX={"auto"}
          gap={4}
        >
          <VStack
            alignItems={rest.alignItems ?? "flex-start"}
            gap={4}
            width={"full"}
          >
            <Tabs.List width={"full"}>
              {items.map((item, index) => (
                <Tabs.Trigger
                  color={
                    currentIndex === index ? "primary.500" : "secondary.400"
                  }
                  key={index}
                  value={item.label}
                  p={5}
                  width={"full"}
                >
                  {item?.icon}
                  {item.label}
                </Tabs.Trigger>
              ))}
              <Tabs.Indicator rounded="l2" bgColor={hexToRGB("primary", 0.2)} />
            </Tabs.List>
          </VStack>
        </Flex>
        <Box mt={rest.mt ?? 5}>
          {items.map((item, index) => (
            <Tabs.Content
              key={index}
              value={item.label}
              _open={{
                animationName: "fade-in, scale-in",
                animationDuration: "300ms",
              }}
              _closed={{
                animationName: "fade-out, scale-out",
                animationDuration: "120ms",
              }}
            >
              {item?.content}
            </Tabs.Content>
          ))}
        </Box>
      </Tabs.Root>
    </BaseContainer>
  );
};
