'use client';
import React, { FC, useEffect, useState } from 'react';
import { PaginationProps } from '../interface/data-types';
import {
  ButtonGroup,
  Flex,
  IconButton,
  Input,
  useBreakpointValue,
  Pagination,
} from '@chakra-ui/react';
import { BaseText, Icons, TextVariant } from '_components/custom';
import { useTranslation } from 'react-i18next';

export const PaginationDataTable: FC<PaginationProps> = ({
  totalPages,
  totalDataPerPage,
  currentPage = 1,
  totalItems,
  lazy,
  onLazyLoad,
}) => {
  if (lazy && (totalPages === undefined || currentPage === undefined)) {
    throw new Error('With lazy loading, totalPages and current Page are required');
  }

  const responsiveMode = useBreakpointValue({ base: false, lg: true });
  const { t } = useTranslation();

  useEffect(() => {
    setInputPageValue(currentPage.toString());
  }, [currentPage]);

  const handleClick = (page: number) => {
    onLazyLoad?.(page);
  };

  const [inputPageValue, setInputPageValue] = useState<string>(currentPage.toString());
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPageValue(event.target?.value);
  };

  const handleGoToPage = () => {
    const page = Number(inputPageValue);
    if (!isNaN(page) && page > 0 && page <= totalPages!) {
      handleClick(page);
    } else {
      setInputPageValue(currentPage.toString());
    }
  };

  const getPreviousPage = () => {
    if (currentPage > 1) handleClick(currentPage - 1);
  };

  const getNextPage = () => {
    if (currentPage < totalPages!) handleClick(currentPage + 1);
  };

  return (
    <Flex alignItems="center" justifyContent={'space-between'} w="full" mt={8} mb={8}>
      <Flex width={'full'}>
        <Pagination.Root
          count={totalItems}
          pageSize={totalDataPerPage}
          page={currentPage}
          onPageChange={(details) => handleClick(details.page)}
          // boundaryCount={0}
          // siblingCount={0}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger asChild onClick={getPreviousPage}>
              <IconButton>
                <Icons.IoIosArrowRoundBack />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton
                  key={page.value}
                  variant={{ base: 'ghost', _selected: 'solid' }}
                  colorPalette={{ _selected: 'purple' }}
                  onClick={() => handleClick(page?.value)}
                >
                  {page?.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild onClick={getNextPage}>
              <IconButton>
                <Icons.ArrowRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Flex>
      {responsiveMode && (
        <Flex width={'full'} alignItems={'center'} justifyContent={'flex-end'} gap={4}>
          <BaseText variant={TextVariant.XS}>{t('COMMON.GO_PAGE')}</BaseText>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={inputPageValue}
            onChange={handleInputChange}
            disabled={totalPages === 1}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleGoToPage();
              }
            }}
            p={'10px'}
            width={'80px'}
          />
        </Flex>
      )}
    </Flex>
  );
};
//  {Array.from({ length: totalPages! }).map((_, i) => (
//             <Button
//               key={i}
//               size={"xs"}
//               bg={currentPage === i + 1 ? "primary.500" : "none"}
//               color={currentPage === i + 1 ? "white" : "gray.700"}
//               onClick={() => handleClick(i + 1)}
//             >
//               {i + 1}
//             </Button>
//           ))}
