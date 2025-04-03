interface AuthenticateUserRequest {
  email: string;
  username: string;
  providerId: string;
  providerToken: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  token: string;
}

interface StorageAuthData {
  refreshToken: string;
}
