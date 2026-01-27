import { Box, Flex, SimpleGrid, Stack, Table } from "@chakra-ui/react";
import { FunctionComponent, JSX } from "react";
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "_components/ui/skeleton";
import {
  BaseButton,
  CustomSkeletonLoaderProps,
  LoaderType,
} from "_components/custom";

export const CustomSkeletonLoader: FunctionComponent<
  CustomSkeletonLoaderProps
> = ({
  tableColumns = 1,
  tableRows = 5,
  type,
  width = "250px",
  height = "300px",
  variant = "pulse",
  direction = "column",
  numberOfLines = 3,
  statisticBars = 4,
  colorButton = "info",
}) => {
  const DefaultBlockLoader = <Skeleton height={height} variant={variant} />;

  const TableLoader = (
    <Table.Root minH={height} mt={8}>
      <Table.Body minH="190px">
        {Array.from({ length: Math.max(1, tableRows) }, (_, j) => (
          <Table.Row key={`StyledTr-${j}`}>
            {Array.from({ length: Math.max(1, tableColumns) }, (_, k) => (
              <Table.Cell key={`StyledTd-${j}-${k}`}>
                <Skeleton height="25px" variant={variant} />
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );

  const PublicProductCard = (
    <SimpleGrid columns={{ base: 2, md: 4 }} width="full">
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} p={5} width="full">
          <Skeleton borderRadius="7px" height={height} variant={variant} />
          <Stack mt={4}>
            <SkeletonText variant={variant} noOfLines={numberOfLines} />
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  );

  const DonutChartLoader = (
    <Box height={height} width={width} position="relative" p={3}>
      <SkeletonCircle width="100%" height="100%" />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="50%"
        height="50%"
        bg="white"
        zIndex={1}
        borderRadius="50%"
      />
    </Box>
  );

  const LineChartLoader = (
    <Box position="relative" width={width} height={height}>
      <Flex
        position="absolute"
        bottom="0"
        left="0"
        width="100%"
        height="100%"
        justify="space-between"
        align="flex-end"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <Box key={i} flex="1" position="relative" height="100%">
            <Skeleton
              height="2px"
              width="100%"
              position="absolute"
              bottom={`${Math.random() * 80 + 10}%`}
              transform="rotate(-2deg)"
            />
          </Box>
        ))}
      </Flex>
      <Flex
        position="absolute"
        bottom="0"
        left="0"
        width="100%"
        justify="space-between"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCircle key={i} size="3" mt={`${Math.random() * -60}px`} />
        ))}
      </Flex>
    </Box>
  );

  const BarChartLoader = (
    <Flex
      width={width}
      h={height}
      mt={"20px"}
      justifyContent="space-between"
      position="relative"
      alignItems="flex-end"
    >
      {Array.from({ length: statisticBars }, (_, index) => {
        const randomHeight = `${Math.floor(Math.random() * 60) + 40}%`;
        return (
          <Skeleton
            key={`bar-${index}`}
            width={10}
            height={randomHeight}
            variant={variant}
          />
        );
      })}
    </Flex>
  );
  const SkeletonTextLoader = (
    <SkeletonText
      noOfLines={numberOfLines}
      gap={2}
      variant={variant}
      width={width}
    />
  );

  const SkeletonFormLoader = (
    <Skeleton height={height} width={width} variant={variant} />
  );

  const SkeletonImage = <Skeleton height={height} />;

  const SkeletonTextImage = (
    <Flex
      gap={direction === "column" ? 4 : 1}
      flexDir={direction}
      width={width}
    >
      <Skeleton height={height} />
      <Flex width={width}>
        <SkeletonText noOfLines={numberOfLines} variant={variant} gap={3} />
      </Flex>
    </Flex>
  );

  const SkeletonButton = (
    <Skeleton asChild loading={true} width={width}>
      <BaseButton width={width} colorType={colorButton} />
    </Skeleton>
  );

  const renderSkeletonSwitch = (param: LoaderType): JSX.Element | null => {
    switch (param) {
      case "DATA_TABLE":
        return TableLoader;
      case "DONUT_CHART":
        return DonutChartLoader;
      case "BAR_CHART":
        return BarChartLoader;
      case "LINE_CHART":
        return LineChartLoader;
      case "PRODUCT_LIST_CARD":
        return PublicProductCard;
      case "DEFAULT":
        return DefaultBlockLoader;
      case "TEXT":
        return SkeletonTextLoader;
      case "TEXT_IMAGE":
        return SkeletonTextImage;
      case "IMAGE":
        return SkeletonImage;
      case "BUTTON":
        return SkeletonButton;
      case "FORM":
        return SkeletonFormLoader;
      default:
        return null;
    }
  };

  return renderSkeletonSwitch(type ?? "DEFAULT");
};
