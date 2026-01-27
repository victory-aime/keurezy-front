import { BoxProps, FlexProps } from "@chakra-ui/react";

const layoutStyle: BoxProps = {
  transition: "all 400ms cubic-bezier(0.25, 0.1, 0.25, 1)",
  overflow: "auto",
};
const footerStyles: FlexProps = {
  position: "fixed",
  w: "100%",
  bottom: "0",
  alignItems: "center",
  justifyContent: "center",
};
export { layoutStyle, footerStyles };
