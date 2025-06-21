import { FlatList } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { setStorageUserData } from "../services/storage.services";
import { GENERAL_STYLES } from "../constants/general.styles";
import { CardComponent } from "./CardComponent";
import { InternetArchiveSubject } from "./Books";
import { useContext } from "react";
import { TranslationsContext } from "../contexts/translationsContext";

interface BookSubjectSelectionProps {
  shownSubjects: InternetArchiveSubject[];
  userData: UserData;
  setSubject: React.Dispatch<
    React.SetStateAction<InternetArchiveSubject | undefined>
  >;
}

export const BookSubjectSelection: React.FC<BookSubjectSelectionProps> = ({
  shownSubjects,
  userData,
  setSubject,
}) => {
  const translationsContext = useContext(TranslationsContext);

  // Aux function to get translation from subject
  function getSubjectTranslation(subject: InternetArchiveSubject): string {
    const enumKey = Object.keys(InternetArchiveSubject).find(
      (key) =>
        InternetArchiveSubject[key as keyof typeof InternetArchiveSubject] ===
        subject,
    );

    return (
      translationsContext?.translations.bookSubjects[
        enumKey as keyof typeof InternetArchiveSubject
      ] || subject
    );
  }
  return (
    <BaseScreen>
      <FlatList
        numColumns={2}
        data={shownSubjects}
        keyExtractor={(subject) => subject.valueOf()}
        renderItem={({ item, index }) => (
          <CardComponent
            label={getSubjectTranslation(item)}
            onPress={() => {
              const updatedUserData = { ...userData };
              updatedUserData.selectedBookSubject = item.valueOf();
              setStorageUserData(updatedUserData);
              setSubject(item);
            }}
            paddingLeft={index % 2 !== 0 ? 10 : 0}
            paddingRight={index % 2 === 0 ? 10 : 0}
          />
        )}
        contentContainerStyle={[
          GENERAL_STYLES.flexGap,
          GENERAL_STYLES.flexGrow,
        ]}
        removeClippedSubviews={false}
      />
    </BaseScreen>
  );
};
