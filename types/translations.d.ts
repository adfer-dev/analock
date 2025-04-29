interface Translation {
  home: HomeTranslations;
  general: GeneralTranslations;
  games: GamesTranslations;
  diary: DiaryTranslations;
  profile: ProfileTranslations;
  settings: SettingsTranslations;
}

interface GeneralTranslations {
  onlineFeaturesDisclaimer: string;
}

interface HomeTranslations {
  books: string;
  games: string;
  diary: string;
  profile: string;
}

interface GamesTranslations {
  won: string;
}

interface DiaryTranslations {
  add: string;
  save: string;
}

interface ProfileTranslations {
  settings: string;
  calendar: string;
}

interface SettingsTranslations {
  general: string;
  onlineFeatures: string;
  language: string;
  laguageEng: string;
  languageSpa: string;
  bookReader: string;
  textSize: string;
  textSizeSmall: string;
  textSizeMedium: string;
  textSizeBig: string;
  textFont: string;
  textFontSerif: string;
  textFontOpenDyslexic: string;
}
