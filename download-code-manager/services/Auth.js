import Client from './api'

export const SignInUser = async (data) => {
  try {
    const res = await Client.post('/auth/login', data)

    return res.data
  } catch (error) {
    return 'ERROR'
  }
}

export const RegisterUser = async (data) => {
  try {
    const res = await Client.post('/auth/register', data)
    return res.data
  } catch (error) {
    throw error
  }
}

export const UpdateUserPassword = async (data) => {
  try {
    const res = await Client.post('/auth/update', data)
    return res.data
  } catch (error) {
    return 'ERROR'
  }
}

export const CheckSession = async () => {
  try {
    const res = await Client.get('/auth/session')
    return res.data
  } catch (error) {
    throw error
  }
}
