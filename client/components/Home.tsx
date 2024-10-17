import {GENERAL_STYLES} from '../constants/general.styles'
import {HOME_STYLES} from '../constants/home.styles'
import {View} from 'react-native'
import {BooksIcon} from './BooksIcon'
import {MediaIcon} from './MediaIcon'
import {GamesIcon} from './GamesIcon'
import {DiaryIcon} from './DiaryIcon'
import {ContentCard} from './ContentCard'
import {StatusBar} from './StatusBar'

export const Home: React.FC = () => {
  return (
    <View
      style={[
        GENERAL_STYLES.generalPadding,
        GENERAL_STYLES.flexCol,
        GENERAL_STYLES.flexGrow,
      ]}>
      <StatusBar />
      <View style={[HOME_STYLES.contentCardContainer]}>
        <ContentCard name="books" screenName="BooksScreen" Icon={BooksIcon} />
        <ContentCard name="media" screenName="MediaScreen" Icon={MediaIcon} />
        <ContentCard name="games" screenName="GamesScreen" Icon={GamesIcon} />
        <ContentCard name="diary" screenName="DiaryScreen" Icon={DiaryIcon} />
      </View>
    </View>
  )
}
