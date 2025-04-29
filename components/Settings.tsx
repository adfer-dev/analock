import { Text } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { GENERAL_STYLES } from "../constants/general.styles";
import { ButtonGroup } from "./ButtonGroup";
import { useContext, useEffect, useState } from "react";
import {
  FONT_FAMILY_OPEN_DYSLEXIC,
  FONT_FAMILY_SERIF,
  FONT_SIZE_BIG,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  LANGUAGE_ENGLISH,
  LANGUAGE_SPANISH,
} from "../constants/constants";
import { getSettings } from "../services/storage.services";
import { useSaveOnExit } from "../hooks/useSaveOnExit";
import { TranslationsContext } from "../contexts/translationsContext";
import { Language, getTranslations } from "../services/translation.services";
import { CustomSwitch } from "./CustomSwitch";

function Settings() {
  const translationsContext = useContext(TranslationsContext);
  const settingsTranslations = translationsContext?.translations.settings;
  const languageRadioGroup: SettingsRadioButton[] = [
    {
      text: settingsTranslations?.laguageEng,
      value: LANGUAGE_ENGLISH,
    },
    {
      text: settingsTranslations?.languageSpa,
      value: LANGUAGE_SPANISH,
    },
  ];
  const fontSizeRadioGroup: SettingsRadioButton[] = [
    {
      text: settingsTranslations?.textSizeSmall,
      value: FONT_SIZE_SMALL,
    },
    {
      text: settingsTranslations?.textSizeMedium,
      value: FONT_SIZE_MEDIUM,
    },
    {
      text: settingsTranslations?.textSizeBig,
      value: FONT_SIZE_BIG,
    },
  ];
  const fontFamilyRadioGroup: SettingsRadioButton[] = [
    {
      text: settingsTranslations?.textFontSerif,
      value: FONT_FAMILY_SERIF,
    },
    {
      text: settingsTranslations?.textFontOpenDyslexic,
      value: FONT_FAMILY_OPEN_DYSLEXIC,
    },
  ];
  const userSettings = getSettings();
  const [areOnlineFeaturesEnabled, setAreOnlineFeaturesEnabled] =
    useState<boolean>(userSettings.general.enableOnlineFeatures);
  const [selectedLanguage, setSelectedLanguage] = useState<number>(
    languageRadioGroup.findIndex(
      (language) => language.value === userSettings.general.language,
    ),
  );
  const [selectedFontSize, setSelectedFontSize] = useState<number>(
    fontSizeRadioGroup.findIndex(
      (fontSize) => fontSize.value === userSettings.bookReader.fontSize,
    ),
  );
  const [selectedFontFamily, setSelectedFontFamily] = useState<number>(
    fontFamilyRadioGroup.findIndex(
      (fontFamily) => fontFamily.value === userSettings.bookReader.fontFamily,
    ),
  );
  useSaveOnExit({
    general: {
      enableOnlineFeatures: areOnlineFeaturesEnabled,
      language: languageRadioGroup[selectedLanguage].value as string,
    },
    bookReader: {
      fontSize: fontSizeRadioGroup[selectedFontSize].value as number,
      fontFamily: fontFamilyRadioGroup[selectedFontFamily].value as string,
    },
  });

  useEffect(() => {
    translationsContext?.setTranslations(
      getTranslations(
        languageRadioGroup[selectedLanguage].value as string as Language,
      ),
    );
  }, [selectedLanguage]);

  return (
    <BaseScreen>
      <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textTitle]}>
        {settingsTranslations?.general}
      </Text>
      <CustomSwitch
        label={settingsTranslations?.onlineFeatures}
        isEnabled={areOnlineFeaturesEnabled}
        setIsEnabled={setAreOnlineFeaturesEnabled}
      />
      <Text style={[GENERAL_STYLES.uiText]}>
        {settingsTranslations?.language}
      </Text>
      <ButtonGroup
        buttons={languageRadioGroup}
        selectedIndex={selectedLanguage}
        setSelectedIndex={setSelectedLanguage}
      />
      <Text
        style={[
          GENERAL_STYLES.uiText,
          GENERAL_STYLES.textTitle,
          GENERAL_STYLES.marginTop,
        ]}
      >
        {settingsTranslations?.bookReader}
      </Text>
      <Text style={[GENERAL_STYLES.uiText]}>
        {settingsTranslations?.textSize}
      </Text>
      <ButtonGroup
        buttons={fontSizeRadioGroup}
        selectedIndex={selectedFontSize}
        setSelectedIndex={setSelectedFontSize}
      />
      <Text style={[GENERAL_STYLES.uiText]}>
        {settingsTranslations?.textFont}
      </Text>
      <ButtonGroup
        buttons={fontFamilyRadioGroup}
        selectedIndex={selectedFontFamily}
        setSelectedIndex={setSelectedFontFamily}
      />
    </BaseScreen>
  );
}

export default Settings;
