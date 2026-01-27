"use client";
import React, { FC, useEffect, useState } from "react";
import { PaginationProps } from "../interface/data-types";
import { Flex, Input, useBreakpointValue } from "@chakra-ui/react";
import {
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "_components/ui/pagination";
import { Button } from "_components/ui/button";
import { BaseText, TextVariant } from "_components/custom";
import { useTranslation } from "react-i18next";

export const PaginationDataTable: FC<PaginationProps> = ({
  totalPages,
  totalDataPerPage,
  currentPage = 1,
  lazy,
  onLazyLoad,
}) => {
  if (lazy && (totalPages === undefined || currentPage === undefined)) {
    throw new Error(
      "With lazy loading, totalPages and current Page are required",
    );
  }

  const responsiveMode = useBreakpointValue({ base: false, lg: true });
  const { t } = useTranslation();

  useEffect(() => {
    setInputPageValue(currentPage.toString());
  }, [currentPage]);

  const handleClick = (page: number) => {
    onLazyLoad?.(page);
  };

  const [inputPageValue, setInputPageValue] = useState<string>(
    currentPage.toString(),
  );
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPageValue(event.target?.value);
  };

  const handleGoToPage = () => {
    const page = Number(inputPageValue);
    if (!isNaN(page) && page > 0 && page <= totalPages!) {
      onLazyLoad?.(page);
    } else {
      setInputPageValue(currentPage.toString());
    }
  };

  const getPreviousPage = () => {
    if (currentPage > 1) onLazyLoad?.(currentPage - 1);
  };

  const getNextPage = () => {
    if (currentPage < totalPages!) onLazyLoad?.(currentPage + 1);
  };

  return (
    <Flex
      alignItems="center"
      justifyContent={"space-between"}
      w="full"
      mt={8}
      mb={8}
    >
      <Flex width={"full"}>
        <PaginationRoot count={totalPages ?? 0} pageSize={totalDataPerPage}>
          <PaginationPrevTrigger onClick={getPreviousPage} />
          {Array.from({ length: totalPages! }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              bg={currentPage === i + 1 ? "secondary.500" : "none"}
              color={currentPage === i + 1 ? "white" : "gray.700"}
              onClick={() => handleClick(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <PaginationNextTrigger onClick={getNextPage} />
        </PaginationRoot>
      </Flex>
      {responsiveMode && (
        <Flex
          width={"full"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          gap={4}
        >
          <BaseText variant={TextVariant.XS}>{t("COMMON.GO_PAGE")}</BaseText>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={inputPageValue}
            onChange={handleInputChange}
            disabled={totalPages === 1}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleGoToPage();
              }
            }}
            p={"10px"}
            width={"80px"}
          />
        </Flex>
      )}
    </Flex>
  );
};
