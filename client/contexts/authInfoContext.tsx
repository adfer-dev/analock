import {createContext, useState, type ReactNode} from 'react'

export const AuthInfoContext = createContext<AuthInfoContext | null>(null)

export interface AuthInfo {
  authenticated: boolean
}

interface AuthInfoContext {
  userData: AuthInfo
  setUserData: React.Dispatch<React.SetStateAction<AuthInfo>>
}

interface AuthInfoProviderProps {
  children: ReactNode
}

export const AuthInfoProvider: React.FC<AuthInfoProviderProps> = ({
  children,
}) => {
  const [userData, setUserData] = useState<AuthInfo>({authenticated: true})

  return (
    <AuthInfoContext.Provider
      value={{
        userData,
        setUserData,
      }}>
      {children}
    </AuthInfoContext.Provider>
  )
}
