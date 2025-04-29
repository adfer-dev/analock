import { GENERAL_STYLES } from "../constants/general.styles";
import { HOME_STYLES } from "../constants/home.styles";
import { BackHandler, View } from "react-native";
import { BooksIcon } from "./BooksIcon";
import { MediaIcon } from "./MediaIcon";
import { GamesIcon } from "./GamesIcon";
import { DiaryIcon } from "./DiaryIcon";
import { ContentCard } from "./ContentCard";
import { StatusBar } from "./StatusBar";
import { useContext, useEffect, useState } from "react";
import { Login } from "./Login";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";
import { getStorageUserData } from "../services/storage.services";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";

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
  const refresh = useIsFocused();
  const homeTranslations = useContext(TranslationsContext)?.translations.home;
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
    <BaseScreen>
      <View style={{ marginTop: 10, gap: 20 }}>
        <StatusBar refresh={refresh} />
        <View>
          <View style={[HOME_STYLES.row]}>
            <ContentCard
              name={homeTranslations.books}
              screenName="BooksScreen"
              Icon={BooksIcon}
            />
            <ContentCard
              name={homeTranslations.games}
              screenName="GamesScreen"
              Icon={GamesIcon}
            />
          </View>
          <View style={[HOME_STYLES.row]}>
            <ContentCard
              name={homeTranslations.diary}
              screenName="DiaryScreen"
              Icon={DiaryIcon}
            />
            <ContentCard
              name={homeTranslations.profile}
              screenName="MySpaceScreen"
              Icon={MediaIcon}
            />
          </View>
        </View>
      </View>
    </BaseScreen>
  ) : (
    <Login setAuthenticated={setAuthenticated} />
  );
};

export default Home;
