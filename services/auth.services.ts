import {LOCAL_API_URL} from '../constants/consts'
import {AXIOS_INSTANCE} from './interceptors'

export async function registerUser(
  registerUserRequest: RegisterUserRequest,
): Promise<AuthResponse | null> {
  let response = null

  const registerResponse = await AXIOS_INSTANCE.post(
    `${LOCAL_API_URL}api/v1/auth/register`,
    registerUserRequest,
  )

  if (registerResponse.status != 200) {
    console.error(`error ${registerResponse.status}: ${registerResponse.data}`)
  }

  response = registerResponse.data as AuthResponse

  return response
}

export async function refreshToken(): Promise<AuthResponse | undefined> {
  const response: {data: AuthResponse | APIError; status: number} =
    await AXIOS_INSTANCE.get(`${LOCAL_API_URL}/auth/refresh-token`)

  if (response.status !== 200) {
    const error = response.data as APIError
    throw new Error(error.description)
  }
  return response.data as AuthResponse
}
