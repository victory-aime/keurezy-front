"use client";

import { createContext, useContext, ReactNode } from "react";
import { SessionErrorModal } from "../auth/components/ErrorModal";
import { isExpired } from "../helpers/expire-token";
import { AuthContextType } from "../dashboard/Layout/sidebar/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: AuthContextType | null;
}) {
  if (session?.session?.expiresAt && isExpired(session.session.expiresAt)) {
    return <SessionErrorModal isOpen />;
  }

  return (
    <AuthContext.Provider
      value={{
        session: session?.session,
        isLoading: !session?.session?.token,
        user: session?.user,
      }}
    >
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
