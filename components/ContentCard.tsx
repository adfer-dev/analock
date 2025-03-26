import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GENERAL_STYLES } from "../constants/general.styles";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  Home: undefined;
  BooksScreen: undefined;
  MySpaceScreen: undefined;
  GamesScreen: undefined;
  DiaryScreen: undefined;
};

interface ContentCardProps {
  name: string;
  screenName: keyof RootStackParamList;
  Icon: React.FC;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  name,
  screenName,
  Icon,
}: ContentCardProps) => {
  const navigation: NativeStackNavigationProp<RootStackParamList> =
    useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(screenName);
      }}
    >
      <View>
        <Icon />
        <Text style={[GENERAL_STYLES.textCenter]}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};
