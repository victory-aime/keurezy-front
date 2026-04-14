"use client";
import { Box, SimpleGrid, Center, Flex, Field } from "@chakra-ui/react";
import React, { memo, useCallback, useState, FC } from "react";
import { hexToRGB } from "_theme/colors";
import { boxStyle } from "_components/custom/container/style";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import {
  BaseContainer,
  BaseText,
  CollapsePermissionCheckBox,
  ICollapseCheckBoxGroup,
  ISelectedCheckboxElement,
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
    // ✅ useState au lieu de let pour déclencher les re-renders
    const [selectedGroups, setSelectedGroups] =
      useState<ISelectedCheckboxElement[]>(defaultValues);

    const handleGroupElementSelection = useCallback(
      (incoming: ISelectedCheckboxElement) => {
        setSelectedGroups((prev) => {
          const index = prev.findIndex((g) => g.category === incoming.category);

          let updated: ISelectedCheckboxElement[];

          if (index !== -1) {
            if (incoming.permissions.length === 0) {
              // Plus aucune permission sélectionnée → retirer le groupe
              updated = prev.filter((_, i) => i !== index);
            } else {
              // Mettre à jour le groupe existant
              updated = prev.map((g, i) => (i === index ? incoming : g));
            }
          } else {
            // Nouveau groupe avec au moins une permission
            updated =
              incoming.permissions.length > 0 ? [...prev, incoming] : prev;
          }

          onChange(updated);
          return updated;
        });
      },
      [onChange],
    );

    return (
      <BaseContainer
        title={title}
        description={description}
        border="none"
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
              p="10px 0px"
              w="full"
            >
              {groupList.map((elt) => (
                <CollapsePermissionCheckBox
                  key={elt.category}
                  checkBoxGroup={{
                    permissions: elt.permissions,
                    category: elt.category,
                  }}
                  onSelectGroupElement={handleGroupElementSelection}
                  defaultValue={defaultValues.find(
                    (dv) => dv.category === elt.category,
                  )}
                  checkBoxColor="purple"
                />
              ))}
            </SimpleGrid>
          ) : (
            <Center width="full">
              <NoDataAnimation animationType="folder" />
            </Center>
          )}
        </Box>

        <Field.Root id="permissions" invalid={!!errorMessage && isTouched}>
          {errorMessage && isTouched && (
            <Flex gap={1} mt={1} alignItems="center">
              <Field.ErrorIcon width={2.5} height={2.5} color="red.500" />
              <Field.ErrorText>{errorMessage}</Field.ErrorText>
            </Flex>
          )}
        </Field.Root>
      </BaseContainer>
    );
  },
);
