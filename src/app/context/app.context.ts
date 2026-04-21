import { createContext, useContext } from 'react';
import { applicationContext } from './global-state';

export const AppContext = createContext(applicationContext);

export const useAppContext = () => useContext(AppContext);
