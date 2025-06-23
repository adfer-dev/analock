import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GENERAL_STYLES, grayColor, whiteColor } from "../constants/general.styles";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HOME_STYLES } from "../constants/home.styles";

export type RootStackParamList = {
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
  cardIndex: number
}

export const ContentCard: React.FC<ContentCardProps> = ({
  name,
  screenName,
  Icon,
  cardIndex
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
        {
          paddingRight: cardIndex % 2 === 0 ? 10 : 0,
          paddingLeft: cardIndex % 2 !== 0 ? 10 : 0,
        },
      ]}
    >
      <View style={[
        HOME_STYLES.contentCard,
        GENERAL_STYLES.defaultBorder,
        {
          borderTopLeftRadius: cardIndex !== 0 ? 0 : 40,
          borderTopRightRadius: cardIndex !== 1 ? 0 : 40,
          borderBottomLeftRadius: cardIndex !== 2 ? 0 : 40,
          borderBottomRightRadius: cardIndex !== 3 ? 0 : 40,
          backgroundColor: screenName !== 'MySpaceScreen' ? 'inherit' : grayColor
        }]}>
        <Icon />
        <Text
          style={[
            GENERAL_STYLES.uiText,
            GENERAL_STYLES.textBlack,
            GENERAL_STYLES.textCenter,
            HOME_STYLES.contentCardText,
            {
              color: screenName !== 'MySpaceScreen' ? 'inherit' : whiteColor
            }
          ]}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity >
  );
};
