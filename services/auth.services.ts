import { AXIOS_INSTANCE } from "./interceptors";
import { getStorageAuthData } from "./storage.services";

export async function authenticateUser(
  registerUserRequest: AuthenticateUserRequest,
): Promise<AuthResponse | null> {
  let response = null;

  const registerResponse = await AXIOS_INSTANCE.post(
    `${process.env.API_ROOT_URL}api/v1/auth/authenticate`,
    registerUserRequest,
  );

  if (registerResponse.status != 200) {
    console.error(`error ${registerResponse.status}: ${registerResponse.data}`);
  }

  response = registerResponse.data as AuthResponse;

  return response;
}

export async function refreshToken(): Promise<
  RefreshTokenResponse | undefined
> {
  const refreshToken = getStorageAuthData()?.refreshToken;

  if (refreshToken) {
    const response: { data: RefreshTokenResponse | APIError; status: number } =
      await AXIOS_INSTANCE.post(
        `${process.env.API_ROOT_URL}api/v1/auth/refreshToken`,
        {
          refreshToken,
        },
      );

    if (response.status !== 200) {
      const error = response.data as APIError;
      throw new Error(error.description);
    }
    return response.data as RefreshTokenResponse;
  }
}
