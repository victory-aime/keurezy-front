'use client';
import { createContext, useContext, useState } from 'react';

const AgencyCheckContext = createContext<any>(null);

export const AgencyCheckProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAlreadyExists, setNameAlreadyExists] = useState(false);

  return (
    <AgencyCheckContext.Provider
      value={{ isCheckingName, setIsCheckingName, nameAlreadyExists, setNameAlreadyExists }}
    >
      {children}
    </AgencyCheckContext.Provider>
  );
};

export function useAgencyCheck() {
  const context = useContext(AgencyCheckContext);
  if (context === undefined) {
    throw new Error('useAgencyCheck must be used within an AgencyCheckContext');
  }
  return context;
}
