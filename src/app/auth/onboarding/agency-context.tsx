// AgencyCheckContext.tsx
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

export const useAgencyCheck = () => useContext(AgencyCheckContext);
