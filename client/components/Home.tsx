import { GENERAL_STYLES } from "@/constants/general.styles"
import { HOME_STYLES } from "@/constants/home.styles"
import { View } from "react-native"
import { BooksIcon } from "./BooksIcon"
import { MediaIcon } from "./MediaIcon"
import { GamesIcon } from "./GamesIcon"
import { DiaryIcon } from "./DiaryIcon"
import { ContentCard } from "./ContentCard"
import { StatusBar } from "./StatusBar"
export const Home: React.FC = () => {
  return (
    <View style={[GENERAL_STYLES.generalPadding, GENERAL_STYLES.flexCol]}>
      <StatusBar />
      <View style={[HOME_STYLES.contentCardContainer]}>
        <ContentCard name="books" linkPath="/books" Icon={BooksIcon} />
        <ContentCard name="media" linkPath="/media" Icon={MediaIcon} />
        <ContentCard name="games" linkPath="/games" Icon={GamesIcon} />
        <ContentCard name="diary" linkPath="/diary" Icon={DiaryIcon} />
      </View>
    </View>
  )
}
