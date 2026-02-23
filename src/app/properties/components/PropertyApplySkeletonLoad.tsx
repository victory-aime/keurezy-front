import { Container, VStack, Box, HStack, Flex } from "@chakra-ui/react";
import { CustomSkeletonLoader } from "_components/custom";
import { UserLayout } from "../../layout/Layout";

export function PropertyApplySkeletonLoad({}: { isLoading: boolean }) {
  return (
    <UserLayout>
      <Container
        mx={"auto"}
        px={{ base: 6, sm: 8 }}
        py={{ base: 10, sm: 6 }}
        maxW={"4xl"}
        overflow={"hidden"}
      >
        <VStack width="full" gap={5}>
          <CustomSkeletonLoader type="TEXT" numberOfLines={2} />
          <Box mt={1} width={"full"}>
            <CustomSkeletonLoader
              type="FORM"
              width={"full"}
              height={200}
              numberOfLines={3}
            />
          </Box>
          <Box mt={3} width={"full"}>
            <HStack mb={3}>
              <CustomSkeletonLoader
                type="BUTTON"
                colorButton="primary"
                width={5}
              />
              <CustomSkeletonLoader type="TEXT" numberOfLines={1} />
            </HStack>
            <CustomSkeletonLoader
              type="FORM"
              width={"full"}
              height={200}
              numberOfLines={3}
            />
          </Box>
          <Box mt={3} width={"full"}>
            <HStack mb={3}>
              <CustomSkeletonLoader
                type="BUTTON"
                colorButton="tertiary"
                width={5}
              />
              <CustomSkeletonLoader type="TEXT" numberOfLines={1} />
            </HStack>
            <CustomSkeletonLoader
              type="FORM"
              width={"full"}
              height={200}
              numberOfLines={3}
            />
          </Box>
          <Box mt={3} mb={3} width={"full"}>
            <CustomSkeletonLoader
              type="FORM"
              width={"full"}
              height={200}
              numberOfLines={3}
            />
            <Flex
              width={"full"}
              alignItems={"flex-end"}
              justifyContent={"flex-end"}
              mt={5}
              gap={3}
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <CustomSkeletonLoader
                  key={i}
                  type="BUTTON"
                  colorButton={i !== 1 ? "neutral" : "primary"}
                />
              ))}
            </Flex>
          </Box>
        </VStack>
      </Container>
    </UserLayout>
  );
}
