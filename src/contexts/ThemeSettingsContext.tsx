import React, { useCallback, useEffect } from "react";

export const endModes = ["repeat", "refresh"] as const;

interface Settings {
  endMode: typeof endModes[number];
}

type Setter = <T extends keyof Settings>(
  setting: T,
  value: Settings[T]
) => void;

interface ContextProps extends Settings {
  setSetting: Setter;
}

const ThemeSettings = React.createContext<ContextProps>(null);

const defaultSettings: Settings = {
  endMode: "repeat",
};

const LOCAL_STORAGE_KEY = "kaguya_theme_settings";

export const ThemeSettingsContextProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = React.useState<Settings>(defaultSettings);

  useEffect(() => {
    const settings =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || defaultSettings;

    setSettings(settings);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setSetting: Setter = useCallback(
    (key, value) => {
      setSettings({ ...settings, [key]: value });
    },
    [settings]
  );

  return (
    <ThemeSettings.Provider value={{ ...settings, setSetting }}>
      {children}
    </ThemeSettings.Provider>
  );
};

export const useThemeSettings = () => {
  return React.useContext(ThemeSettings);
};
