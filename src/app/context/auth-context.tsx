"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "../lib/auth-client";
import { SessionErrorModal } from "../auth/components/ErrorModal";
import { isExpired } from "../helpers/expire-token";

interface AuthContextType {
  session: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: any;
  } | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: isLoading } = authClient.useSession();

  if (isExpired(session?.session?.expiresAt!)) {
    return <SessionErrorModal />;
  }

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
