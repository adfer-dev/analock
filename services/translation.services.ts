import { LANGUAGE_ENGLISH, LANGUAGE_SPANISH } from "../constants/constants";
import { englishTranslations } from "../translations/eng";
import { spanishTranslations } from "../translations/spa";
import { getSettings } from "./storage.services";

export enum Language {
  English = LANGUAGE_ENGLISH,
  Spanish = LANGUAGE_SPANISH,
}

export function getSetLanguageTranslations(): Translation {
  const userSettings = getSettings();
  return getTranslations(userSettings.general.language as Language);
}

export function getTranslations(language: Language): Translation {
  if (language === LANGUAGE_ENGLISH) {
    return englishTranslations;
  } else {
    return spanishTranslations;
  }
}
