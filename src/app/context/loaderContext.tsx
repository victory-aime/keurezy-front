'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { GlobalLoader } from '_components/custom';

type LoaderContextType = {
  showLoader: () => void;
  hideLoader: () => void;
  isLoading: boolean;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
      {isLoading && <GlobalLoader loader={isLoading} />}
    </LoaderContext.Provider>
  );
};

export const useGlobalLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useGlobalLoader must be used within a LoaderProvider');
  }
  return context;
};
