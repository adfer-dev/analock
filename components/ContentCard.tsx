import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GENERAL_STYLES } from "../constants/general.styles";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HOME_STYLES } from "../constants/home.styles";

type RootStackParamList = {
  Home: undefined;
  BooksScreen: undefined;
  MySpaceScreen: undefined;
  GamesScreen: undefined;
  DiaryScreen: undefined;
};

export interface ContentCardProps {
  name: string;
  screenName: keyof RootStackParamList;
  Icon: React.FC;
  paddingLeft?: number;
  paddingRight?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  name,
  screenName,
  Icon,
  paddingRight,
  paddingLeft,
}: ContentCardProps) => {
  const navigation: NativeStackNavigationProp<RootStackParamList> =
    useNavigation();
  return (
    <TouchableOpacity
      onPressIn={() => {
        navigation.navigate(screenName);
      }}
      style={[
        GENERAL_STYLES.flexGrow,
        { paddingRight: paddingRight },
        { paddingLeft: paddingLeft },
      ]}
    >
      <View style={[HOME_STYLES.contentCard]}>
        <Icon />
        <Text
          style={[
            GENERAL_STYLES.uiText,
            GENERAL_STYLES.textCenter,
            HOME_STYLES.contentCardText,
          ]}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
