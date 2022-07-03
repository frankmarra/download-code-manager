import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { useRouter } from 'next/router'
import { parseCookies } from '../helpers'
import Nav from '../components/navbar'

export async function getServerSideProps({ req }) {
  const cookieString = parseCookies(req)
  const cookies = JSON.parse(cookieString.user)

  const res = await axios.get(
    `http://localhost:3001/api/labels/${cookies.user.labelId}`
  )
  const label = res.data

  return {
    props: { user: cookies, label: label }
  }
}

const UpdateLabel = ({ user, label }) => {
  const [cookies] = useCookies(['user'])
  const [formValues, setFormValues] = useState({
    email: label ? label.email : '',
    url: label ? label.url : '',
    logo: label ? label.logo : '',
    redeemLink: label ? label.redeemLink : ''
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await axios.put(
      `http://localhost:3001/api/labels/${user.user.labelId}`,
      formValues
    )
    user.user.labelId == null
      ? router.push('/')
      : router.push(`/labels/${user.user.labelId}`)
  }

  return (
    <div className="update-label-page">
      {label && (
        <div className="update-label-form-wrapper">
          <h1>Update {`${label.name}`}</h1>
          <form className="update-label-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="email">E-mail:</label>
              <input
                onChange={handleChange}
                name="email"
                type="email"
                value={formValues.email}
                required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="url">Label site:</label>
              <input
                onChange={handleChange}
                name="url"
                type="text"
                value={formValues.url}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="logo">Label Logo:</label>
              <input
                onChange={handleChange}
                name="logo"
                type="text"
                value={formValues.logo}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="redeemLink">Redemption Link:</label>
              <input
                onChange={handleChange}
                name="redeemLink"
                type="text"
                value={formValues.redeemLink}
              />
            </div>
            <button type="submit" className="update-label-button">
              Update Label
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default UpdateLabel
