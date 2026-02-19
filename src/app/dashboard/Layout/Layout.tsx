"use client";

import React, { FC, FunctionComponent, useState } from "react";
import { Header } from "./header";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { InitializeApp } from "_context/provider/initialize-app";
import { SidebarV2 } from "./sidebar/SidebarV2";
import { FooterV2 } from "./footer/FooterV2";
import { SidebarInset } from "./sidebar/components/SidebarInset";
import { HeaderV2 } from "./header/HeaderV2";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const { session, user } = useAuthContext();

  return (
    <>
      <SidebarV2
        data={{ user }}
        onShowSidebar={toggleSidebar}
        sideToggled={isSidebarOpen}
      />
      <SidebarInset variant="inset" collapsed={!isSidebarOpen}>
        <HeaderV2
          sideToggled={isSidebarOpen}
          onShowSidebar={toggleSidebar}
          data={{ session }}
        />
        <Container sidebarToggle={isSidebarOpen}>{children}</Container>
        <FooterV2 />
      </SidebarInset>
    </>
  );
};
