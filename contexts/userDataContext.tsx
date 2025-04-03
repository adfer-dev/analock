import { createContext, useState, type ReactNode } from "react";
import { getStorageUserData } from "../services/storage.services";

export const UserDataContext = createContext<UserDataContext | null>(null);

export interface AuthInfo {
  authenticated: boolean;
}

interface UserDataContext {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

interface AuthInfoProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<AuthInfoProviderProps> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>(getStorageUserData());

  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
