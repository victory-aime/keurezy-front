"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ActionButtons,
  CustomSkeletonLoader,
  PaginationDataTable,
} from "_components/custom";
import { DataGridProps } from "./interface/data-types";
import { NoDataAnimation } from "./NoDataAnimation";
import { useTranslation } from "react-i18next";

export function DataGridContainer<T>({
  data,
  isLoading = false,
  renderItem,
  displayRows = { base: 1, sm: 2, md: 3, lgToXl: 4 },
  spacing = 6,
  actions,
  totalPages,
  totalDataPerPage = 6,
  initialPage = 1,
  lazy = false,
  onLazyLoad,
  hidePagination,
}: DataGridProps<T>) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  if (isLoading) {
    return <CustomSkeletonLoader type={"DATA_GRID"} />;
  }

  if (data.length === 0) {
    return <NoDataAnimation />;
  }

  const paginatedItems = lazy
    ? data
    : data.slice(
        (currentPage - 1) * totalDataPerPage,
        currentPage * totalDataPerPage,
      );

  return (
    <Box mt="30px">
      <SimpleGrid columns={displayRows} gap={spacing}>
        {paginatedItems.map((item, index) => {
          return (
            <Box key={index} position="relative">
              {renderItem(item, index)}
              <Box position={"absolute"} top={"8px"} right={"8px"}>
                {actions && <ActionButtons actions={actions} item={item} />}
              </Box>
            </Box>
          );
        })}
      </SimpleGrid>

      {!hidePagination && (
        <PaginationDataTable
          totalPages={totalPages}
          totalDataPerPage={totalDataPerPage}
          currentPage={currentPage}
          lazy={lazy}
          onLazyLoad={lazy ? onLazyLoad : setCurrentPage}
        />
      )}
    </Box>
  );
}
