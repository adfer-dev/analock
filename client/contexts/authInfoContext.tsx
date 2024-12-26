import {createContext, useState, type ReactNode, useEffect} from 'react'
import {getUserData} from '../services/user.services'

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
  const [userData, setUserData] = useState<UserData>(getUserData()!)

  //every time the context data is updated,
  //update the locally stored user data aswell.
  useEffect(() => {
    setUserData(userData)
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
