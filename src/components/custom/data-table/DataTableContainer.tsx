"use client";
import {
  ActionBar,
  Box,
  CloseButton,
  Flex,
  Menu,
  Portal,
  Table,
} from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";
import { Checkbox } from "_components/ui/checkbox";
import {
  ActionBarContent,
  ActionBarRoot,
  ActionBarSelectionTrigger,
  ActionBarSeparator,
} from "_components/ui/action-bar";
import {
  BaseButton,
  CustomSkeletonLoader,
  Icons,
  PaginationDataTable,
  TableProps,
} from "_components/custom";
import { DataTableActionButtons } from "./DataTableActionButtons";
import { useTranslation } from "react-i18next";
import { NoDataAnimation } from "_components/custom/data-table/NoDataAnimation";
import { hexToRGB } from "_theme/colors";
import { useColorMode } from "_components/ui/color-mode";

export const DataTableContainer: FC<TableProps> = ({
  data,
  columns,
  handleRowSelection,
  handleDeleteActionBar,
  handleShareActionBar,
  onLazyLoad,
  minH = "10rem",
  hidePagination = false,
  isLoading,
  totalPages,
  initialPage = 1,
  totalDataPerPage = 5,
  lazy = false,
  animationType = "folder",
}) => {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const [selection, setSelection] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [openActionBar, setOpenActionBar] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < data.length;

  const sortedData =
    Array.isArray(data) && data.length > 0
      ? [...data].sort((a, b) => {
          if (!sortConfig) return 0;
          const { key, direction } = sortConfig;
          return direction === "asc"
            ? a[key] > b[key]
              ? 1
              : -1
            : a[key] < b[key]
              ? 1
              : -1;
        })
      : [];

  const paginatedItems = lazy
    ? sortedData
    : sortedData.slice(
        (currentPage - 1) * totalDataPerPage,
        currentPage * totalDataPerPage,
      );

  useEffect(() => {
    handleRowSelection?.(data.filter((item) => selection.includes(item.id)));
    if (selection?.length > 1) {
      setOpenActionBar(true);
    } else {
      setOpenActionBar(false);
    }
  }, [selection?.length]);

  if (isLoading) {
    return <CustomSkeletonLoader type={"DATA_TABLE"} />;
  }

  if (data?.length === 0) {
    return <NoDataAnimation animationType={animationType} />;
  }

  return (
    <Box overflowX={"auto"} width={"full"} mt={"30px"}>
      <Table.Root minH={minH} mb={"50px"} width={"full"}>
        <Table.Header>
          <Table.Row bgColor={"primary.500"} overflow="hidden">
            {columns.map((col, i) => (
              <Table.ColumnHeader
                key={i}
                p={"20px"}
                color={"white"}
                borderTopLeftRadius={i === 0 ? "lg" : "0"}
                borderTopRightRadius={i === columns.length - 1 ? "lg" : "0"}
                borderBottomLeftRadius={i === 0 ? "lg" : "0"}
                borderBottomRightRadius={i === columns.length - 1 ? "lg" : "0"}
                cursor={col.accessor !== "select" ? "pointer" : "default"}
                onClick={() =>
                  col.accessor !== "select" &&
                  setSortConfig({
                    key: col.accessor.toString(),
                    direction: sortConfig?.direction === "asc" ? "desc" : "asc",
                  })
                }
              >
                {col.accessor === "select" ? (
                  <Checkbox
                    size={"md"}
                    aria-label="Select all rows"
                    variant={"subtle"}
                    colorPalette={selection?.length > 0 ? "orange" : "gray"}
                    checked={
                      indeterminate ? "indeterminate" : selection.length > 0
                    }
                    onCheckedChange={(changes) =>
                      setSelection(() =>
                        changes?.checked ? data.map((item) => item.id) : [],
                      )
                    }
                  />
                ) : (
                  <>
                    {t(col.header)}{" "}
                    {sortConfig?.key === col.accessor &&
                      col.accessor !== "actions" &&
                      (sortConfig.direction === "asc" ? "⬆" : "⬇")}
                  </>
                )}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paginatedItems?.map((item, rowIndex) => (
            <Table.Row
              key={item.id}
              bgColor={
                selection.includes(item.id)
                  ? colorMode !== "light"
                    ? "whiteAlpha.200"
                    : hexToRGB("neutral", 0.3)
                  : rowIndex % 2 === 0
                    ? colorMode === "light"
                      ? "white"
                      : "white"
                    : colorMode === "light"
                      ? hexToRGB("neutral", 0.3)
                      : "whiteAlpha.200"
              }
              overflow="hidden"
            >
              {columns?.map((col, rowIndex) => (
                <Table.Cell
                  p={"15px"}
                  key={rowIndex}
                  borderTopLeftRadius={rowIndex === 0 ? "lg" : "0"}
                  borderTopRightRadius={
                    rowIndex === columns.length - 1 ? "lg" : "0"
                  }
                  borderBottomLeftRadius={rowIndex === 0 ? "lg" : "0"}
                  borderBottomRightRadius={
                    rowIndex === columns.length - 1 ? "lg" : "0"
                  }
                >
                  {col.accessor === "select" ? (
                    <Checkbox
                      size={"md"}
                      aria-label="Select item"
                      checked={selection.includes(item.id)}
                      variant={"subtle"}
                      colorPalette={
                        selection.includes(item.id) ? "orange" : "gray"
                      }
                      onCheckedChange={(changes) => {
                        setSelection((prev) =>
                          changes.checked
                            ? [...prev, item.id]
                            : prev.filter((id) => id !== item.id),
                        );
                      }}
                    />
                  ) : col.accessor === "actions" && col.actions ? (
                    <Flex justifyContent={"center"}>
                      <DataTableActionButtons
                        key={item.id}
                        actions={col?.actions}
                        item={item}
                      />
                    </Flex>
                  ) : col.cell ? (
                    col.cell(
                      col.accessor === "fullObject" ? item : item[col.accessor],
                    )
                  ) : (
                    item[col.accessor]
                  )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <ActionBarRoot
        open={openActionBar}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        onOpenChange={(e) => setOpenActionBar(e?.open)}
      >
        <ActionBarContent mb={"30px"}>
          <ActionBarSelectionTrigger>
            {selection?.length} {t("COMMON.ITEMS_SELECTED")}
          </ActionBarSelectionTrigger>
          <ActionBarSeparator />
          <BaseButton
            colorType={"danger"}
            p={"2"}
            variant={"outline"}
            onClick={handleDeleteActionBar}
          >
            {t("COMMON.DELETE")}
          </BaseButton>
          <ActionBar.CloseTrigger asChild>
            <CloseButton size="sm" onClick={() => setSelection([])} />
          </ActionBar.CloseTrigger>
        </ActionBarContent>
      </ActionBarRoot>

      {!hidePagination && (
        <PaginationDataTable
          totalPages={totalPages!}
          totalDataPerPage={totalDataPerPage}
          currentPage={currentPage}
          lazy={lazy}
          onLazyLoad={onLazyLoad}
        />
      )}
    </Box>
  );
};
