import { GENERAL_STYLES } from "../constants/general.styles";
import { HOME_STYLES } from "../constants/home.styles";
import { BackHandler, View } from "react-native";
import { BooksIcon } from "./BooksIcon";
import { MediaIcon } from "./MediaIcon";
import { GamesIcon } from "./GamesIcon";
import { DiaryIcon } from "./DiaryIcon";
import { ContentCard } from "./ContentCard";
import { StatusBar } from "./StatusBar";
import { useEffect, useState } from "react";
import { Login } from "./Login";
import { useNavigation } from "@react-navigation/native";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";
import { getStorageUserData } from "../services/storage.services";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const generalOptions: NativeStackNavigationOptions = {
  headerTitleAlign: "center",
  headerTitleStyle: GENERAL_STYLES.navBar,
  headerStyle: GENERAL_STYLES.backgroundColor,
  headerShadowVisible: false,
};

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [authenticated, setAuthenticated] = useState<boolean>(
    getStorageUserData().authenticated,
  );
  useWipePeriodicContent();

  // hook to handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  return authenticated ? (
    <View
      style={[
        GENERAL_STYLES.generalPadding,
        GENERAL_STYLES.flexGrow,
        GENERAL_STYLES.flexCol,
        GENERAL_STYLES.backgroundColor,
        { gap: 30 },
      ]}
    >
      <StatusBar />
      <View>
        <View style={[HOME_STYLES.row]}>
          <ContentCard name="Books" screenName="BooksScreen" Icon={BooksIcon} />
          <ContentCard name="Games" screenName="GamesScreen" Icon={GamesIcon} />
        </View>
        <View style={[HOME_STYLES.row]}>
          <ContentCard name="Diary" screenName="DiaryScreen" Icon={DiaryIcon} />
          <ContentCard
            name="Profile"
            screenName="MySpaceScreen"
            Icon={MediaIcon}
          />
        </View>
      </View>
    </View>
  ) : (
    <Login setAuthenticated={setAuthenticated} />
  );
};

export default Home;
