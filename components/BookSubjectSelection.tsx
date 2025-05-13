import { FlatList } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { setStorageUserData } from "../services/storage.services";
import { GENERAL_STYLES } from "../constants/general.styles";
import { CardComponent } from "./CardComponent";
import { InternetArchiveSubject } from "./Books";

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
  return (
    <BaseScreen>
      <FlatList
        numColumns={2}
        data={shownSubjects}
        keyExtractor={(subject) => subject.valueOf()}
        renderItem={({ item, index }) => (
          <CardComponent
            label={item.valueOf()}
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
