let accessToken: string | null = null

export function setAccessToken(newToken: string): void {
  accessToken = newToken
}

export function getAccessToken(): string | null {
  return accessToken
}
