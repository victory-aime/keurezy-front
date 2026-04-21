'use client';

import { Box, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  DataTableActionButtons,
  CustomSkeletonLoader,
  PaginationDataTable,
  BaseIcon,
} from '_components/custom';
import { DataGridProps } from './interface/data-types';
import { NoDataAnimation } from './NoDataAnimation';
import { useTranslation } from 'react-i18next';

export function DataGridContainer<T>({
  data,
  isLoading = false,
  renderItem,
  displayRows = { base: 1, sm: 2, lg: 3 },
  paginationData = {
    totalDataPerPage: 6,
    lazy: false,
  },
  spacing = 6,
  actions,
  initialPage = 1,
  hidePagination,
}: DataGridProps<T>) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  if (isLoading) {
    return <CustomSkeletonLoader type={'DATA_GRID'} />;
  }

  if (data.length === 0) {
    return <NoDataAnimation />;
  }

  const paginatedItems = paginationData?.lazy
    ? data
    : data.slice(
        (currentPage - 1) * paginationData?.totalDataPerPage,
        currentPage * paginationData?.totalDataPerPage,
      );

  return (
    <main>
      <SimpleGrid columns={displayRows} gap={spacing} width={'full'} mt="30px">
        {paginatedItems.map((item, index) => {
          return (
            <Box key={index} position="relative" width={'full'}>
              {renderItem(item, index)}
              {actions && (
                <BaseIcon
                  position={'absolute'}
                  top={'8px'}
                  right={'8px'}
                  px={2}
                  py={1}
                  borderRadius={'full'}
                  color={actions?.length === 1 ? 'none' : 'primary.500'}
                >
                  <DataTableActionButtons actions={actions} item={item} />
                </BaseIcon>
              )}
            </Box>
          );
        })}
      </SimpleGrid>

      {!hidePagination && (
        <PaginationDataTable
          totalPages={paginationData?.totalPages!}
          totalDataPerPage={paginationData?.totalDataPerPage || 0}
          totalItems={paginationData?.totalItems || 0}
          currentPage={currentPage}
          lazy={paginationData?.lazy || false}
          onLazyLoad={paginationData?.onLazyLoad}
        />
      )}
    </main>
  );
}
