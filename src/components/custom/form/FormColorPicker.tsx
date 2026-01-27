"use client";

import {
  ColorPicker,
  HStack,
  Portal,
  Show,
  IconButton,
  parseColor,
  Field,
  Flex,
  InputGroup,
} from "@chakra-ui/react";
import { LuCheck, LuPlus } from "react-icons/lu";
import { FC, useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import { FormColorPickerProps } from "./interface/input";
import { BaseText } from "../base-text";
import { HiOutlineInformationCircle } from "react-icons/hi2";
import { BaseTooltip } from "../tooltip";
import { BaseButton } from "../button";
import { IoSave } from "react-icons/io5";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

const LOCAL_STORAGE_KEY = "custom-color-swatches";

const DEFAULT_SWATCHES = [
  "#000000",
  "#4A5568",
  "#F56565",
  "#ED64A6",
  "#9F7AEA",
  "#6B46C1",
  "#4299E1",
  "#0BC5EA",
  "#00B5D8",
  "#38B2AC",
  "#48BB78",
  "#68D391",
  "#ECC94B",
  "#DD6B20",
];

export const FormColorPicker: FC<FormColorPickerProps> = ({
  name,
  label,
  validate,
  isDisabled,
  isReadOnly,
  required,
  infoMessage,
  toolTipInfo,
}) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<any>();
  const fieldHookConfig = {
    name,
    validate,
  };
  const [field, { touched, error }] = useField(fieldHookConfig);
  const { submitCount } = useFormikContext();
  const isError = isReadOnly
    ? !!error
    : !!(error && (touched || submitCount > 0));
  const [view, setView] = useState<"picker" | "swatch">("swatch");
  const [color, setColor] = useState(parseColor(field.value || "#000"));
  const [swatches, setSwatches] = useState<string[]>(DEFAULT_SWATCHES);

  // Restore custom swatches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setSwatches([...DEFAULT_SWATCHES, ...JSON.parse(saved)]);
    }
  }, []);

  // Set Formik value on change
  useEffect(() => {
    if (color) setFieldValue(name, color.toString("css"));
  }, [color]);

  // Save custom swatches to localStorage
  const saveSwatch = () => {
    const hex = color.toString("css");
    if (!swatches.includes(hex)) {
      const custom = [
        ...swatches.filter((s) => !DEFAULT_SWATCHES.includes(s)),
        hex,
      ];
      setSwatches([...DEFAULT_SWATCHES, ...custom]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(custom));
    }
    setView("swatch");
  };

  return (
    <Field.Root id={name} invalid={isError}>
      {label && (
        <Field.Label
          display={"flex"}
          gap={"6px"}
          fontSize={{ base: "14px", md: "16px" }}
        >
          {label}
          {required && <BaseText color={"red"}> * </BaseText>}
        </Field.Label>
      )}

      <ColorPicker.Root
        defaultValue={color}
        onValueChange={(e) => setColor(e.value)}
        width={"full"}
        format="rgba"
      >
        <ColorPicker.Control width={"full"}>
          <InputGroup
            flex={1}
            width={"full"}
            endElement={
              <>
                {toolTipInfo && (
                  <Flex
                    mt={"5px"}
                    pr={"5px"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <BaseTooltip message={toolTipInfo}>
                      <HiOutlineInformationCircle size={18} />
                    </BaseTooltip>
                  </Flex>
                )}
              </>
            }
          >
            <ColorPicker.Input
              onBlur={(e) => {
                field?.onBlur(e);
              }}
              borderRadius={"7px"}
              border={"1px solid"}
              borderColor={isError ? "red.500" : "bg.muted"}
              _focus={{ borderColor: "primary.500" }}
              _placeholder={{ color: isError ? "red.500" : "gray.400" }}
              pl={3}
              mt={"5px"}
              bg={"bg.muted"}
              readOnly={isReadOnly}
              disabled={isDisabled}
              fontSize={"16px"}
              height={"50px"}
              autoCapitalize="none"
            />
          </InputGroup>
          <ColorPicker.Trigger border={"none"} />
        </ColorPicker.Control>

        <Portal>
          <ColorPicker.Positioner>
            <ColorPicker.Content width={"300px"}>
              <Show when={view === "picker"}>
                <ColorPicker.Area />
                <HStack mt={2}>
                  <ColorPicker.EyeDropper size="sm" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
                <HStack width={"full"}>
                  <BaseButton
                    p={0}
                    leftIcon={<IoIosArrowDropleftCircle />}
                    onClick={() => setView("swatch")}
                    colorType={"secondary"}
                  />
                  <BaseButton
                    width={"220px"}
                    colorType={"success"}
                    leftIcon={<IoSave />}
                    onClick={saveSwatch}
                    disabled={!color}
                  >
                    Enregistrer
                  </BaseButton>
                </HStack>
              </Show>

              <Show when={view === "swatch"}>
                <ColorPicker.SwatchGroup>
                  {swatches.map((swatch) => (
                    <ColorPicker.SwatchTrigger key={swatch} value={swatch}>
                      <ColorPicker.Swatch value={swatch}>
                        <ColorPicker.SwatchIndicator>
                          <LuCheck />
                        </ColorPicker.SwatchIndicator>
                      </ColorPicker.Swatch>
                    </ColorPicker.SwatchTrigger>
                  ))}
                  <IconButton
                    aria-label="Ajouter"
                    variant="outline"
                    size="xs"
                    onClick={() => setView("picker")}
                  >
                    <LuPlus />
                  </IconButton>
                </ColorPicker.SwatchGroup>
              </Show>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
      </ColorPicker.Root>
      {isError && <Field.ErrorText>{error}</Field.ErrorText>}
      {infoMessage && (
        <Flex gap={1} mt={1} alignItems={"center"}>
          <Field.ErrorIcon width={4} height={4} color={"info.500"} />
          <Field.HelperText p={1}>{t(infoMessage)}</Field.HelperText>
        </Flex>
      )}
    </Field.Root>
  );
};
