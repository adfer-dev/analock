import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Text, TouchableOpacity, View } from "react-native";
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
      style={{
        maxWidth: "80%",
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 10,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: 10,
        maxHeight: "40%",
        height: "100%",
        padding: 20,
      }}
      onPressIn={() => {
        navigation.push("Book", { id, title });
      }}
    >
      <BooksIcon />
      <Text style={(GENERAL_STYLES.uiText, { fontWeight: "bold" })}>
        {title}
      </Text>
      {author != undefined && (
        <Text style={(GENERAL_STYLES.uiText, { fontStyle: "italic" })}>
          {author}
        </Text>
      )}
    </TouchableOpacity>
  );
};
