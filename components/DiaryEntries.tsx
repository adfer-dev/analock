import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import DiaryEntryDetailScreen from "./DiaryEntry";
import { useUserDiaryEntries } from "../hooks/useUserDiaryEntries";
import { BaseScreen } from "./BaseScreen";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { areDatesEqual } from "../utils/date.utils";
import { getSettings, getStorageUserData } from "../services/storage.services";
import { timestampToDate } from "../utils/date.utils";
import { generalOptions } from "./Home";
import { GENERAL_STYLES } from "../constants/general.styles";
import { TranslationsContext } from "../contexts/translationsContext";
import { OnlineFeaturesDisclaimer } from "./OnlineFeaturesDisclaimer";
import { useNavigation } from "@react-navigation/native";
import { LoadingIndicator } from "./LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddIcon } from "./icons/AddIcon";

const DiaryScreen = () => {
  const translations = useContext(TranslationsContext)?.translations;
  const DiaryEntriesStack = createNativeStackNavigator();
  return (
    <DiaryEntriesStack.Navigator initialRouteName="DiaryEntries">
      <DiaryEntriesStack.Screen
        name="DiaryEntries"
        component={DiaryEntriesScreen}
        options={{ ...generalOptions, headerTitle: translations!.home.diary }}
      />
      <DiaryEntriesStack.Screen
        name="DiaryEntry"
        component={DiaryEntryDetailScreen}
        options={({ route }) => ({
          ...generalOptions,
          headerTitle: (route.params?.isUpdate as boolean)
            ? translations?.diary.updateDiaryEntryHeader
            : translations?.diary.addDiaryEntryHeader,
        })}
      />
    </DiaryEntriesStack.Navigator>
  );
};

const DiaryEntriesScreen: React.FC = () => {
  const userSettings = getSettings();

  return userSettings && userSettings.general.enableOnlineFeatures ? (
    <DiaryEntries />
  ) : (
    <OnlineFeaturesDisclaimer />
  );
};

const DiaryEntries: React.FC = () => {
  const userData = getStorageUserData();
  const { userDiaryEntries, setUserDiaryEntries } = useUserDiaryEntries(
    userData.userId,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  // Hook to set the loading state when user's diary' entries are loaded
  useEffect(() => {
    if (userDiaryEntries !== undefined) {
      setLoading(false);
    }
  }, [userDiaryEntries]);

  return (
    <BaseScreen>
      <TouchableOpacity
        disabled={loading || isAddDiaryEntryButtonDisabled(userDiaryEntries!)}
        onPressIn={() => {
          navigation.push("DiaryEntry", {
            isUpdate: false,
            userDiaryEntries,
            setUserDiaryEntries,
          });
        }}
        style={[
          GENERAL_STYLES.uiButton,
          GENERAL_STYLES.floatingRightButton,
          isAddDiaryEntryButtonDisabled(userDiaryEntries!) &&
            GENERAL_STYLES.buttonDisabled,
        ]}
      >
        <AddIcon />
      </TouchableOpacity>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <SafeAreaView>
          {userDiaryEntries && (
            <FlatList
              numColumns={2}
              data={userDiaryEntries}
              keyExtractor={(entry) => entry.id.toString()}
              removeClippedSubviews={false}
              contentContainerStyle={[GENERAL_STYLES.flexGap]}
              renderItem={({ item, index }) => {
                const diaryEntry = item;
                return (
                  <TouchableOpacity
                    key={diaryEntry.id}
                    style={[
                      GENERAL_STYLES.flexCol,
                      GENERAL_STYLES.flexGapSmall,
                      GENERAL_STYLES.flexGrow,
                      GENERAL_STYLES.generalBorder,
                      {
                        paddingHorizontal: 20,
                        paddingBottom: 10,
                        paddingTop: 5,
                        marginRight:
                          index !== userDiaryEntries.length - 1 &&
                          index % 2 === 0
                            ? 10
                            : 0,
                        marginLeft:
                          index !== userDiaryEntries.length - 1 &&
                          index % 2 !== 0
                            ? 10
                            : 0,
                      },
                    ]}
                    onPressIn={() => {
                      navigation.push("DiaryEntry", {
                        id: diaryEntry.id,
                        title: diaryEntry.title,
                        content: diaryEntry.content,
                        publishDate: diaryEntry.registration.registrationDate,
                        isUpdate: true,
                        userDiaryEntries,
                        setUserDiaryEntries,
                      });
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBold]}
                    >
                      {diaryEntry.title}
                    </Text>
                    <Text numberOfLines={3} style={[GENERAL_STYLES.uiText]}>
                      {diaryEntry.content.replaceAll(/(\n)/g, " ")}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </SafeAreaView>
      )}
    </BaseScreen>
  );
};

/**
 * Checks if the add diary entry button should be disabled.
 *
 *   @param userDiaryEntries the user's diary entries
 *   @returns a boolean indicating whether the add diary entry button should be disabled
 */
function isAddDiaryEntryButtonDisabled(
  userDiaryEntries: DiaryEntry[],
): boolean {
  return (
    userDiaryEntries?.find((diaryEntry) =>
      areDatesEqual(
        timestampToDate(diaryEntry.registration.registrationDate),
        new Date(),
      ),
    ) !== undefined
  );
}

export default DiaryScreen;
