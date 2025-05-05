import { GENERAL_STYLES } from "../constants/general.styles";
import { BackHandler, FlatList, View } from "react-native";
import { ContentCard, ContentCardProps } from "./ContentCard";
import { StatusBar } from "./StatusBar";
import { useContext, useEffect, useState } from "react";
import { Login } from "./Login";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";
import { getStorageUserData } from "../services/storage.services";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";
import { DiaryIcon } from "./icons/DiaryIcon";
import { GamesIcon } from "./icons/GamesIcon";
import { BooksIcon } from "./icons/BooksIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { SettingsContext } from "../contexts/settingsContext";

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
  const wiped = useWipePeriodicContent();
  const userSettings = useContext(SettingsContext)?.settings;

  const homeSections: ContentCardProps[] = [
    {
      name: homeTranslations!.books,
      screenName: "BooksScreen",
      Icon: BooksIcon,
    },
    {
      name: homeTranslations!.games,
      screenName: "GamesScreen",
      Icon: GamesIcon,
    },
    {
      name: homeTranslations!.diary,
      screenName: "DiaryScreen",
      Icon: DiaryIcon,
    },
    {
      name: homeTranslations!.profile,
      screenName: "MySpaceScreen",
      Icon: ProfileIcon,
    },
  ];
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

  return authenticated || !userSettings?.general.enableOnlineFeatures ? (
    <BaseScreen>
      <View style={{ marginTop: 10, gap: 20 }}>
        <StatusBar refresh={refresh || wiped} />
        <FlatList
          numColumns={2}
          data={homeSections}
          keyExtractor={(homeSection) => homeSection.screenName}
          renderItem={({ item, index }) => (
            <ContentCard
              name={item.name}
              screenName={item.screenName}
              Icon={item.Icon}
              paddingRight={index % 2 === 0 ? 10 : 0}
              paddingLeft={index % 2 !== 0 ? 10 : 0}
            />
          )}
          contentContainerStyle={[GENERAL_STYLES.flexGap]}
          removeClippedSubviews={false}
        />
      </View>
    </BaseScreen>
  ) : (
    <Login setAuthenticated={setAuthenticated} />
  );
};

export default Home;
