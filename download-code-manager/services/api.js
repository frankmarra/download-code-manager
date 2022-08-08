import axios from 'axios'
import { parseCookies } from '../helpers'
import { getCookie } from 'cookies-next'

export const BASE_URL = 'https://api.downloadcodemanager.com/api'

const Client = axios.create({ baseURL: BASE_URL })
Client.interceptors.request.use(
  (config) => {
    let cookie = getCookie('user')
    if (cookie) {
      let cookieToken = JSON.parse(cookie)
      let token = cookieToken
      if (token) {
        config.headers['authorization'] = `Bearer ${token.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Client.interceptors.response.use(
//   (config) => {
//     let cookie = getCookie('user')
//     let cookieToken = JSON.parse(cookie)
//     let token = cookieToken
//     if (token) {
//       config.headers['authorization'] = `Bearer ${token.token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
//)

export default Client
