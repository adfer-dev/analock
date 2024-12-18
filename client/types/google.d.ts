interface GoogleLoginResponse {
  type: string
  data: GoogleLoginResponseData
}

interface GoogleLoginResponseData {
  scopes: string[]
  serverAuthCode: string
  idToken: string
  user: GoogleLoginResponseUser
}

interface GoogleLoginResponseUser {
  photo: string
  givenName: string
  familyName: string
  email: string
  name: string
  id: string
}
