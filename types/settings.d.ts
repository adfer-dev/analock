interface SettingsData {
  general: GeneralSettings;
  bookReader: BookReaderSettings;
  preferences: PreferencesSettings;
}

interface GeneralSettings {
  enableOnlineFeatures: boolean;
  language: string;
}

interface BookReaderSettings {
  fontSize: number;
  fontFamily: string;
}

interface PreferencesSettings {
  firstDayOfWeek: number;
}

interface SettingsRadioButton {
  text?: string;
  value: string | number;
}
