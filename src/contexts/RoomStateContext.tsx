import React from "react";

interface State {
  isCommunicationBarOpen: boolean;
}

interface ContextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const RoomStateContext = React.createContext<ContextProps>(null);

const defaultState: State = {
  isCommunicationBarOpen: true,
};

export const RoomStateContextProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<State>(defaultState);

  return (
    <RoomStateContext.Provider value={{ state, setState }}>
      {children}
    </RoomStateContext.Provider>
  );
};

export const useRoomState = () => {
  return React.useContext(RoomStateContext);
};
