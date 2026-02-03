"use client";
import { For, HStack, Flex, Box } from "@chakra-ui/react";
import { RadioCard } from "@chakra-ui/react";
import { FC, useState } from "react";
import { IRadioCardProps } from "./interface/radio-card";
import { BaseIcon } from "../base-icon";

export const BaseRadioCard: FC<IRadioCardProps> = ({
  items,
  labelTitle,
  orientation = "horizontal",
  colorPalette = "purple",
  onValueChange,
  ...rest
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <RadioCard.Root
      orientation={orientation}
      alignItems={"flex-start"}
      justifyContent="space-between"
      width={"full"}
      size={"sm"}
      colorPalette={colorPalette}
      defaultValue={items[currentIndex]?.value}
      value={items[currentIndex]?.value}
      onValueChange={(details: { value: string | null }) => {
        const { value } = details;
        const index = items?.findIndex((item) => item?.value === value);
        setCurrentIndex(index);
        if (onValueChange && value !== null) onValueChange({ value });
      }}
      {...rest}
    >
      {labelTitle && <RadioCard.Label>{labelTitle}</RadioCard.Label>}

      <HStack
        width={"full"}
        alignItems={"center"}
        flexDir={{ base: "column", md: "row" }}
      >
        <For each={items}>
          {(item, index) => (
            <RadioCard.Item key={index} width={"full"} value={item?.value}>
              <RadioCard.ItemHiddenInput />
              <Flex gap={2}>
                <RadioCard.ItemControl
                  alignItems={"center"}
                  justifyItems={"center"}
                >
                  <BaseIcon
                    color={
                      items[currentIndex]?.value === item.value
                        ? "primary.500"
                        : "secondary.500"
                    }
                  >
                    {item.icon}
                  </BaseIcon>
                  <RadioCard.ItemText>{item.label}</RadioCard.ItemText>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemControl>
              </Flex>
            </RadioCard.Item>
          )}
        </For>
      </HStack>

      {items[currentIndex]?.desc && (
        <RadioCard.ItemDescription mt={5}>
          {items[currentIndex]?.desc}
        </RadioCard.ItemDescription>
      )}
      <For each={items}>
        {(item, index) => (
          <Box
            key={index}
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
          </Box>
        )}
      </For>
    </RadioCard.Root>
  );
};
