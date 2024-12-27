import {GoogleSignin} from '@react-native-google-signin/google-signin'
import {Button, View} from 'react-native'
import {registerUser} from '../services/auth.services'
import {REACT_APP_GOOGLE_WEB_CLIENT_ID} from '@env'
import {GENERAL_STYLES} from '../constants/general.styles'
import {useContext} from 'react'
import {UserDataContext} from '../contexts/authInfoContext'

export const Login: React.FC = () => {
  const userDataContext = useContext(UserDataContext)
  return (
    <View style={(GENERAL_STYLES.flexCol, GENERAL_STYLES.alignCenter)}>
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
                          userDataContext?.setUserData({
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
    </View>
  )
}
