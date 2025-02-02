import {GENERAL_STYLES} from '../constants/general.styles'
import {HOME_STYLES} from '../constants/home.styles'
import {Alert, BackHandler, View} from 'react-native'
import {BooksIcon} from './BooksIcon'
import {MediaIcon} from './MediaIcon'
import {GamesIcon} from './GamesIcon'
import {DiaryIcon} from './DiaryIcon'
import {ContentCard} from './ContentCard'
import {StatusBar} from './StatusBar'
import {useContext, useEffect} from 'react'
import {UserDataContext} from '../contexts/userDataContext'
import {Login} from './Login'
import {
  deleteSelectedBooks,
  deleteStorageBookData,
  getStorageUserData,
  setStorageUserData,
} from '../services/storage.services'
import {compareDates, getWeekOfYear} from '../utils/date.utils'
import {useNavigation} from '@react-navigation/native'

export const Home: React.FC = () => {
  const userDataContext = useContext(UserDataContext)
  const navigation = useNavigation()

  // hook to handle dialy and weekly wipes
  useEffect(() => {
    const userData = getStorageUserData()

    // if user opened app on a different day than previous, reset daily progress.
    if (userData.lastOpenedAppDate) {
      const currentDate: Date = new Date()
      const lastDate: Date = new Date(userData.lastOpenedAppDate)

      // execute daily wipe
      if (compareDates(lastDate, currentDate)) {
        deleteStorageBookData()
      }

      // execute weekly wipe
      if (getWeekOfYear(lastDate) !== getWeekOfYear(currentDate)) {
        deleteSelectedBooks()
      }
    }

    // update last oppened date
    userData.lastOpenedAppDate = new Date().toString()
    setStorageUserData(userData)
  }, [])

  // hook to handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack()
        } else {
          BackHandler.exitApp()
        }
        return true
      },
    )

    return () => {
      backHandler.remove()
    }
  }, [])

  return (
    userDataContext?.userData &&
    (userDataContext.userData.authenticated ? (
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
    ) : (
      <Login />
    ))
  )
}
