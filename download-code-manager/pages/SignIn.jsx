import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import axios from 'axios'

const SignIn = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    labelEmail: '',
    labelPassword: ''
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = await SignInUser(formValues)
    setCookie('userId', payload)
    setFormValues({ userEmail: '', userPassword: '' })
    router.push(`/labels/${payload.id}`)
  }

  return (
    <div className="signin-page">
      <div className="signin-form-wrapper">
        <h1>Log-In</h1>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="labelEmail">Email:</label>
            <input
              onChange={handleChange}
              name="labelEmail"
              type="email"
              placeholder="Enter Email"
              value={formValues.userEmail}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="labelPassword">Password</label>
            <input
              onChange={handleChange}
              name="labelPassword"
              type="password"
              value={formValues.labelPassword}
              required
            />
          </div>
          <button
            type="submit"
            className="signin-button"
            disabled={!formValues.labelEmail || !formValues.labelPassword}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
