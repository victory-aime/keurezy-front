"use client";

import { useState } from "react";
import { DataTableContainer } from "./DataTableContainer";
import { DataGridContainer } from "./DataGridContainer";
import { DataViewSwitcher } from "./DataViewSwitcher";
import { Box, Flex } from "@chakra-ui/react";
import { CustomSkeletonLoader } from "_components/custom";
import { DataViewMode, DisplayContainerProps } from "./interface/data-types";

export function DataDisplayContainer<T>({
  data,
  columns,
  isLoading,
  renderGridItem = () => <></>,
  ...rest
}: DisplayContainerProps<T>) {
  const [mode, setMode] = useState<DataViewMode>("table");

  return (
    <Box width="full">
      <Flex justify="flex-end" mb={4}>
        <DataViewSwitcher mode={mode} onChange={setMode} />
      </Flex>

      {isLoading ? (
        <CustomSkeletonLoader
          type={mode === "table" ? "DATA_TABLE" : "DATA_GRID"}
        />
      ) : mode === "table" ? (
        <DataTableContainer
          data={data}
          columns={columns}
          isLoading={isLoading}
          totalDataPerPage={6}
          {...rest}
        />
      ) : (
        <DataGridContainer
          renderItem={renderGridItem}
          data={data}
          isLoading={isLoading}
          {...rest}
        />
      )}
    </Box>
  );
}
