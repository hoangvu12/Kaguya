import React, { useEffect } from "react";

export const fitModes = ["width", "height", "auto"] as const;
export const directions = ["vertical", "ltr", "rtl"] as const;

interface Settings {
  fitMode: typeof fitModes[number];
  zoom: number;
  direction: typeof directions[number];
}

type Setter = <T extends keyof Settings>(
  setting: T,
  value: Settings[T]
) => void;

interface ContextProps extends Settings {
  setSetting: Setter;
}

const ReadContext = React.createContext<ContextProps>(null);

const defaultSettings: Settings = {
  fitMode: "auto",
  zoom: 1,
  direction: "vertical",
};

export const ReadSettingsContextProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  useEffect(() => {
    const settings =
      JSON.parse(localStorage.getItem("settings")) || defaultSettings;

    setSettings(settings);
  }, []);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const setSetting: Setter = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <ReadContext.Provider value={{ ...settings, setSetting }}>
      {children}
    </ReadContext.Provider>
  );
};

export const useReadSettings = () => {
  return React.useContext(ReadContext);
};
