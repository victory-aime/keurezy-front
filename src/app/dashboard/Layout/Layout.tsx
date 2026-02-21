"use client";

import React, { FunctionComponent, useState } from "react";
import { Container } from "./container/Container";
import { useAuthContext } from "_context/auth-context";
import { SidebarV2 } from "./sidebar/SidebarV2";
import { FooterV2 } from "./footer/FooterV2";
import { SidebarInset } from "./sidebar/components/SidebarInset";
import { HeaderV2 } from "./header/HeaderV2";
import { InitializeApp } from "_context/provider/initialize-app";

export const Layout: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { session, user, isLoading } = useAuthContext();

  return (
    <InitializeApp isLoading={isLoading}>
      <SidebarV2
        data={{ user }}
        onShowSidebar={() => setSidebarOpen(!isSidebarOpen)}
        sideToggled={isSidebarOpen}
      />
      <SidebarInset variant="inset" collapsed={!isSidebarOpen}>
        <HeaderV2
          sideToggled={isSidebarOpen}
          onShowSidebar={() => setSidebarOpen(!isSidebarOpen)}
          data={{ session }}
        />
        <Container sidebarToggle={isSidebarOpen}>{children}</Container>
        <FooterV2 />
      </SidebarInset>
    </InitializeApp>
  );
};
