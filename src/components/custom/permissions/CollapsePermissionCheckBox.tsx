"use client";
import { Box, CheckboxGroup, Flex, Menu } from "@chakra-ui/react";
import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "_components/ui/checkbox";
import {
  BaseText,
  TextVariant,
  TextWeight,
  ICheckboxGroup,
} from "_components/custom";
import { hexToRGB } from "_theme/colors";
import { VariablesColors } from "_theme/variables";
import { MdKeyboardArrowDown } from "react-icons/md";

export const CollapsePermissionCheckBox: React.FC<ICheckboxGroup> = memo(
  (props) => {
    const {
      checkBoxGroup,
      onSelectGroupElement,
      defaultValue,
      checkBoxColor = "green",
    } = props;
    const [open, setOpen] = React.useState(false);
    const [selectedElement, setSelectedElement] = React.useState<
      Record<string, string>
    >({});
    const { t } = useTranslation();
    const selectedElementsLength = Object.values(selectedElement)?.length;
    const isAllSelected =
      selectedElementsLength === checkBoxGroup.features?.length;
    const isNoneSelected = selectedElementsLength === 0;
    const isIndeterminate = !isAllSelected && !isNoneSelected;

    useEffect(() => {
      if (defaultValue?.features) {
        const defaultSelectedElements = defaultValue?.features?.reduce(
          (acc: Record<string, string>, elt: string) => {
            acc[elt] = elt;
            return acc;
          },
          {},
        );
        setSelectedElement(defaultSelectedElements);
      }
    }, [defaultValue]);

    const handleCheckboxChange = (checked: boolean) => {
      const newSelectedElement: Record<string, string> = {};
      if (checked) {
        checkBoxGroup.features?.forEach((elt: string) => {
          newSelectedElement[elt] = elt;
        });
      }
      setSelectedElement(newSelectedElement);
      onSelectGroupElement({
        modules: checkBoxGroup.modules,
        features: newSelectedElement,
      });
    };

    return (
      <Menu.Root
        positioning={{ strategy: "fixed", hideWhenDetached: true }}
        size={"md"}
        closeOnSelect={false}
        open={open}
        onOpenChange={(e) => setOpen(e?.open)}
      >
        <Menu.Trigger asChild width={"full"}>
          <Flex
            p={"2"}
            alignItems={"center"}
            justifyContent={"space-between"}
            bgColor={hexToRGB("success", 0.1)}
            borderRadius={"7px"}
            width={"full"}
          >
            <Flex gap={"3"} width={"full"}>
              <Checkbox
                checked={isIndeterminate ? "indeterminate" : isAllSelected}
                onCheckedChange={(e) => handleCheckboxChange(!!e.checked)}
                colorPalette={checkBoxColor}
                variant={"subtle"}
              />
              <BaseText weight={TextWeight.Bold}>
                {t(
                  "PERMISSIONS.MODULES." + checkBoxGroup.modules.toUpperCase(),
                )}
              </BaseText>
            </Flex>
            <Flex
              alignItems={"center"}
              justifyContent={"flex-end"}
              gap={"3"}
              width={"1/4"}
            >
              {selectedElementsLength > 0 && (
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  bgColor={checkBoxColor}
                  rounded={"full"}
                  boxSize={"35px"}
                  color="white"
                >
                  <BaseText variant={TextVariant.XS}>
                    {selectedElementsLength === checkBoxGroup.features?.length
                      ? t("Tous")
                      : selectedElementsLength}
                  </BaseText>
                </Flex>
              )}
              <Box
                transition="all ease-in-out 200ms"
                transform={open ? "rotate(180deg)" : ""}
              >
                <MdKeyboardArrowDown
                  width={"18px"}
                  height={"18px"}
                  color={VariablesColors.grayScale}
                />
              </Box>
            </Flex>
          </Flex>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content width={"full"}>
            <CheckboxGroup value={Object?.values(selectedElement)}>
              {checkBoxGroup.features?.map((elt, index: number) => (
                <Menu.CheckboxItem
                  key={index}
                  value={elt}
                  checked={!!selectedElement[elt]}
                  cursor={"pointer"}
                  onCheckedChange={() => {
                    const newSelectedElement: Record<string, string> = {
                      ...selectedElement,
                    };
                    if (newSelectedElement[elt]) {
                      delete newSelectedElement[elt];
                    } else {
                      newSelectedElement[elt] = elt;
                    }
                    setSelectedElement(newSelectedElement);
                    onSelectGroupElement({
                      modules: checkBoxGroup.modules,
                      features: newSelectedElement,
                    });
                  }}
                >
                  <Menu.ItemIndicator asChild>
                    <Checkbox
                      checked={!!selectedElement}
                      colorPalette={checkBoxColor}
                      variant={"subtle"}
                    />
                  </Menu.ItemIndicator>
                  {t("PERMISSIONS.FEATURE_LIST." + elt?.toUpperCase())}
                </Menu.CheckboxItem>
              ))}
            </CheckboxGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    );
  },
);
