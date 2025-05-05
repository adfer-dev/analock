import { createContext, useState, type ReactNode } from "react";
import { getSettings } from "../services/storage.services";

export const SettingsContext = createContext<SettingsContext | null>(null);

interface SettingsContext {
  settings: SettingsData;
  setSettings: React.Dispatch<React.SetStateAction<SettingsData>>;
}

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<SettingsData>(getSettings());

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
