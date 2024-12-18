interface RegisterUserRequest {
  username: string
  providerId: string
  providerToken: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
}
