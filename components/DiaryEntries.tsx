import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import DiaryEntryDetailScreen from "./DiaryEntry";
import { useUserDiaryEntries } from "../hooks/useUserDiaryEntries";
import { BaseScreen } from "./BaseScreen";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { CustomModal } from "./CustomModal";
import {
  addUserDiaryEntry,
  updateUserDiaryEntry,
} from "../services/diaryEntries.services";
import { areDatesEqual, emptyDateTime } from "../utils/date.utils";
import { getStorageUserData } from "../services/storage.services";
import { timestampToDate } from "../utils/date.utils";
import { generalOptions } from "./Home";
import { GENERAL_STYLES } from "../constants/general.styles";

const DiaryScreen = () => {
  const DiaryEntriesStack = createNativeStackNavigator();
  return (
    <DiaryEntriesStack.Navigator initialRouteName="DiaryEntries">
      <DiaryEntriesStack.Screen
        name="DiaryEntries"
        component={DiaryEntries}
        options={{ ...generalOptions, headerTitle: "Diary" }}
      />
      <DiaryEntriesStack.Screen
        name="DiaryEntry"
        component={DiaryEntryDetailScreen}
        options={generalOptions}
      />
    </DiaryEntriesStack.Navigator>
  );
};

const DiaryEntries: React.FC = () => {
  const userData = getStorageUserData();
  const { userDiaryEntries, setUserDiaryEntries } = useUserDiaryEntries(
    userData.userId,
  );
  const [showAddDiaryEntryModal, setShowAddDiaryEntryModal] =
    useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [selectedDiaryEntry, setSelectedDiaryEntry] = useState<DiaryEntry>();

  return (
    <BaseScreen navTitle="Diary">
      <TouchableOpacity
        disabled={
          userDiaryEntries?.find((diaryEntry) =>
            areDatesEqual(
              timestampToDate(diaryEntry.registration.registrationDate),
              new Date(),
            ),
          ) !== undefined
        }
        onPress={() => {
          setIsUpdate(false);
          setShowAddDiaryEntryModal(true);
        }}
      >
        <Text style={GENERAL_STYLES.uiText}>Add</Text>
      </TouchableOpacity>
      <ScrollView>
        {userDiaryEntries &&
          userDiaryEntries.map((diaryEntry) => (
            <TouchableOpacity
              key={diaryEntry.id}
              onPress={() => {
                setSelectedDiaryEntry(diaryEntry);
                setTitleInput(diaryEntry.title);
                setContentInput(diaryEntry.content);
                setIsUpdate(true);
                setShowAddDiaryEntryModal(true);
              }}
            >
              <Text style={GENERAL_STYLES.uiText}>{diaryEntry.title}</Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
      <CustomModal
        visibleIndicator={showAddDiaryEntryModal}
        onRequestCloseHandler={() => setShowAddDiaryEntryModal(false)}
      >
        <TextInput
          style={GENERAL_STYLES.uiText}
          placeholder={"Title"}
          defaultValue={!isUpdate ? "" : selectedDiaryEntry!.title}
          onChange={(event) => setTitleInput(event.nativeEvent.text)}
          editable={
            !isUpdate ||
            (isUpdate &&
              areDatesEqual(
                new Date(),
                timestampToDate(
                  selectedDiaryEntry!.registration.registrationDate,
                ),
              ))
          }
        />
        <TextInput
          style={GENERAL_STYLES.uiText}
          placeholder={"Content"}
          defaultValue={!isUpdate ? "" : selectedDiaryEntry!.content}
          onChange={(event) => setContentInput(event.nativeEvent.text)}
          editable={
            !isUpdate ||
            (isUpdate &&
              areDatesEqual(
                new Date(),
                timestampToDate(
                  selectedDiaryEntry!.registration.registrationDate,
                ),
              ))
          }
        />
        <>
          {isUpdate &&
            selectedDiaryEntry &&
            areDatesEqual(
              new Date(),
              timestampToDate(selectedDiaryEntry.registration.registrationDate),
            ) && (
              <TouchableOpacity
                onPress={() => {
                  const currentDate = new Date();
                  emptyDateTime(currentDate);

                  if (!isUpdate) {
                    const diaryEntry: AddDiaryEntryRequest = {
                      title: titleInput,
                      content: contentInput,
                      publishDate: currentDate.valueOf(),
                      userId: userData.userId,
                    };
                    addUserDiaryEntry(diaryEntry)
                      .then((savedEntry) => {
                        if (savedEntry) {
                          const diaryEntries = [
                            ...userDiaryEntries,
                            savedEntry,
                          ];
                          setUserDiaryEntries(diaryEntries);
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } else {
                    const diaryEntry: UpdateDiaryEntryRequest = {
                      title: titleInput,
                      content: contentInput,
                      publishDate: currentDate.valueOf(),
                    };
                    updateUserDiaryEntry(selectedDiaryEntry.id, diaryEntry)
                      .then((updatedEntry) => {
                        if (updatedEntry) {
                          const diaryEntries = [...userDiaryEntries];
                          const indexToBeUpdated = diaryEntries.findIndex(
                            (diaryEntry) => diaryEntry.id === updatedEntry.id,
                          );
                          diaryEntries[indexToBeUpdated] = updatedEntry;
                          setUserDiaryEntries(diaryEntries);
                        }
                      })
                      .catch((err) => console.error(err));
                  }
                  setShowAddDiaryEntryModal(false);
                }}
                disabled={
                  isUpdate &&
                  selectedDiaryEntry.title === titleInput &&
                  selectedDiaryEntry.content === contentInput
                }
              >
                <Text style={GENERAL_STYLES.uiText}>Save</Text>
              </TouchableOpacity>
            )}
        </>
      </CustomModal>
    </BaseScreen>
  );
};

export default DiaryScreen;
