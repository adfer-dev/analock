import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { GamesIcon } from "./icons/GamesIcon";

interface GameCardProps {
  name: string;
  component: React.JSX.Element;
}

type GameStackParamList = {
  Games: undefined;
  Game: { name: string; component: React.JSX.Element };
};

export const GameCard: React.FC<GameCardProps> = ({ name, component }) => {
  const navigation: NativeStackNavigationProp<GameStackParamList> =
    useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("Game", { name, component });
      }}
    >
      <GamesIcon />
      <Text style={GENERAL_STYLES.uiText}>{name}</Text>
    </TouchableOpacity>
  );
};
