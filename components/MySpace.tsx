import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { generalOptions } from "./Home";
import { BaseScreen } from "./BaseScreen";
import Settings from "./Settings";
import { TranslationsContext } from "../contexts/translationsContext";
import { useNavigation } from "@react-navigation/native";
import { CalendarScreen } from "./RegistrationsCalendar";

export type MySpaceStackParamList = {
  MySpace: undefined;
  Settings: undefined;
};

const MySpaceScreen = () => {
  const translations = useContext(TranslationsContext)?.translations;
  const MySpaceStack = createNativeStackNavigator();
  return (
    <MySpaceStack.Navigator initialRouteName="MySpace">
      <MySpaceStack.Screen
        name="MySpace"
        component={MySpace}
        options={{
          ...generalOptions,
          headerTitle: translations?.home.profile,
        }}
      />
      <MySpaceStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          ...generalOptions,
          headerTitle: translations?.profile.calendar,
        }}
      />
      <MySpaceStack.Screen
        name="Settings"
        component={Settings}
        options={{
          ...generalOptions,
          headerTitle: translations?.profile.settings,
        }}
      />
    </MySpaceStack.Navigator>
  );
};

function MySpace() {
  const navigation = useNavigation();
  const profileTranslations =
    useContext(TranslationsContext)?.translations.profile;
  return (
    <BaseScreen>
      <TouchableOpacity
        onPressIn={() => {
          navigation.push("Calendar");
        }}
      >
        <Text>{profileTranslations?.calendar}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPressIn={() => {
          navigation.push("Settings");
        }}
      >
        <Text>{profileTranslations?.settings}</Text>
      </TouchableOpacity>
    </BaseScreen>
  );
}

export default MySpaceScreen;
