import { BaseScreen } from "./BaseScreen";
import { BookCard } from "./BookCard";
import {
  useOpenLibraryBooksBySubject,
  useOpenLibraryBooksBySubjectResult,
} from "../hooks/useOpenLibraryBooksBySubject";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BookDetailScreen from "./Book";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { downloadAndUnzipEpub } from "../services/download.services";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorScreen } from "./ErrorScreen";
import { getStorageUserData } from "../services/storage.services";
import { BookSubjectSelection } from "./BookSubjectSelection";
import { NavigationHeader } from "./NavigationHeader";

const BOOK_NUMBER = 2;

export enum InternetArchiveSubject {
  FICTION = "Fiction",
  NON_FICTION = "Non-fiction",
  HISTORY = "History",
  SCIENCE = "Science",
  PHILOSOPHY = "Philosophy",
  RELIGION = "Religion",
  BIOGRAPHY = "Biography",
  LITERATURE = "Literature",
  ART = "Art",
  MUSIC = "Music",
  TECHNOLOGY = "Technology",
  MEDICINE = "Medicine",
  LAW = "Law",
  BUSINESS = "Business",
  POLITICS = "Politics",
  EDUCATION = "Education",
  MATHEMATICS = "Mathematics",
  COMPUTER_SCIENCE = "Computer Science",
  SOCIAL_SCIENCES = "Social Sciences",
  PSYCHOLOGY = "Psychology",
  GEOGRAPHY = "Geography",
  COOKING = "Cooking",
  TRAVEL = "Travel",
  POETRY = "Poetry",
  DRAMA = "Drama",
}

const BooksScreen = () => {
  const BooksStack = createNativeStackNavigator();
  const translations = useContext(TranslationsContext)?.translations.home;
  return (
    <BooksStack.Navigator
      initialRouteName="Books"
      screenOptions={{ header: (props) => <NavigationHeader {...props} /> }}
    >
      <BooksStack.Screen
        name="Books"
        component={BooksWrapper}
        options={{ headerTitle: translations?.books }}
      />
      <BooksStack.Screen
        name="Book"
        component={BookDetailScreen}
        options={({ route }) => ({
          headerTitle: route.params?.title as string,
        })}
      />
    </BooksStack.Navigator>
  );
};

const BooksWrapper: React.FC = () => {
  const userData = getStorageUserData();
  const [subject, setSubject] = useState<InternetArchiveSubject>();
  const [shownSubjects, setShownSubjects] = useState<InternetArchiveSubject[]>(
    [],
  );
  const MAX_SUBJECTS = 4;

  // hook to show subject selection
  useEffect(() => {
    if (userData.selectedBookSubject !== undefined) {
      setSubject(userData.selectedBookSubject as InternetArchiveSubject);
    } else {
      const subjectValues = Object.values(InternetArchiveSubject);
      const selectedSubjects: InternetArchiveSubject[] = [];

      for (let i = 0; i < MAX_SUBJECTS; i++) {
        const randomIndex = Math.floor(Math.random() * subjectValues.length);
        selectedSubjects.push(subjectValues[randomIndex]);
        subjectValues.splice(randomIndex, 1)
      }
      setShownSubjects(selectedSubjects);
    }
  }, []);

  return subject ? (
    <Books subject={subject.valueOf()} />
  ) : (
    <BookSubjectSelection
      shownSubjects={shownSubjects}
      setSubject={setSubject}
      userData={userData}
    />
  );
};

interface BooksProps {
  subject: string;
}

const Books: React.FC<BooksProps> = ({ subject }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const openLibraryResponse: useOpenLibraryBooksBySubjectResult = useOpenLibraryBooksBySubject({
    subject,
    sort: "rating desc",
    limit: BOOK_NUMBER,
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const translationsContext = useContext(TranslationsContext);

  /**
   * Aux function to perform download of books returned by Internet Archive response.
   */
  async function downloadBooks(): Promise<void> {
    if (openLibraryResponse.openLibraryBooksBySubject) {
      const bookDownloadPromises: Promise<void>[] = []
      for (const book of openLibraryResponse.openLibraryBooksBySubject) {
        bookDownloadPromises.push(downloadAndUnzipEpub(book))
      }
      try {
        await Promise.all(bookDownloadPromises)
      } catch {
        setErrorMessage(
          translationsContext?.translations.errors.genericNetworkError,
        );
        setLoading(false);
      }
    }
  };

  // Hook to start downloading process with the books given by Internet Archive  
  useEffect(() => {
    if (loading) {
      if (!openLibraryResponse.error) {
        if (openLibraryResponse.openLibraryBooksBySubject.length > 0) {
          downloadBooks()
            .then(() => {
              setLoading(false);
            })
            .catch(() => {
              setErrorMessage(
                translationsContext?.translations.errors.genericNetworkError,
              );
              setLoading(false);
            });
        }
      } else {
        setErrorMessage(
          translationsContext?.translations.errors.genericNetworkError,
        );
        setLoading(false);
      }
    }
  }, [openLibraryResponse]);

  return (
    translationsContext && (
      <BaseScreen>
        {loading && !errorMessage && (
          <LoadingIndicator
            text={translationsContext.translations.books.donwloadingContent}
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
              openLibraryResponse.openLibraryBooksBySubject?.map((book) => (
                <BookCard
                  key={book.identifier}
                  id={book.identifier}
                  title={book.title}
                  author={book.creator}
                />
              ))
            ) : (
              <ErrorScreen errorText={errorMessage} />
            )}
          </View>
        )}
      </BaseScreen>
    )
  );
};

export default BooksScreen;
