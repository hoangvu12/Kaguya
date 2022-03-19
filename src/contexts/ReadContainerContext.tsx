import React, { useState } from "react";

interface State {
  activeImageIndex: number;
}

interface ContextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const ReadContainerContext = React.createContext<ContextProps>(null);

const defaultState: State = {
  activeImageIndex: 0,
};

export const ReadContainerContextProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<State>(defaultState);

  return (
    <ReadContainerContext.Provider value={{ state, setState }}>
      {children}
    </ReadContainerContext.Provider>
  );
};

export const useReadContainer = () => {
  return React.useContext(ReadContainerContext);
};
