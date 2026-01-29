"use client";

import { Box } from "@chakra-ui/react";
import React, { FunctionComponent, useMemo, useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { layoutStyle } from "./styles";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "_config/routes";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const { session } = useAuthContext();

  const toggledLayoutStyle = useMemo(
    () => ({
      ...layoutStyle,
      ml: {
        md: isSidebarOpen ? "220px" : "80px",
        lg: isSidebarOpen ? "230px" : "70px",
      },
      width: {
        md: isSidebarOpen ? "calc(100% - 220px)" : "calc(100% - 80px)",
        lg: isSidebarOpen ? "calc(100% - 230px)" : "calc(100% - 70px)",
      },
    }),
    [isSidebarOpen],
  );

  if (!session) {
    router.push(APP_ROUTES.AUTH.SIGN_IN);
    return null;
  }

  return (
    <>
      <Sidebar
        sideToggled={isSidebarOpen}
        onShowSidebar={toggleSidebar}
        session={session}
      />
      <Box {...toggledLayoutStyle}>
        <Header
          sideToggled={false}
          onShowSidebar={toggleSidebar}
          session={session}
        />
        <Container sidebarToggle={isSidebarOpen}>{children}</Container>
      </Box>
    </>
  );
};
