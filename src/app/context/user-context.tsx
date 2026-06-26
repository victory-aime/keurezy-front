'use client';

import { UserModule } from '_store/state-management';
import { MODELS } from '_types/*';
import { createContext, useContext, ReactNode } from 'react';

interface IUserContext {
  user: MODELS.IUser | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = ({ children, userId }: { children: ReactNode; userId?: string }) => {
  const {
    data: user,
    isLoading,
    refetch,
  } = UserModule.getUserInfo({
    params: { userId: userId! },
    queryOptions: {
      enabled: !!userId,
    },
  });

  return (
    <UserContext.Provider value={{ user, isLoading, refetch }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }

  return context;
};
