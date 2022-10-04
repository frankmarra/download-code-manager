//Download code manager sign in page

import { useState } from 'react'
import { SignInUser } from '../services/Auth'
import { useRouter } from 'next/router'
import { useCookies } from 'react-cookie'
import Client from '../services/api'

//get all labels from the database.  Will soon add artists and albums to this.
export async function getServerSideProps() {
  const res = await Client.get(`/labels/`)
  const labels = res.data

  return { props: { labels } }
}

const SignIn = ({ labels }) => {
  const [cookies, setCookie] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  })
  const [signinError, setSigninError] = useState(false)
  const router = useRouter()

  //handle user input for email and password
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value })
  }

  //Validates user and password.  If there is an error, it resets the fields and instructs
  //user to re-enter email and password.  If the user is validated, they will be sent to the label page that
  //they are associated with.  Also sets a cookie that is used for authorization.  Will soon also add artist to this.
  const handleSubmit = async (e) => {
    e.preventDefault()
    let payload = await SignInUser(formValues)

    if (payload === 'ERROR') {
      setFormValues({ email: '', password: '' })
      setSigninError(true)
    } else {
      labels.forEach((label) => {
        if (label.id === payload.user.labelId) {
          payload = { ...payload, userLabelSlug: label.slug }
        }
      })
      setCookie('user', payload, { path: '/' })

      if (!payload.user.labelId) {
        router.push('/')
      } else {
        router.push(`/labels/${payload.userLabelSlug}`)
      }
    }
  }

  return (
    <section className="form-container">
      <div id="signin-form-wrapper" className="u-flex-column u-flow">
        <h1>Sign In</h1>
        <form
          className="signin-form u-flex-column u-flow"
          onSubmit={handleSubmit}
        >
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              id="email"
              type="email"
              value={formValues.email}
              required
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              id="password"
              type="password"
              value={formValues.password}
              required
            />
          </div>
          <button
            type="submit"
            className="btn primary"
            disabled={!formValues.email || !formValues.password}
          >
            Sign In
          </button>
        </form>
        {signinError ? (
          <h3>
            You have entered the wrong E-mail or Password. Please try again.
          </h3>
        ) : null}
      </div>
    </section>
  )
}

export default SignIn
