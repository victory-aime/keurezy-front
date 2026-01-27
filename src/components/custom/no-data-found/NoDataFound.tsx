import { Box, Text, Image } from "@chakra-ui/react";
import React, { FC } from "react";
import { NoDataFoundProps } from "./interface/type";

export const NoDataFound: FC<NoDataFoundProps> = ({
  title = "Oooup's aucune donnees",
  imageType = "v1",
  containerStyle,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap="1rem"
      width="100%"
      {...containerStyle}
    >
      <Image
        width={{ base: "100%", md: "45%" }}
        src={
          imageType === "v1"
            ? "/assets/svg/no-data-found.svg"
            : "/assets/svg/no-data-found-V2.svg"
        }
        alt="no-data-found"
        transition={"filter 0.5s ease, opacity 0.5s ease"}
        draggable={false}
      />

      <Text textAlign={"center"} fontSize={{ base: "15px", md: "18px" }}>
        {title}
      </Text>
    </Box>
  );
};

export default NoDataFound;
