import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity } from "react-native";
import { BooksIcon } from "./BooksIcon";
import { GENERAL_STYLES } from "../constants/general.styles";

type BookStackParamList = {
  Books: undefined;
  Book: { id: string; title: string };
};

interface BookCardProps {
  id: string;
  title: string;
  author?: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
}: BookCardProps) => {
  const navigation: NativeStackNavigationProp<BookStackParamList> =
    useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("Book", { id, title });
      }}
    >
      <BooksIcon />
      <Text style={GENERAL_STYLES.uiText}>{title}</Text>
      {author != undefined && (
        <Text style={GENERAL_STYLES.uiText}>{author}</Text>
      )}
    </TouchableOpacity>
  );
};
