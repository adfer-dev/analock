import { GENERAL_STYLES } from "../constants/general.styles";
import { HOME_STYLES } from "../constants/home.styles";
import { BackHandler, View } from "react-native";
import { BooksIcon } from "./BooksIcon";
import { MediaIcon } from "./MediaIcon";
import { GamesIcon } from "./GamesIcon";
import { DiaryIcon } from "./DiaryIcon";
import { ContentCard } from "./ContentCard";
import { StatusBar } from "./StatusBar";
import { useContext, useEffect } from "react";
import { UserDataContext } from "../contexts/userDataContext";
import { Login } from "./Login";
import { useNavigation } from "@react-navigation/native";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";

export const Home: React.FC = () => {
  const userDataContext = useContext(UserDataContext);
  const navigation = useNavigation();
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

  return (
    userDataContext?.userData &&
    (userDataContext.userData.authenticated ? (
      <View
        style={[
          GENERAL_STYLES.generalPadding,
          GENERAL_STYLES.flexCol,
          GENERAL_STYLES.flexGrow,
        ]}
      >
        <StatusBar />
        <View style={[HOME_STYLES.contentCardContainer]}>
          <ContentCard name="Books" screenName="BooksScreen" Icon={BooksIcon} />
          <ContentCard name="Games" screenName="GamesScreen" Icon={GamesIcon} />
          <ContentCard name="Diary" screenName="DiaryScreen" Icon={DiaryIcon} />
          <ContentCard
            name="My Space"
            screenName="MySpaceScreen"
            Icon={MediaIcon}
          />
        </View>
      </View>
    ) : (
      <Login />
    ))
  );
};
