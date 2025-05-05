interface User {
  id: number;
  email: string;
  userName: string;
  role: number;
}

interface UserData {
  authenticated: boolean;
  userId: number;
  userName?: string;
  idToken?: string;
  lastOpenedAppDate?: number;
  lastOpenedAppWeek?: number;
}
