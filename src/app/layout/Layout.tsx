"use client";
import React, { useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { InitializeApp } from "_context/provider/initialize-app";
import { useAuthContext } from "_context/auth-context";

export const UserLayout = () => {
  const { isLoading } = useAuthContext();

  return (
    <InitializeApp isLoading={isLoading}>
      <Header />
      <Footer />
    </InitializeApp>
  );
};
