import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const SignIn = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await SignInUser(formValues)
    setCookie('user', payload, { path: '/' })
    setFormValues({ email: '', password: '' })
    if (!payload.labelId) {
      router.push('/')
    } else {
      router.push(`/labels/${payload.labelId}`)
    }
  }

  return (
    <div className="signin-page">
      <div className="signin-form-wrapper">
        <h1>Log-In</h1>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email:</label>
            <input
              onChange={handleChange}
              name="email"
              type="email"
              placeholder="Enter Email"
              value={formValues.email}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              name="password"
              type="password"
              value={formValues.password}
              required
            />
          </div>
          <button
            type="submit"
            className="signin-button"
            disabled={!formValues.email || !formValues.password}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
