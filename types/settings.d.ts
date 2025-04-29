interface SettingsData {
  general: GeneralSettings;
  bookReader: BookReaderSettings;
}

interface GeneralSettings {
  enableOnlineFeatures: boolean;
  language: string;
}

interface BookReaderSettings {
  fontSize: number;
  fontFamily: string;
}
interface SettingsRadioButton {
  text?: string;
  value: string | number;
}
