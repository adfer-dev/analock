import { BaseScreen } from "./BaseScreen";
import { BookCard } from "./BookCard";
import {
  useOpenLibraryBooksBySubject,
  useOpenLibraryBooksBySubjectResult,
} from "../hooks/useOpenLibraryBooksBySubject";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookDetailScreen from "./Book";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { downloadAndUnzipEpub } from "../services/download.services";
import { generalOptions } from "./Home";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";
import { LoadingIndicator } from "./LoadingIndicator";

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
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  console.log(!loading && errorMessage);

  const downloadBooks = async () => {
    if (res.openLibraryBooksBySubject) {
      for (const book of res.openLibraryBooksBySubject) {
        try {
          await downloadAndUnzipEpub(book);
        } catch {
          setErrorMessage(
            "An error has ocurred when downloading the book. Please, try again later.",
          );
          setLoading(false);
        }
        setTimeout(() => {}, 1000);
      }
    }
  };

  useEffect(() => {
    if (res.openLibraryBooksBySubject && loading) {
      if (!res.error) {
        downloadBooks()
          .then(() => {
            setLoading(false);
          })
          .catch(() => {
            setErrorMessage(res.error);
            setLoading(false);
          });
      } else {
        setErrorMessage(res.error);
        setLoading(false);
      }
    }
  }, [res]);

  return (
    <BaseScreen>
      {loading && !errorMessage && (
        <LoadingIndicator
          text={
            "We are downloading the required content.\nYou can minimize the app and check the progress on the notification bar."
          }
        />
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
          {!errorMessage ? (
            res.openLibraryBooksBySubject?.map((book) => (
              <BookCard
                key={book.identifier}
                id={book.identifier}
                title={book.title}
                author={book.creator}
              />
            ))
          ) : (
            <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack]}>
              {errorMessage}
            </Text>
          )}
        </View>
      )}
    </BaseScreen>
  );
};

export default BooksScreen;
