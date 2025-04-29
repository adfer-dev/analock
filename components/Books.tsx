import { BaseScreen } from "./BaseScreen";
import { BookCard } from "./BookCard";
import {
  useOpenLibraryBooksBySubject,
  useOpenLibraryBooksBySubjectResult,
} from "../hooks/useOpenLibraryBooksBySubject";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookDetailScreen from "./Book";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { downloadAndUnzipEpub } from "../services/download.services";
import { generalOptions } from "./Home";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";

const BOOKS_NUMBER = 2;

const BooksScreen = () => {
  const BooksStack = createNativeStackNavigator();
  const translations = useContext(TranslationsContext)?.translations.home;
  return (
    <BooksStack.Navigator initialRouteName="Books">
      <BooksStack.Screen
        name="Books"
        component={Books}
        options={{ ...generalOptions, headerTitle: translations?.books }}
      />
      <BooksStack.Screen
        name="Book"
        component={BookDetailScreen}
        options={({ route }) => ({
          ...generalOptions,
          headerTitle: route.params?.title as string,
        })}
      />
    </BooksStack.Navigator>
  );
};

const Books: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const res: useOpenLibraryBooksBySubjectResult = useOpenLibraryBooksBySubject({
    subject: "science",
    sort: "rating desc",
    limit: BOOKS_NUMBER,
  });

  const downloadBooks = async () => {
    if (res.openLibraryBooksBySubject) {
      for (const book of res.openLibraryBooksBySubject) {
        await downloadAndUnzipEpub(book);
        setTimeout(() => {}, 1000);
      }
    }
  };

  useEffect(() => {
    if (res.openLibraryBooksBySubject && loading) {
      downloadBooks()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [res]);

  return (
    <BaseScreen>
      {loading && (
        <View>
          <ActivityIndicator size="large" color="black" />
          <Text
            style={{
              textAlign: "center",
              color: "black",
            }}
          >
            {
              "We are downloading the required content.\nYou can minimize the app and check the progress on the notification bar."
            }
          </Text>
        </View>
      )}
      {!loading && (
        <View
          style={[
            GENERAL_STYLES.flexCol,
            GENERAL_STYLES.alignCenter,
            GENERAL_STYLES.flexGrow,
            { gap: 30 },
          ]}
        >
          {res.openLibraryBooksBySubject?.map((book) => (
            <BookCard
              key={book.identifier}
              id={book.identifier}
              title={book.title}
              author={book.creator}
            />
          ))}
        </View>
      )}
    </BaseScreen>
  );
};

export default BooksScreen;
