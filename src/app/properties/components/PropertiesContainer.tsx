import { Box, Container, ContainerProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { UserLayout } from "../../layout/Layout";
import { GoBackPropertyList } from "./Goback";

const MotionBox = motion.create(Box);
export const PropertiesContainer = ({
  children,
  link,
  label,
  ...props
}: ContainerProps & {
  link?: string;
  label?: string;
}) => {
  return (
    <UserLayout>
      <Container
        mx={"auto"}
        px={{ base: 6, sm: 8 }}
        py={{ base: 10, sm: 6 }}
        overflow={"hidden"}
        width={"full"}
        {...props}
      >
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GoBackPropertyList link={link} label={label} />
          {children}
        </MotionBox>
      </Container>
    </UserLayout>
  );
};
