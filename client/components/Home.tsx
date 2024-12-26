import {GENERAL_STYLES} from '../constants/general.styles'
import {HOME_STYLES} from '../constants/home.styles'
import {Button, View} from 'react-native'
import {BooksIcon} from './BooksIcon'
import {MediaIcon} from './MediaIcon'
import {GamesIcon} from './GamesIcon'
import {DiaryIcon} from './DiaryIcon'
import {ContentCard} from './ContentCard'
import {StatusBar} from './StatusBar'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {registerUser} from '../services/auth.services'
import {UserDataProvider} from '../contexts/authInfoContext'
import {setUserData} from '../services/user.services'
import {REACT_APP_GOOGLE_WEB_CLIENT_ID} from '@env'

export const Home: React.FC = () => {
  return (
    <UserDataProvider>
      <View
        style={[
          GENERAL_STYLES.generalPadding,
          GENERAL_STYLES.flexCol,
          GENERAL_STYLES.flexGrow,
        ]}>
        <Button
          title={'Sign in with Google'}
          onPress={() => {
            GoogleSignin.configure({
              webClientId: REACT_APP_GOOGLE_WEB_CLIENT_ID,
              offlineAccess: true,
              scopes: ['email'],
            })
            GoogleSignin.hasPlayServices()
              .then(hasPlayService => {
                if (hasPlayService) {
                  GoogleSignin.signIn()
                    .then(userInfo => {
                      if (userInfo.data != null) {
                        const registerUserRequest: RegisterUserRequest = {
                          username: userInfo.data.user.givenName as string,
                          providerId: userInfo.data.user.id as string,
                          providerToken: userInfo.data.idToken as string,
                        }
                        registerUser(registerUserRequest)
                          .then(response => {
                            setUserData({
                              userId: registerUserRequest.providerId,
                              idToken: registerUserRequest.providerToken,
                              authenticated: true,
                            })
                            console.log(response)
                          })
                          .catch(err => console.error(err))
                      }
                    })
                    .catch(e => {
                      console.log('ERROR IS: ' + JSON.stringify(e))
                    })
                }
              })
              .catch(e => {
                console.log('ERROR IS: ' + JSON.stringify(e))
              })
          }}
        />
        <StatusBar />
        <View style={[HOME_STYLES.contentCardContainer]}>
          <ContentCard name="books" screenName="BooksScreen" Icon={BooksIcon} />
          <ContentCard name="media" screenName="MediaScreen" Icon={MediaIcon} />
          <ContentCard name="games" screenName="GamesScreen" Icon={GamesIcon} />
          <ContentCard name="diary" screenName="DiaryScreen" Icon={DiaryIcon} />
        </View>
      </View>
    </UserDataProvider>
  )
}
