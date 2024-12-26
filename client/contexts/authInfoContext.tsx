import {createContext, useState, type ReactNode, useEffect} from 'react'
import {getStorageUserData, setStorageUserData} from '../services/user.services'

export const UserDataContext = createContext<UserDataContext | null>(null)

export interface AuthInfo {
  authenticated: boolean
}

interface UserDataContext {
  userData: UserData
  setUserData: React.Dispatch<React.SetStateAction<UserData>>
}

interface AuthInfoProviderProps {
  children: ReactNode
}

export const UserDataProvider: React.FC<AuthInfoProviderProps> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>(getStorageUserData())

  //every time the context data is updated,
  //update the locally stored user data aswell.
  useEffect(() => {
    setStorageUserData(userData)
  }, [userData])

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
      }}>
      {children}
    </UserDataContext.Provider>
  )
}
