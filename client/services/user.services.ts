import {MMKV, Mode} from 'react-native-mmkv'
import {APP_DOCUMENTS_PATH} from './download.services'
import {REACT_APP_LOCAL_STORAGE_KEY} from '@env'

const storageInstance = new MMKV({
  id: `user-data-storage`,
  path: APP_DOCUMENTS_PATH,
  encryptionKey: REACT_APP_LOCAL_STORAGE_KEY,
  mode: Mode.SINGLE_PROCESS,
})

const USER_DATA = 'userData'

export function getUserData(): UserData | null {
  let userData: UserData | null = null
  const userDataString = storageInstance.getString(USER_DATA)

  if (userDataString !== undefined) {
    userData = JSON.parse(userDataString) as UserData
  } else {
    console.log('No user data was saved')
  }

  return userData
}

export function setUserData(userData: UserData): void {
  storageInstance.set(USER_DATA, JSON.stringify(userData))
}
