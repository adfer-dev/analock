interface User {
  id: number;
  email: string;
  userName: string;
  role: number;
}

interface UserData {
  authenticated: boolean;
  userId: number;
  idToken?: string;
  lastOpenedAppDate?: number;
  lastOpenedAppWeek?: number;
}
