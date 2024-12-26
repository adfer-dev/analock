import axios from 'axios'
import {useContext} from 'react'
import {getAccessToken, setAccessToken} from '../constants/auth'
import {refreshToken} from './auth.services'
import {UserDataContext} from '../contexts/authInfoContext'
import {setUserData} from './user.services'

export const AXIOS_INSTANCE = axios.create()

export const API_ERRORS = {
  TOKEN_EXPIRED: 'token expired',
  COOKIE_NOT_SET: 'refreshToken cookie must be set',
}

AXIOS_INSTANCE.interceptors.request.use(async request => {
  const allowedUrls = /\/api\/v1\/auth\/*/g
  if (request.url !== undefined && !allowedUrls.test(request.url)) {
    const accessToken = getAccessToken()
    if (accessToken != null) {
      request.headers.Authorization = `Bearer ${accessToken}`
    } else {
      try {
        const tokenPair = await refreshToken()
        if (tokenPair !== undefined) {
          setAccessToken(tokenPair.accessToken)
          request.headers.Authorization = `Bearer ${tokenPair.accessToken}`
        }
      } catch (err) {
        const error = err as APIError
        console.log(error.description)

        if (
          error.description === API_ERRORS.TOKEN_EXPIRED ||
          error.description === API_ERRORS.COOKIE_NOT_SET
        ) {
          const authInfoContext = useContext(UserDataContext)

          if (authInfoContext != null) {
            const userData = {...authInfoContext.userData}
            // set user data's authenticated param to false
            // this will make the app to ask the user to log in again.
            userData.authenticated = false
            authInfoContext.setUserData(userData)
            console.error(err)
          }
        }
      }
    }
  }

  return request
})

/*
AXIOS_INSTANCE.interceptors.response.use(
  response => {
    return response
  }
  ,
  error => {
    if (error.request.status === 401) {
      refreshToken()
        .then(tokenPair => {
          if (tokenPair !== undefined) {
            setAccessToken(tokenPair.refreshToken)
          }
        })
        .catch(err => { console.log(err) })
    }
  }
) */
