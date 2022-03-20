import { ReadPanelContextProvider } from "@/contexts/ReadPanelContext";
import React from "react";
import Sidebar from "./Sidebar";
import ViewPanel from "./ViewPanel";
import ImageNavigator from "./ImageNavigator";

interface ReadPanelProps {
  children: React.ReactNode;
}

const ReadPanel: React.FC<ReadPanelProps> = ({ children }) => {
  return (
    <ReadPanelContextProvider>
      <div className="flex w-full h-screen overflow-y-hidden">
        <Sidebar />
        <ViewPanel>{children}</ViewPanel>
      </div>
    </ReadPanelContextProvider>
  );
};

export default ReadPanel;
