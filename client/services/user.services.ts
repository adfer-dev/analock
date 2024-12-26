import {MMKV, Mode} from 'react-native-mmkv'
import {APP_DOCUMENTS_PATH} from './download.services'
import {REACT_APP_LOCAL_STORAGE_KEY} from '@env'

const storageInstance = new MMKV({
  id: `user-data-storage`,
  path: APP_DOCUMENTS_PATH,
  encryptionKey: REACT_APP_LOCAL_STORAGE_KEY,
  mode: Mode.SINGLE_PROCESS,
})

const USER_DATA_STORAGE_KEY = 'userData'
const DEFAULT_USER_DATA: UserData = {
  authenticated: false,
}

export function getStorageUserData(): UserData {
  let userData: UserData
  const userDataString = storageInstance.getString(USER_DATA_STORAGE_KEY)

  if (userDataString !== undefined) {
    userData = JSON.parse(userDataString) as UserData
    console.log(`Loaded user data: ${userDataString}`)
  } else {
    userData = DEFAULT_USER_DATA
    console.log('No user data was saved. Loading default data...')
  }

  return userData
}

export function setStorageUserData(userData: UserData): void {
  storageInstance.set(USER_DATA_STORAGE_KEY, JSON.stringify(userData))
}
