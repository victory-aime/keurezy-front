"use client";
import { Box, SimpleGrid, Center, Flex, Field } from "@chakra-ui/react";
import React, { memo, useCallback, FC } from "react";
import { hexToRGB } from "_theme/colors";
import { boxStyle } from "_components/custom/container/style";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import {
  BaseContainer,
  BaseText,
  CollapsePermissionCheckBox,
  ICollapseCheckBoxGroup,
  ICheckboxElement,
} from "_components/custom";

export const PermissionListGroup: FC<ICollapseCheckBoxGroup> = memo(
  ({
    groupList,
    onChange,
    defaultValues = [],
    title,
    description,
    errorMessage,
    isTouched = false,
  }) => {
    let selectedGroups: ICheckboxElement[] = defaultValues;
    const handleGroupElementSelection = useCallback(
      (element: ICheckboxElement) => {
        const elementIndex = selectedGroups?.findIndex(
          (elt) => elt.modules === element.modules,
        );
        if (elementIndex != -1) {
          const newData = [...selectedGroups];
          if (!element?.features) {
            newData.splice(elementIndex, 1);
          } else {
            newData[elementIndex] = element;
          }
          selectedGroups = newData;
          onChange(selectedGroups);
        } else {
          selectedGroups = [...selectedGroups, element];
          onChange(selectedGroups);
        }
      },
      [selectedGroups.length],
    );
    return (
      <BaseContainer
        title={title}
        description={description}
        border={"none"}
        p={0}
      >
        <Box
          {...boxStyle}
          bg={hexToRGB("lighter", 0.1, 500)}
          display="flex"
          flexDir={{ base: "column", sm: "row" }}
          gap={2}
          mt={3}
        >
          {groupList?.length > 0 ? (
            <SimpleGrid
              gap="20px"
              columns={{ base: 1, sm: 2 }}
              p={"10px 0px"}
              w={"full"}
            >
              {groupList?.map((elt) => (
                <CollapsePermissionCheckBox
                  key={elt.modules}
                  checkBoxGroup={{
                    features: elt?.features,
                    modules: elt?.modules,
                  }}
                  onSelectGroupElement={handleGroupElementSelection}
                  defaultValue={
                    defaultValues?.filter((dv) => dv.modules === elt.modules)[0]
                  }
                />
              ))}
            </SimpleGrid>
          ) : (
            <Center width={"full"}>
              <NoDataAnimation animationType={"folder"} />
            </Center>
          )}
        </Box>
        <Field.Root id={"permissions"} invalid={!!errorMessage && isTouched}>
          {errorMessage && (
            <Flex gap={1} mt={1} alignItems={"center"}>
              <Field.ErrorIcon width={4} height={4} color={"red.500"} />
              <BaseText color={"red.500"}>{errorMessage}</BaseText>
            </Flex>
          )}
        </Field.Root>
      </BaseContainer>
    );
  },
);
