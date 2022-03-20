import React, { useState } from "react";

interface State {
  activeImageIndex: number;
}

interface ContextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const ViewPanelContext = React.createContext<ContextProps>(null);

const defaultState: State = {
  activeImageIndex: 0,
};

export const ViewPanelContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<State>(defaultState);

  return (
    <ViewPanelContext.Provider value={{ state, setState }}>
      {children}
    </ViewPanelContext.Provider>
  );
};

export const useViewPanel = () => {
  return React.useContext(ViewPanelContext);
};
