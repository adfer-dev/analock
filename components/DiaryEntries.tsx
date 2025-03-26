import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import DiaryEntryDetailScreen from "./DiaryEntry";
import { useUserDiaryEntries } from "../hooks/useUserDiaryEntries";
import { BaseScreen } from "./BaseScreen";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { CustomModal } from "./CustomModal";
import { addUserDiaryEntry } from "../services/diaryEntries.services";
import { emptyDateTime } from "../utils/date.utils";

const DiaryScreen = () => {
  const DiaryEntriesStack = createNativeStackNavigator();
  return (
    <DiaryEntriesStack.Navigator initialRouteName="DiaryEntries">
      <DiaryEntriesStack.Screen name="DiaryEntries" component={DiaryEntries} />
      <DiaryEntriesStack.Screen
        name="DiaryEntry"
        component={DiaryEntryDetailScreen}
      />
    </DiaryEntriesStack.Navigator>
  );
};

const DiaryEntries: React.FC = () => {
  const userDiaryEntries = useUserDiaryEntries(1);
  const [showAddDiaryEntryModal, setShowAddDiaryEntryModal] =
    useState<boolean>(false);
  const [titleInput, setTitleInput] = useState<string>("");
  const [contentInput, setContentInput] = useState<string>("");
  return (
    <BaseScreen navTitle="Diary">
      <TouchableOpacity onPress={() => setShowAddDiaryEntryModal(true)}>
        <Text>Add</Text>
      </TouchableOpacity>
      <ScrollView>
        {userDiaryEntries &&
          userDiaryEntries.map((diaryEntry) => (
            <Text key={diaryEntry.id}>{diaryEntry.title}</Text>
          ))}
      </ScrollView>
      <CustomModal
        visibleIndicator={showAddDiaryEntryModal}
        onRequestCloseHandler={() => setShowAddDiaryEntryModal(false)}
      >
        <TextInput
          placeholder="Title"
          onChange={(event) => setTitleInput(event.nativeEvent.text)}
        />
        <TextInput
          placeholder="Content"
          onChange={(event) => setContentInput(event.nativeEvent.text)}
        />

        <TouchableOpacity
          onPress={() => {
            const currentDate = new Date();
            emptyDateTime(currentDate);
            const diaryEntry: AddDiaryEntryRequest = {
              title: titleInput,
              content: contentInput,
              publishDate: currentDate.valueOf(),
              user_id: 1,
            };
            addUserDiaryEntry(diaryEntry)
              .then((savedEntry) => {
                console.log(savedEntry);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </CustomModal>
    </BaseScreen>
  );
};

export default DiaryScreen;
