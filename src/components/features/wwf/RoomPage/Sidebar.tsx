import useHorizontalScroll from "@/hooks/useHorizontalScroll";
import { useTranslation } from "next-i18next";
import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import AudioChat from "./AudioChat";
import ChatBar from "./ChatBar";
import MediaBar from "./MediaBar";

const Sidebar = () => {
  const { t } = useTranslation("wwf");

  const tabContainerRef = React.useRef<HTMLElement>(null);

  const handleTabSelect = () => {
    tabContainerRef.current.scrollTop = 0;
  };

  const ref = useHorizontalScroll<HTMLDivElement>();

  return (
    <Tabs
      domRef={(node) => (tabContainerRef.current = node)}
      onSelect={handleTabSelect}
      forceRenderTabPanel
      className="flex flex-col relative w-full h-full bg-background-900 overflow-y-scroll no-scrollbar"
      selectedTabClassName="bg-background-700 border-b border-primary-500"
      selectedTabPanelClassName="!block"
    >
      <div className="p-2 bg-background-800">
        <TabList className="z-50 sticky top-0">
          <div
            ref={ref}
            className="flex items-center gap-2 overflow-x-scroll no-scrollbar"
          >
            <Tab className="px-3 py-2 cursor-pointer">
              {t("sideBar.introduction")}
            </Tab>
            <Tab className="px-3 py-2 cursor-pointer">
              {t("sideBar.textChat")}
            </Tab>
            <Tab className="px-3 py-2 cursor-pointer">
              {t("sideBar.voiceChat")}
            </Tab>
          </div>
        </TabList>
      </div>

      <div className="py-4 grow overflow-x-hidden no-scrollbar">
        <TabPanel className="hidden p-2">
          <MediaBar />
        </TabPanel>
        <TabPanel className="hidden h-full p-2">
          <ChatBar />
        </TabPanel>
        <TabPanel className="hidden h-full p-2">
          <AudioChat />
        </TabPanel>
      </div>
    </Tabs>
  );
};

export default Sidebar;
