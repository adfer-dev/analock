import {useEffect, useState} from 'react'
import {registerUser} from '../services/auth.services'

interface useRegisterUserResponse {
  registerUserResponse: AuthResponse | undefined
  setRegisterUserResponse: React.Dispatch<
    React.SetStateAction<AuthResponse | undefined>
  >
}

export function useRegisterUser(
  request: RegisterUserRequest,
): useRegisterUserResponse {
  const [registerUserResponse, setRegisterUserResponse] =
    useState<AuthResponse>()

  useEffect(() => {
    registerUser(request)
      .then(response => {
        if (response != null) {
          setRegisterUserResponse(response)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return {registerUserResponse, setRegisterUserResponse}
}
