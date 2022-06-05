import { AnimeTheme } from "@/types";
import React from "react";

interface ContextProps {
  theme: AnimeTheme;
  refresh: () => void;
  isLoading: boolean;
}

interface ThemePlayerContextProviderProps {
  value: ContextProps;
}

const ThemePlayerContext = React.createContext<ContextProps>(null);

export const ThemePlayerContextProvider: React.FC<ThemePlayerContextProviderProps> =
  ({ children, value }) => {
    return (
      <ThemePlayerContext.Provider value={value}>
        {children}
      </ThemePlayerContext.Provider>
    );
  };

export const useThemePlayer = () => {
  return React.useContext(ThemePlayerContext);
};
