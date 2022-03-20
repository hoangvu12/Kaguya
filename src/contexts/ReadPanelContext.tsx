import React, { useState } from "react";

interface State {
  isSidebarOpen: boolean;
  activeImageIndex: number;
}

interface ContextProviderValue {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const ReadPanelContext = React.createContext<ContextProviderValue>(null);

const defaultState: State = {
  isSidebarOpen: true,
  activeImageIndex: 0,
};

export const ReadPanelContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<State>(defaultState);

  return (
    <ReadPanelContext.Provider value={{ state, setState }}>
      {children}
    </ReadPanelContext.Provider>
  );
};

export const useReadPanel = () => {
  return React.useContext(ReadPanelContext);
};
