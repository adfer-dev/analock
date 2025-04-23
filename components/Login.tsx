import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Button, View } from "react-native";
import { authenticateUser } from "../services/auth.services";
import {
  getStorageUserData,
  setStorageAuthData,
  setStorageUserData,
} from "../services/storage.services";
import { setAccessToken } from "../constants/auth.constants";
import { GENERAL_STYLES } from "../constants/general.styles";
import { useContext } from "react";
import { UserDataContext } from "../contexts/userDataContext";
import { getUserByEmail } from "../services/user.services";

interface LoginProps {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login: React.FC<LoginProps> = ({ setAuthenticated }) => {
  const userDataContext = useContext(UserDataContext);
  return (
    <View style={(GENERAL_STYLES.flexCol, GENERAL_STYLES.alignCenter)}>
      <Button
        title={"Sign in with Google"}
        onPress={() => {
          GoogleSignin.configure({
            webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
            offlineAccess: true,
            scopes: ["email"],
          });
          GoogleSignin.hasPlayServices()
            .then((hasPlayService) => {
              if (hasPlayService) {
                GoogleSignin.signIn()
                  .then((userInfo) => {
                    if (userInfo.data != null) {
                      const registerUserRequest: AuthenticateUserRequest = {
                        email: userInfo.data.user.email,
                        username: userInfo.data.user.givenName as string,
                        providerId: userInfo.data.user.id as string,
                        providerToken: userInfo.data.idToken as string,
                      };
                      authenticateUser(registerUserRequest)
                        .then((response) => {
                          // get user by email and save user's id on storage'
                          getUserByEmail(registerUserRequest.email)
                            .then((user) => {
                              const savedUserData = getStorageUserData();
                              savedUserData.userId = user!.id;
                              savedUserData.authenticated = true;
                              setStorageUserData(savedUserData);
                              setAuthenticated(true);
                              userDataContext?.setUserData(savedUserData);
                            })
                            .catch((err) => {
                              console.error(err);
                            });
                          // save refresh token on storage
                          const authData: StorageAuthData = {
                            refreshToken: response!.refreshToken,
                          };
                          setStorageAuthData(authData);
                          // set local access token variable
                          setAccessToken(response!.accessToken);
                        })
                        .catch((err) => console.error(err));
                    }
                  })
                  .catch((e) => {
                    console.log("ERROR IS: " + JSON.stringify(e));
                  });
              }
            })
            .catch((e) => {
              console.log("ERROR IS: " + JSON.stringify(e));
            });
        }}
      />
    </View>
  );
};
